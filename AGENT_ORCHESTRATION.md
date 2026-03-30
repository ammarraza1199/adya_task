# Agent Orchestration & Prompt Engineering

Building an Agentic application capable of Enterprise deployment inherently involves securing Large Language Models (LLMs) from hallucination risks, authorization leaks, and malicious task delegation.

The **Agentic HRMS** solves this via a robust `/backend/agents/orchestrator.js` runtime context wrapper natively built on top of the `Groq SDK`. 

## 1. Context Boundary Definition
Every generic LLM lacks spatial and temporal boundaries inherently natively. Our foundational System Prompt restricts identity mapping explicitly natively:
```javascript
const systemPrompt = \`
  You are an AI HR Orchestrator for the year 2026.
  Current User: \${userName} (ID: \${userId}).
...
\`
```
By constantly feeding localized dynamic React JWT bindings (Name, ID) into the base layer envelope natively, the model perfectly identifies generic queries locally (e.g., *"How many leaves do I have left?"* intrinsically binds `ID: X` to SQLite `user_id` without parsing manual inputs).

## 2. Hard Intercepts (RBAC Security)
Even an aligned LLM might accidentally structure JSON payloads outside its permission bounds (an Employee tricking the LLM into fetching the Admin payroll query). 
Our Orchestrator executes a **Hard Role-Based Parameter Override**:
```javascript
// ENFORCE IDENTITY SECURITY
if (userRole === "admin") {
  if (!toolArgs.admin_id) toolArgs.admin_id = Number(userId);
} else if (userRole === "manager") {
  toolArgs.manager_id = Number(userId);
} else {
  toolArgs.user_id = Number(userId);
}
```
If the LLM falsely outputs `{ "user_id": 5 }` while talking to User 2, the JavaScript layer forcefully obliterates the hallucinated field and binds explicitly to `user_id: 2` before `tools.js` is legally allowed to execute a database reading.

## 3. Mathematical Tool Validations
Unlike traditional Chatbots that merely act as UX frontends searching docs, our Agent is bound natively inside the application runtime.
When executing `apply_leave`, LLMs routinely fail to independently subtract leave arrays flawlessly.
Instead, the LLM constructs generic tool calls (`user_id`, `start_date`, `end_date`), natively returning control back to local Javascript runtime endpoints:
```javascript
const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

if (user.total_leaves < days) {
  return { success: false, message: 'Insufficient leave balance.' };
}
```
If verification logically fails locally, the AI Engine loops internally seamlessly sending an error back to the GUI chat envelope instead of an untraceable hallucinated confirmation.

## 4. Subroutine Pipelining (The Empathy Module)
The Orchestrator interacts seamlessly as a bi-directional proxy architecture handling text inputs natively. However, backend manual DB endpoints (`PATCH /api/leaves`) simultaneously invoke localized LLM execution subroutines silently natively natively verifying UI rejections. The system effectively spins up discrete instances of `llama-3.1-8b-instant` sequentially executing a 0-shot "Corporate Empathy" translation system prompt implicitly appending the database rows independently of external chat.
