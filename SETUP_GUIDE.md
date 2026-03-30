# Setup & Installation Guide ⚙️

This document outlines the exact process to securely replicate and deploy the **Agentic HRMS** on a local development environment.

### 🛑 Prerequisites
- **Node.js**: v18.0.0+ (Tested against Node 20.x natively)
- **NPM** or **Yarn** package manager.
- **Groq API Key**: A valid LLM platform key from [Groq Cloud](https://console.groq.com/).

---

## 🏗️ 1. Clone & Install
Clone the repository recursively entirely onto your local machine:
```bash
git clone https://github.com/ammarraza1199/adya_task.git
cd agentic-hrms
```

Install identical dependencies mapped for both architectures:
```bash
# Install Node Middleware Layers
cd backend
npm install

# Install Vite/React Client
cd ../frontend
npm install
```

---

## 🔐 2. Environment Variables
Secure application configuration requires an active `.env` file in the **backend** directory.
```bash
cd backend
touch .env
```
Inside `.env`, store your API credentials identically formatted:
```env
PORT=3001
JWT_SECRET=super_secret_enterprise_hrms_key
GROQ_API_KEY=gsk_your_private_groq_key_here
```

---

## 🗄️ 3. Database Seeding & Initialization
As this application uses `better-sqlite3`, there is no complex PostgreSQL overhead. A singular initialization script natively boots your schema locally mapping custom user IDs.

From `/agentic-hrms/backend`:
```bash
npm run seed
```
*(This triggers **DB Creation**, **Policy Injection**, and **Dummy Data Mapping** across Admin, Manager, and Employee profiles)*.

---

## 🚀 4. Execution & Port Mapping
You require two adjacent terminal instances to concurrently run the decoupled server & client apps reliably natively.

### 🔸 Start the Backend (API & Groq Engine)
```bash
cd backend
npm run dev
```
*(The neural orchestrator successfully mounts securely to `http://localhost:3001`)*

### 🔹 Start the Frontend (Vite Native)
```bash
cd frontend
npm run dev
```
*(The UI cleanly binds to `http://localhost:5173` locally)*

You can now navigate into the chat portal and simulate conversations executing identical workflows modeled inside the original Project Requirements.
