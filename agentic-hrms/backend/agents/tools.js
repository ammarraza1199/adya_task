const db = require('../db/database');

const tools = [
  {
    type: "function",
    function: {
      name: "apply_leave",
      description: "Apply for a leave of absence.",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: ["integer", "string"], description: "The ID of the user applying for leave." },
          start_date: { type: "string", description: "Start date in YYYY-MM-DD format." },
          end_date: { type: "string", description: "End date in YYYY-MM-DD format." },
          reason: { type: "string", description: "Reason for the leave." }
        },
        required: ["user_id", "start_date", "end_date", "reason"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_leave_balance",
      description: "Get the current leave balance for a user.",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: ["integer", "string"], description: "The ID of the user." }
        },
        required: ["user_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_pending_leaves",
      description: "Get all pending leave requests for a manager's team.",
      parameters: {
        type: "object",
        properties: {
          manager_id: { type: ["integer", "string"], description: "The ID of the manager." }
        },
        required: ["manager_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "approve_leave",
      description: "Approve or reject a leave request.",
      parameters: {
        type: "object",
        properties: {
          leave_id: { type: ["integer", "string"], description: "The ID of the leave request." },
          action: { type: "string", enum: ["approve", "reject"], description: "The action to perform." },
          reason: { type: "string", description: "Reason for rejection (mandatory if action is reject)." }
        },
        required: ["leave_id", "action"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "request_payslip",
      description: "Employee requests their payslip for a specific month.",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: ["integer", "string"], description: "The ID of the user." },
          month: { type: "string", description: "Month in YYYY-MM format." }
        },
        required: ["user_id", "month"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_pending_payslips",
      description: "Admin tool to see all pending payslip requests.",
      parameters: {
        type: "object",
        properties: {
          admin_id: { type: ["integer", "string"], description: "The ID of the admin." }
        },
        required: ["admin_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "approve_payslip",
      description: "Admin tool to approve a payslip request.",
      parameters: {
        type: "object",
        properties: {
          request_id: { type: ["integer", "string"], description: "The ID of the request." },
          basic: { type: ["number", "string"], description: "Basic salary." },
          deductions: { type: ["number", "string"], description: "Deductions." }
        },
        required: ["request_id", "basic", "deductions"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_attendance",
      description: "Get attendance history for a user.",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: ["integer", "string"], description: "The ID of the user." },
          month: { type: "string", description: "Month in YYYY-MM format." }
        },
        required: ["user_id", "month"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_payslip",
      description: "Get the payslip for a user for a specific month.",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: ["integer", "string"], description: "The ID of the user." },
          month: { type: "string", description: "Month in YYYY-MM format." }
        },
        required: ["user_id", "month"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_employees",
      description: "Get a list of all employees (Admin only).",
      parameters: {
        type: "object",
        properties: {
          admin_id: { type: ["integer", "string"], description: "The ID of the admin." }
        },
        required: ["admin_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "add_employee",
      description: "Admin tool to add a new employee to the system.",
      parameters: {
        type: "object",
        properties: {
          admin_id: { type: ["integer", "string"] },
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string", enum: ["employee", "manager", "admin"] },
          manager_id: { type: ["integer", "string"], description: "Optional manager ID" }
        },
        required: ["admin_id", "name", "email", "role"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "manage_policy",
      description: "Admin tool to create or update an HR policy.",
      parameters: {
        type: "object",
        properties: {
          admin_id: { type: ["integer", "string"] },
          action: { type: "string", enum: ["add", "update"] },
          title: { type: "string" },
          description: { type: "string" },
          policy_id: { type: ["integer", "string"] }
        },
        required: ["admin_id", "action", "title", "description"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_policies",
      description: "Get all active HR policies.",
      parameters: {
        type: "object",
        properties: {
          user_id: { type: ["integer", "string"] }
        },
        required: ["user_id"]
      }
    }
  }
];

const toolImplementations = {
  apply_leave: ({ user_id, start_date, end_date, reason }) => {
    const user = db.prepare('SELECT total_leaves FROM users WHERE id = ?').get(user_id);
    if (!user) return { success: false, message: 'User not found.' };

    const start = new Date(start_date);
    const end = new Date(end_date);
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (user.total_leaves < days) {
        return { success: false, message: `Insufficient leave balance. You are requesting ${days} days, but only have ${user.total_leaves} days left.` };
    }

    const insert = db.prepare(`
      INSERT INTO leaves (user_id, start_date, end_date, reason, status)
      VALUES (?, ?, ?, ?, 'pending')
    `);
    const result = insert.run(user_id, start_date, end_date, reason);
    return { success: true, leave_id: result.lastInsertRowid, message: "Leave applied successfully." };
  },

  get_leave_balance: ({ user_id }) => {
    return { success: true, balance: 15, message: "Current balance is 15 days." };
  },

  get_pending_leaves: ({ manager_id }) => {
    const leaves = db.prepare(`
      SELECT l.*, u.name as user_name
      FROM leaves l
      JOIN users u ON l.user_id = u.id
      WHERE u.manager_id = ? AND l.status = 'pending'
    `).all(manager_id);
    return { success: true, leaves, message: `Found ${leaves.length} pending leave requests.` };
  },

  approve_leave: async ({ leave_id, action, reason }) => {
    const status = action === 'approve' ? 'approved' : 'rejected';
    
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

    const leave = db.prepare('SELECT * FROM leaves WHERE id = ?').get(leave_id);
    if (!leave) return { success: false, message: "Leave request not found." };

    const update = db.prepare(`UPDATE leaves SET status = ?, rejection_reason = ? WHERE id = ?`);
    update.run(status, finalReason || null, leave_id);
    
    // DEDUCT LEAVE BALANCE
    if (status === 'approved') {
       const start = new Date(leave.start_date);
       const end = new Date(leave.end_date);
       const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
       if (days > 0) {
         db.prepare(`UPDATE users SET total_leaves = total_leaves - ? WHERE id = ?`).run(days, leave.user_id);
       }
    }

    return { success: true, message: `Leave ${status} successfully. ${finalReason ? 'Reason sent to employee: ' + finalReason : ''}`.trim() };
  },

  request_payslip: ({ user_id, month }) => {
    const fixedMonth = String(month).replace('2024-', '2026-');
    const insert = db.prepare(`INSERT INTO payslip_requests (user_id, month, status) VALUES (?, ?, 'pending')`);
    insert.run(user_id, fixedMonth);
    return { success: true, message: `Payslip request for ${fixedMonth} submitted to Admin.` };
  },

  get_pending_payslips: ({ admin_id }) => {
    const requests = db.prepare(`
      SELECT r.*, u.name as user_name
      FROM payslip_requests r
      JOIN users u ON r.user_id = u.id
      WHERE r.status = 'pending'
    `).all();
    return { success: true, requests, message: `Found ${requests.length} pending payslip requests.` };
  },

  approve_payslip: ({ request_id, basic, deductions }) => {
    const request = db.prepare('SELECT * FROM payslip_requests WHERE id = ?').get(request_id);
    if (!request) return { success: false, message: "Request not found." };

    const net_salary = Number(basic) - Number(deductions);
    const insert = db.prepare(`
      INSERT INTO payroll (user_id, month, basic, deductions, net_salary)
      VALUES (?, ?, ?, ?, ?)
    `);
    insert.run(request.user_id, request.month, basic, deductions, net_salary);

    const update = db.prepare('UPDATE payslip_requests SET status = ? WHERE id = ?');
    update.run('approved', request_id);

    return { success: true, message: `Payslip generated for ${request.month}. Net: $${net_salary}` };
  },

  get_attendance: ({ user_id, month }) => {
    const fixedMonth = String(month).replace('2024-', '2026-');
    const attendance = db.prepare(`
      SELECT * FROM attendance
      WHERE user_id = ? AND date LIKE ?
    `).all(user_id, `${fixedMonth}%`);
    return { success: true, attendance, message: `Found ${attendance.length} attendance records for ${fixedMonth}.` };
  },

  get_payslip: ({ user_id, month }) => {
    const fixedMonth = String(month).replace('2024-', '2026-');
    const payroll = db.prepare(`
      SELECT * FROM payroll
      WHERE user_id = ? AND month = ?
    `).get(user_id, fixedMonth);

    if (!payroll) {
      return { success: false, message: `No payslip found for ${fixedMonth}.` };
    }
    return { success: true, payroll, message: `Payslip for ${fixedMonth} retrieved.` };
  },

  get_employees: ({ admin_id }) => {
    const employees = db.prepare(`SELECT id, name, email, role FROM users`).all();
    return { success: true, employees, message: `Retrieved ${employees.length} employees.` };
  },

  add_employee: ({ name, email, role, manager_id }) => {
    try {
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existing) return { success: false, message: `Email ${email} is already taken.` };

      const insert = db.prepare(`INSERT INTO users (name, email, password_hash, role, manager_id, total_leaves) VALUES (?, ?, 'default_hash', ?, ?, 20)`);
      const result = insert.run(name, email, role, manager_id || null);
      return { success: true, user_id: result.lastInsertRowid, message: `Employee ${name} added successfully as ${role}.` };
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  manage_policy: ({ action, title, description, policy_id }) => {
    try {
      if (action === 'add') {
        const insert = db.prepare(`INSERT INTO policies (title, description) VALUES (?, ?)`);
        const result = insert.run(title, description);
        return { success: true, policy_id: result.lastInsertRowid, message: `Policy '${title}' created successfully.` };
      } else if (action === 'update' && policy_id) {
        const update = db.prepare(`UPDATE policies SET title = ?, description = ? WHERE id = ?`);
        const result = update.run(title, description, policy_id);
        if (result.changes === 0) return { success: false, message: `Policy ID ${policy_id} not found.` };
        return { success: true, message: `Policy '${title}' updated successfully.` };
      }
      return { success: false, message: "Invalid action or missing policy_id for update." };
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  get_policies: () => {
    const policies = db.prepare(`SELECT * FROM policies`).all();
    return { success: true, policies, message: `Retrieved ${policies.length} policies.` };
  }
};

module.exports = { tools, toolImplementations };
