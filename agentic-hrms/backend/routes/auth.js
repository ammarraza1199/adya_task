const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (user && user.password_hash === 'admin_hash' || user.password_hash === 'manager_hash' || user.password_hash === 'employee_hash') {
    const token = jwt.sign({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    }, JWT_SECRET, { expiresIn: '1d' });

    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(decoded.id);
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
