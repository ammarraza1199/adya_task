const Groq = require("groq-sdk");
const { tools, toolImplementations } = require("./tools");

async function orchestrate(userId, userRole, userName, userMessage, history = []) {
  const logPulse = (msg) => process.stdout.write(`\n[NEURAL_PULSE]: ${msg}\n`);

  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing from .env");
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    logPulse(`Signal from ${userName} received. Initiating Groq Engine...`);

    const systemPrompt = `
      You are an AI HR Orchestrator for the year 2026.
      Current User: ${userName} (ID: ${userId}). 
      
      CRITICAL INSTRUCTIONS:
      1. ALWAYS use a tool if the user asks for: Payslips, Leaves, or Attendance.
      2. FOR PAYSLIPS: Use 'get_payslip' with month '2026-03'.
      3. NEVER use the year 2024.
      4. DO NOT TALK about code. Just perform the task and confirm like a human.
      5. LEAVE CLARIFICATION: If the user wants to apply for leave but DOES NOT provide BOTH the exact start and end dates, DO NOT CALL the apply_leave tool. Instead, reply normally asking them to clarify the exact start and end dates.
    `;

    let messages = [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({
        role: h.role === "user" ? "user" : "assistant",
        content: String(h.content),
      })).filter(m => m.content && !m.content.includes('<function') && !m.content.includes('Neural Engine Error'))
    ];

    messages.push({ role: "user", content: userMessage });

    const response = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant",
      tools: tools,
      tool_choice: "auto",
      temperature: 0.1,
    });

    const choice = response.choices[0];
    let rawContent = choice.message.content || "";
    let toolCalls = choice.message.tool_calls;

    // DEV TRACE: SEE THE RAW SIGNAL
    logPulse(`RAW AI OUTPUT: "${rawContent}"`);
    logPulse(`Tool calls found: ${toolCalls ? 'YES' : 'NO'}`);
    
    // NEURAL REPAIR FALLBACK
    if (!toolCalls) {
      const manualMatch = rawContent.match(/(\w+)[,:]\s*({[\s\S]*?})/);
      if (manualMatch) {
         logPulse(`Repairing manual tool-call: ${manualMatch[1]}`);
         toolCalls = [{
          function: {
            name: manualMatch[1].replace('function=', '').trim(),
            arguments: manualMatch[2]
          }
        }];
      }
    }

    let type = "text";
    let data = null;
    let message = rawContent
      .replace(/<function[\s\S]*?<\/function>/gi, "")
      .replace(/function=[\s\S]*?({[\s\S]*?})/gi, "")
      .replace(/\b\w+[,:]\s*({[\s\S]*?})/gi, "")
      .trim();

    if (toolCalls) {
      const toolCall = toolCalls[0];
      const toolName = toolCall.function.name.trim();
      let toolArgs = {};
      try { 
        let argString = toolCall.function.arguments.replace(/2024-/g, '2026-');
        toolArgs = JSON.parse(argString); 
      } catch(e) {}

      // ENFORCE IDENTITY SECURITY
      if (userRole === "admin") {
        if (!toolArgs.admin_id) toolArgs.admin_id = Number(userId);
      } else if (userRole === "manager") {
        toolArgs.manager_id = Number(userId);
      } else {
        toolArgs.user_id = Number(userId);
      }

      logPulse(`Executing Neural Tool: [${toolName}]`);
      const toolResult = await toolImplementations[toolName](toolArgs);

      if (toolName === "apply_leave") type = "leave_card_confirmation";
      else if (toolName === "get_attendance") type = "attendance_table";
      else if (toolName === "get_payslip" || toolName === "approve_payslip") type = "payslip";
      else if (toolName === "get_pending_leaves") type = "leave_list";
      else if (toolName === "get_pending_payslips") type = "payslip_request_list";
      else if (toolName === "get_employees") type = "employee_list";
      else if (toolName === "get_policies") type = "policy_list";

      data = toolResult;
      if (!message) message = toolResult.message;
    }

    return { message: message || "Request processed. Use the dashboard links if needed.", data, type };
  } catch (error) {
    process.stdout.write(`\n!!! NEURAL FAILURE: ${error.message} !!!\n`);
    return { message: "Neural Link interrupted. Please try again.", type: "text", data: null };
  }
}

module.exports = { orchestrate };
