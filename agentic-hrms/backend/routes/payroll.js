const express = require('express');
const router = express.Router();
const db = require('../db/database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

router.get('/:userId', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const userId = req.params.userId === 'me' ? jwt.decode(token).id : req.params.userId;
  const payroll = db.prepare('SELECT * FROM payroll WHERE user_id = ?').all(userId);
  res.json(payroll);
});

module.exports = router;
