# 🧠 Agentic HRMS (Human Resource Management System)

A next-generation, Conversational AI-powered HR platform. Built with a high-end **Dark Glassmorphism** aesthetic, featuring an intelligent Orchestrator Agent that handles real HR tasks via natural language.

---

## 🎨 Design Philosophy
- **Aesthetic**: Dark Luxury Command Center (#0A0A0F Base)
- **Glassmorphism**: Frosted glass cards with backdrop blurs and subtle noise textures.
- **Typography**: Sora (Headings) + JetBrains Mono (Data/Mono).
- **Accents**: 
  - 🔵 **Employee** (Indigo #6366F1)
  - 🟢 **Manager** (Emerald #10B981)
  - 🟡 **Admin** (Amber #F59E0B)

---

## 🚀 Technical Stack

### **Frontend**
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` plugin)
- **Animations**: Framer Motion (staggered loads, spring-bounce transitions)
- **Charts**: Recharts (Enterprise Analytics)
- **Icons**: Lucide React (premium stroke-based icons)

### **Backend**
- **Runtime**: Node.js + Express
- **Database**: SQLite via `better-sqlite3` (Zero-setup file-based database)
- **AI Agent**: Anthropic Claude API (`claude-3-5-sonnet-20241022`)
- **Orchestrator Logic**: Function-calling agent with real tool execution.
- **Authentication**: JWT (Stateless role-based sessions)

---

## 🔑 Login & Role Access

The system is pre-seeded with three distinct role types for demo purposes:

| Role | Username | Password | Key Capability |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin_hash` | Manage staff directory and system privileges. |
| **Manager** | `manager@example.com` | `manager_hash` | Approve/Reject leave requests via Chat. |
| **Employee** | `employee@example.com` | `employee_hash` | Apply for leaves, view payslips, and check attendance. |

> [!TIP]
> **Pro Tip:** Use the **Role Switcher** in the bottom-left sidebar toggle roles instantly without logging out.

---

## 🤖 AI Agent Tools (Available in Chat)

The `/api/chat` endpoint uses an Orchestrator Agent that can identify intent and trigger:
- `apply_leave()`: Submits leave requests directly to the DB.
- `get_leave_balance()`: Queries balance from the system.
- `get_pending_leaves()`: Fetches requests for manager review.
- `approve_leave()`: Performs state updates on leave entries.
- `get_attendance()`: Visualizes attendance tables in the chat.
- `get_payslip()`: Renders interactive payslip cards with animated numbers.

---

## 🛠️ Installation & Setup

### 1. Clone & Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment
Create a `.env` file in the `/backend` directory:
```env
ANTHROPIC_API_KEY=your_claude_api_key_here
JWT_SECRET=super-secret-key
PORT=3001
```

### 3. Run the Platform
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The app will be available at: **`http://localhost:5173`**

---

## 📁 Repository Structure
- `/backend`: Express server, AI agents, SQLite schema and seeds.
- `/frontend`: React application, Tailwind v4 config, and glassmorphic components.
- `/db`: Auto-generated `hrms.db` SQLite file.

---

## ✅ Feature Checklist
- [x] **Dark Glassmorphism UI**: High-end premium feel.
- [x] **Animated Chat Interface**: Staggered slide-ins and rich UI responses.
- [x] **Role-Based Workflows**: Tailored views for Admin, Manager, and Employee.
- [x] **Dynamic Sidebar**: Content adapts based on user session role.
- [x] **Analytics Dashboard**: Real-time charts tracking staff and payroll.
- [x] **Interactive Tool Calling**: Real Database updates via Chat.
