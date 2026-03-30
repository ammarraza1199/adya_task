require('dotenv').config();
const express = require('express');
const cors = require('cors');
const seed = require('./db/seed');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const leaveRoutes = require('./routes/leaves');
const attendanceRoutes = require('./routes/attendance');
const payrollRoutes = require('./routes/payroll');
const employeeRoutes = require('./routes/employees');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Agentic HRMS Backend Running' });
});

// Crash Protection & Verbose Logging
process.on('uncaughtException', (err) => {
  console.log('CRITICAL: Uncaught Exception:', err.message);
  console.log(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

// Seed then Start
async function startServer() {
  try {
    console.log('Initializing Database...');
    await seed();
    app.listen(PORT, () => {
      console.log(`🚀 Neural Grid Status: ACTIVE on Port ${PORT}`);
      
      // Silent Heartbeat Monitor (Keeps the process alive without logging)
      setInterval(() => {}, 60000);
      
      process.stdin.resume(); // Persistent event loop stabilization
    });
  } catch (err) {
    console.log('DATABASE_SYNC_FAILURE:', err.message);
  }
}

startServer();
