const express = require('express');
const router = express.Router();
const db = require('../db/database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

router.get('/', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const decoded = jwt.verify(token, JWT_SECRET);
  if (decoded.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const employees = db.prepare('SELECT id, name, email, role, manager_id FROM users').all();
  res.json(employees);
});

router.post('/', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { name, email, role, manager_id } = req.body;
  const insert = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, manager_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  insert.run(name, email, 'employee_hash', role, manager_id);
  res.json({ message: 'Employee added successfully.' });
});

module.exports = router;
