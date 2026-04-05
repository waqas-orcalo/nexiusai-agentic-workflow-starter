import { JiraExploreAgent } from '../../agents/jira-explore-agent/jira-explore-agent';
import { AgentTask, JiraTicket, WorkflowRun } from '../../agents/types';
import { StepHandler, StepHandlerResult, WorkflowContext } from '../workflow.types';

// ─────────────────────────────────────────────────────────────────────────────
//  Step 1 — Jira Explore
//  Fetches and analyzes the Jira ticket.
//  Output: JiraTicket with scope, acceptance criteria, API requirements
// ─────────────────────────────────────────────────────────────────────────────

export class JiraExploreStep implements StepHandler {
  name = 'JIRA_EXPLORE' as const;
  private agent = new JiraExploreAgent();

  async execute(run: WorkflowRun, context: WorkflowContext): Promise<StepHandlerResult> {
    console.log(`[Step1:JiraExplore] Analyzing: ${context.jiraUrl}`);

    const task: AgentTask = {
      taskId: `${run.runId}-jira`,
      assignedTo: 'jira-explore-agent',
      title: 'Analyze Jira Ticket',
      description: `Fetch and extract structured information from: ${context.jiraUrl}`,
      context: { jiraUrl: context.jiraUrl },
      priority: 'HIGH',
    };

    const report = await this.agent.analyze({ jiraUrl: context.jiraUrl });

    if (report.status !== 'COMPLETED') {
      return {
        success: false,
        output: {},
        error: `Jira Explore Agent failed: ${report.summary}`,
        agentReports: [report],
      };
    }

    const ticket = report.output.ticket as JiraTicket;
    context.ticket = ticket;

    console.log(`[Step1:JiraExplore] ✅ Ticket extracted: ${ticket.title}`);
    console.log(`[Step1:JiraExplore]    Scope: ${ticket.scope}`);
    console.log(`[Step1:JiraExplore]    Priority: ${ticket.priority}`);
    console.log(`[Step1:JiraExplore]    Acceptance Criteria: ${ticket.acceptanceCriteria.length} items`);
    console.log(`[Step1:JiraExplore]    API Requirements: ${ticket.apiRequirements.length} endpoints`);

    return {
      success: true,
      output: {
        ticket,
        textReport: report.output.textReport,
      },
      nextStep: 'PLANNING',
      agentReports: [report],
    };
  }
}
