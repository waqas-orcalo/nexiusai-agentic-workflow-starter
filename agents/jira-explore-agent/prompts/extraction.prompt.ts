import { JiraRawData } from '../jira-explore-agent';

export function buildExtractionPrompt(raw: JiraRawData): string {
  return `
You have fetched the following raw Jira ticket data:

TICKET KEY:   ${raw.key}
SUMMARY:      ${raw.summary}
PRIORITY:     ${raw.priority}
LABELS:       ${raw.labels.join(', ') || 'None'}
COMPONENTS:   ${raw.components.join(', ') || 'None'}
STORY POINTS: ${raw.storyPoints ?? 'Not set'}

DESCRIPTION:
---
${raw.description}
---

ATTACHMENTS: ${raw.attachments.join(', ') || 'None'}
LINKED TICKETS: ${raw.links.join(', ') || 'None'}

Your task:
1. Extract the Acceptance Criteria (explicitly listed or inferred from description)
2. Classify scope as FRONTEND, BACKEND, or FULLSTACK
3. Extract all API endpoints mentioned (METHOD + path)
4. Extract all Figma/design links
5. List all edge cases or risks mentioned
6. Suggest a brief 3-step implementation approach

Respond with a filled-in JiraTicket object (JSON format) matching this interface:
{
  ticketId: string,
  url: string,
  title: string,
  description: string,
  acceptanceCriteria: string[],
  scope: 'FRONTEND' | 'BACKEND' | 'FULLSTACK',
  designLinks: string[],
  apiRequirements: { method, endpoint, description }[],
  dependencies: string[],
  edgeCases: string[],
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
  estimatedEffort?: string
}
  `.trim();
}
