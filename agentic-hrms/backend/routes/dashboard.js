const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Simulated token extraction middleware (based on auth routing)
// Here we'll just extract userId from query params for simplicity matching the chat layer,
// or we can expect it from req.headers.authorization
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user details for role and total_leaves
    const user = db.prepare('SELECT role, total_leaves FROM users WHERE id = ?').get(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Default response structure
    let dashboardStats = {
      role: user.role,
      leaveBalance: user.total_leaves || 0,
    };

    if (user.role === 'employee') {
      // Net Salary (last month)
      const lastPayslip = db.prepare('SELECT net_salary FROM payroll WHERE user_id = ? ORDER BY month DESC LIMIT 1').get(userId);
      dashboardStats.netSalary = lastPayslip ? lastPayslip.net_salary : 0;
      
      // My Presence (this week approx)
      const presenceData = db.prepare(`
        SELECT 
          COUNT(*) as total_days, 
          SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days 
        FROM attendance 
        WHERE user_id = ?
      `).get(userId);
      
      const presencePercent = presenceData.total_days > 0 
        ? Math.round((presenceData.present_days / presenceData.total_days) * 100) 
        : 100;
        
      dashboardStats.presence = presencePercent;
      dashboardStats.activeTasks = 5; // Placeholder
    } else if (user.role === 'manager') {
      const myTeamCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE manager_id = ?').get(userId).count;
      dashboardStats.myTeamCount = myTeamCount;
      
      const today = new Date().toISOString().split('T')[0];
      const teamPresenceData = db.prepare(`
        SELECT COUNT(*) as total_records, SUM(CASE WHEN status IN ('present', 'late') THEN 1 ELSE 0 END) as present_records
        FROM attendance a JOIN users u ON a.user_id = u.id
        WHERE u.manager_id = ? AND a.date = ?
      `).get(userId, today);
      
      dashboardStats.teamPresence = teamPresenceData.total_records > 0 
        ? Math.round((teamPresenceData.present_records / teamPresenceData.total_records) * 100) 
        : 100;
      
      const deptSpend = db.prepare(`
        SELECT SUM(p.net_salary) as total_spend
        FROM payroll p JOIN users u ON p.user_id = u.id
        WHERE u.manager_id = ?
      `).get(userId).total_spend;
      
      dashboardStats.deptSpend = deptSpend || 0;
      
      const pendingApprovals = db.prepare(`
        SELECT COUNT(*) as count FROM leaves l JOIN users u ON l.user_id = u.id WHERE u.manager_id = ? AND l.status = 'pending'
      `).get(userId).count;
      dashboardStats.pendingApprovals = pendingApprovals;
      
    } else if (user.role === 'admin') {
      const totalStaff = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
      const totalPayroll = db.prepare('SELECT SUM(net_salary) as sum FROM payroll').get().sum;
      
      dashboardStats.totalStaff = totalStaff;
      dashboardStats.payrollBudget = totalPayroll || 0;
      
      const today = new Date().toISOString().split('T')[0];
      const todaysAttendance = db.prepare(`
        SELECT COUNT(*) as count FROM attendance WHERE date = ? AND status IN ('present', 'late')
      `).get(today).count;
      
      dashboardStats.todaysAttendance = todaysAttendance || 0;
      
      const pendingPayslips = db.prepare("SELECT COUNT(*) as count FROM payslip_requests WHERE status = 'pending'").get().count;
      dashboardStats.pendingRequests = pendingPayslips;
    }

    res.json(dashboardStats);
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
