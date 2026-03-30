const db = require('./database');

async function seed() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL, -- 'employee', 'manager', 'admin'
      manager_id INTEGER,
      total_leaves INTEGER DEFAULT 20,
      FOREIGN KEY (manager_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS leaves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
      rejection_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS payslip_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      month TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL, -- 'present', 'absent', 'late', 'half_day'
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS payroll (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      month TEXT NOT NULL, -- 'YYYY-MM'
      basic REAL NOT NULL,
      deductions REAL NOT NULL,
      net_salary REAL NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  console.log('Tables created.');

  // Check if users exist before seeding
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('Seeding initial data...');

    // Add users
    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, manager_id, total_leaves)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertUser.run('Ammar Raza', 'admin@example.com', 'admin_hash', 'admin', null, 25); // 1
    insertUser.run('Jane Smith', 'manager@example.com', 'manager_hash', 'manager', 1, 22); // 2
    insertUser.run('John Doe', 'employee@example.com', 'employee_hash', 'employee', 2, 15); // 3
    insertUser.run('Alice Johnson', 'alice@example.com', 'employee_hash', 'employee', 2, 10); // 4
    insertUser.run('Bob Brown', 'bob@example.com', 'employee_hash', 'employee', 2, 5); // 5

    console.log('Users seeded.');

    // Add leaves
    const insertLeave = db.prepare(`
      INSERT INTO leaves (user_id, start_date, end_date, reason, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertLeave.run(3, '2026-04-01', '2026-04-03', 'Vacation', 'pending');
    insertLeave.run(4, '2026-03-25', '2026-03-26', 'Medical', 'approved');

    console.log('Leaves seeded.');

    // Add attendance
    const insertAttendance = db.prepare(`
      INSERT INTO attendance (user_id, date, status)
      VALUES (?, ?, ?)
    `);

    const statuses = ['present', 'present', 'present', 'late', 'absent'];
    const users = [1, 2, 3, 4, 5];
    const today = new Date().toISOString().split('T')[0];

    users.forEach(userId => {
      insertAttendance.run(userId, today, statuses[Math.floor(Math.random() * statuses.length)]);
    });

    console.log('Attendance seeded.');

    // Add payroll
    const insertPayroll = db.prepare(`
      INSERT INTO payroll (user_id, month, basic, deductions, net_salary)
      VALUES (?, ?, ?, ?, ?)
    `);

    users.forEach(userId => {
      insertPayroll.run(userId, '2026-03', 5000 + userId * 100, 200, 4800 + userId * 100);
    });

    console.log('Payroll seeded.');
  } else {
    console.log('Data already exists, skipping seed.');
  }
}

module.exports = seed;
