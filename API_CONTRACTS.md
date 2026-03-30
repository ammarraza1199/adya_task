# REST API References

While the **Agentic HRMS** operates primarily via the `POST /api/chat` Orchestrator endpoint executing native SQLite parameters via Groq AI tools natively, there is also a complete generic JSON HTTP REST implementation architecture built for manual front-end dashboard interactions securely.

### Authentication Standard
All endpoints below mandate a valid `Authorization: Bearer <token>` passing natively inside request Headers. Tokens expire securely after 24h explicitly.

---

## 🗃️ Dashboard Aggregate Data
`GET /api/dashboard/:userId`

Returns real-time analytics data derived exclusively relative to the user's encoded JWT role.

**Employee Response Sample**:
```json
{
  "role": "employee",
  "leaveBalance": 15,
  "netSalary": 4200,
  "presence": 98,
  "activeTasks": 5
}
```
**Manager Response Sample**:
```json
{
  "role": "manager",
  "leaveBalance": 20,
  "myTeamCount": 4,
  "teamPresence": 85,
  "deptSpend": 12500,
  "pendingApprovals": 2
}
```

---

## 📅 Leave Management
`GET /api/leaves`
Returns a unified array mapping native `total_leaves` parameters natively appended mapped to `attendance_lateness` calculations. Admin users retrieve universal scope; Managers view specific assigned hierarchies natively. 

`POST /api/leaves`
Manually submits a mathematical bounds-checked leave application. 
**Request Body Payload**:
```json
{
  "user_id": 3,
  "start_date": "2026-04-01",
  "end_date": "2026-04-05",
  "reason": "Family vacation"
}
```

`PATCH /api/leaves/:id`
Manually processes approval matrix. **If executing a rejection**, this endpoint internally traps the text payload routing sequentially directly up to `mixtral` / `llama-3.1-8b` engines returning the beautified professional formatting directly securely into `rejection_reason`.

---

## 💬 Neural Engine
`POST /api/chat`
**The fundamental intelligence backbone.** Expects array histories natively mapping local `messages`. The backend strips arrays natively validating parameters recursively interacting directly exclusively through Groq tool configurations mapping JSON component arrays securely.

**Request Payload:**
```json
{
  "message": "Show me all employees",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "How can I help you today?" }
  ]
}
```
