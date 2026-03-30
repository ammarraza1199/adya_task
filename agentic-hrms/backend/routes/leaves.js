const express = require('express');
const router = express.Router();
const db = require('../db/database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

router.get('/', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const decoded = jwt.verify(token, JWT_SECRET);
  let leaves;

  if (decoded.role === 'admin') {
    leaves = db.prepare(`
      SELECT l.*, u.name as user_name, u.total_leaves, 
             (SELECT COUNT(*) FROM attendance a WHERE a.user_id = u.id AND a.status = 'late') as late_count
      FROM leaves l JOIN users u ON l.user_id = u.id
    `).all();
  } else if (decoded.role === 'manager') {
    leaves = db.prepare(`
      SELECT l.*, u.name as user_name, u.total_leaves,
             (SELECT COUNT(*) FROM attendance a WHERE a.user_id = u.id AND a.status = 'late') as late_count
      FROM leaves l 
      JOIN users u ON l.user_id = u.id 
      WHERE u.manager_id = ? OR l.user_id = ?
    `).all(decoded.id, decoded.id);
  } else {
    leaves = db.prepare(`
      SELECT l.*, u.name as user_name, u.total_leaves,
             (SELECT COUNT(*) FROM attendance a WHERE a.user_id = u.id AND a.status = 'late') as late_count
      FROM leaves l JOIN users u ON l.user_id = u.id WHERE l.user_id = ?
    `).all(decoded.id);
  }

  res.json(leaves);
});

router.post('/', (req, res) => {
  const { user_id, start_date, end_date, reason } = req.body;
  
  const user = db.prepare('SELECT total_leaves FROM users WHERE id = ?').get(user_id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const start = new Date(start_date);
  const end = new Date(end_date);
  const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  
  if (user.total_leaves < days) {
    return res.status(400).json({ error: `Insufficient leave balance. You are requesting ${days} days, but only have ${user.total_leaves} days left.` });
  }

  const insert = db.prepare(`
    INSERT INTO leaves (user_id, start_date, end_date, reason)
    VALUES (?, ?, ?, ?)
  `);
  const result = insert.run(user_id, start_date, end_date, reason);
  res.json({ id: result.lastInsertRowid, message: 'Leave applied.' });
});

router.patch('/:id', async (req, res) => {
  const { status, reason } = req.body;
  const { id } = req.params;
  
  const leave = db.prepare('SELECT * FROM leaves WHERE id = ?').get(id);
  if (!leave) return res.status(404).json({ error: 'Leave request not found' });

  // AI BEAUTIFICATION OF REJECTION REASON
  let finalReason = reason;
  if (status === 'rejected' && reason && process.env.GROQ_API_KEY) {
    try {
      const Groq = require("groq-sdk");
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an AI HR assistant. Rewrite the following manager's leave rejection reason to be highly professional, empathetic, and polite corporate language. Keep it to one single sentence." },
          { role: "user", content: reason }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.3
      });
      if (response.choices && response.choices[0]) {
        finalReason = response.choices[0].message.content.trim().replace(/^"|"$/g, '');
      }
    } catch (err) {
      console.log("Neural Beautification Failed:", err.message);
    }
  }

  const update = db.prepare('UPDATE leaves SET status = ?, rejection_reason = ? WHERE id = ?');
  update.run(status, finalReason || null, id);

  // DEDUCT LEAVE BALANCE
  if (status === 'approved') {
     const start = new Date(leave.start_date);
     const end = new Date(leave.end_date);
     const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
     if (days > 0) {
       db.prepare(`UPDATE users SET total_leaves = total_leaves - ? WHERE id = ?`).run(days, leave.user_id);
     }
  }

  res.json({ message: `Leave ${status}.` });
});

module.exports = router;
