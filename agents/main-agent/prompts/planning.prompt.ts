import { JiraTicket } from '../../types';

export function buildPlanningPrompt(ticket: JiraTicket): string {
  return `
You are the Main Agent. You have received the following Jira analysis:

TICKET: ${ticket.title}
SCOPE:  ${ticket.scope}
PRIORITY: ${ticket.priority}

ACCEPTANCE CRITERIA:
${ticket.acceptanceCriteria.map((ac, i) => `  ${i + 1}. ${ac}`).join('\n')}

API REQUIREMENTS:
${ticket.apiRequirements.map((api) => `  ${api.method} ${api.endpoint} — ${api.description}`).join('\n') || '  None'}

EDGE CASES:
${ticket.edgeCases.map((ec, i) => `  ${i + 1}. ${ec}`).join('\n') || '  None'}

DEPENDENCIES:
${ticket.dependencies.join('\n') || '  None'}

Based on this analysis, create an ExecutionPlan:
1. List all tasks to assign (with the correct agent for each)
2. Identify which tasks can run in parallel
3. Identify any risks from the edge cases
4. Estimate total duration

Output a structured ExecutionPlan following the ExecutionPlan interface from agents/types.ts.
  `.trim();
}
