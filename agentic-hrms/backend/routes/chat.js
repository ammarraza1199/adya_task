const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { orchestrate } = require('../agents/orchestrator');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

router.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { message, history } = req.body;

    // Track original signal
    console.log(`[NETWORK PULSE] Received: "${message}" from user [${decoded.name}] (ID: ${decoded.id})`);

    const response = await orchestrate(
      decoded.id, 
      decoded.role, 
      decoded.name, 
      message, 
      history
    );

    res.json(response);
  } catch (err) {
    console.error('[CHAT_ROUTE_FAILURE]:', err.message);
    res.status(401).json({ error: 'Invalid token or internal error' });
  }
});

module.exports = router;
