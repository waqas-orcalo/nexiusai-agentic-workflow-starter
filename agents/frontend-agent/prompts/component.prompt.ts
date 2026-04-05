import { AgentTask } from '../../types';

export function buildComponentPrompt(task: AgentTask, existingComponents: string[]): string {
  return `
You are the Frontend Agent. Build the following feature:

TASK: ${task.title}
DESCRIPTION: ${task.description}
WORKING DIR: frontend/

EXISTING COMPONENTS (reuse these instead of recreating):
${existingComponents.map((c) => `• ${c}`).join('\n') || '• None yet'}

API REQUIREMENTS:
${task.context.apiRequirements?.map((api: any) =>
  `• ${api.method} ${api.endpoint} — ${api.description}`
).join('\n') || '• None specified'}

DESIGN LINKS:
${task.context.designLinks?.join('\n') || '• None provided — infer from description'}

Follow this order:
1. Create RTK Query service (frontend/src/services/[feature]/[feature].api.ts)
2. Create Redux slice if needed (frontend/src/redux/slices/[feature].slice.ts)
3. Build components from smallest to largest:
   - Atoms (simple display pieces)
   - Molecules (combinations of atoms)
   - Organisms (full feature sections with logic)
4. Build/update the page (frontend/src/app/(dashboard)/[feature]/page.tsx)
5. Ensure responsiveness with MUI breakpoints

For each file, output the FULL file content — no placeholders.
Use existing patterns from frontend/src/modules/courses/ as reference.
  `.trim();
}
