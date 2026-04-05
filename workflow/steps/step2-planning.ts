import { v4 as uuidv4 } from 'uuid';
import { AgentTask, ExecutionPlan, JiraTicket, WorkflowRun } from '../../agents/types';
import { StepHandler, StepHandlerResult, WorkflowContext } from '../workflow.types';

// ─────────────────────────────────────────────────────────────────────────────
//  Step 2 — Planning
//  Main Agent creates the ExecutionPlan — which agents run, in what order,
//  what tasks they receive, and which tasks can run in parallel.
// ─────────────────────────────────────────────────────────────────────────────

export class PlanningStep implements StepHandler {
  name = 'PLANNING' as const;

  async execute(run: WorkflowRun, context: WorkflowContext): Promise<StepHandlerResult> {
    console.log(`[Step2:Planning] Building execution plan...`);

    if (!context.ticket) {
      return { success: false, output: {}, error: 'No ticket in context — Step 1 must complete first' };
    }

    const ticket = context.ticket;
    const plan = this.createExecutionPlan(run.runId, ticket);
    context.plan = plan;

    console.log(`[Step2:Planning] ✅ Plan created`);
    console.log(`[Step2:Planning]    Scope: ${ticket.scope}`);
    console.log(`[Step2:Planning]    Tasks: ${plan.tasks.length}`);
    console.log(`[Step2:Planning]    Parallel Groups: ${plan.parallelGroups.length}`);
    console.log(`[Step2:Planning]    Estimated Duration: ${plan.estimatedDuration}`);
    console.log(`[Step2:Planning]    Risks: ${plan.risks.length}`);

    this.printPlanSummary(plan);

    return {
      success: true,
      output: { plan },
      nextStep: 'PARALLEL_DEV',
    };
  }

  // ─── Create Execution Plan ──────────────────────────────────────────────────
  private createExecutionPlan(runId: string, ticket: JiraTicket): ExecutionPlan {
    const tasks: AgentTask[] = [];
    const parallelGroups: string[][] = [];
    const risks: string[] = [];

    const featureName = this.deriveFeatureName(ticket.title);

    // Always start with Jira Explore (already done in Step 1)
    // Now plan dev tasks based on scope

    if (ticket.scope === 'FRONTEND' || ticket.scope === 'FULLSTACK') {
      const feTask: AgentTask = {
        taskId: `${runId}-frontend`,
        assignedTo: 'frontend-agent',
        title: `Build ${featureName} Frontend`,
        description: ticket.description,
        context: {
          ticket,
          featureName,
          designLinks: ticket.designLinks,
          apiRequirements: ticket.apiRequirements,
          acceptanceCriteria: ticket.acceptanceCriteria,
        },
        priority: ticket.priority === 'CRITICAL' || ticket.priority === 'HIGH' ? 'HIGH' : 'MEDIUM',
      };
      tasks.push(feTask);
    }

    if (ticket.scope === 'BACKEND' || ticket.scope === 'FULLSTACK') {
      const beTask: AgentTask = {
        taskId: `${runId}-backend`,
        assignedTo: 'backend-agent',
        title: `Build ${featureName} Backend`,
        description: ticket.description,
        context: {
          ticket,
          featureName,
          apiRequirements: ticket.apiRequirements,
          acceptanceCriteria: ticket.acceptanceCriteria,
        },
        priority: ticket.priority === 'CRITICAL' || ticket.priority === 'HIGH' ? 'HIGH' : 'MEDIUM',
      };
      tasks.push(beTask);
    }

    // QA task (always)
    const qaTask: AgentTask = {
      taskId: `${runId}-qa`,
      assignedTo: 'qa-agent',
      title: `QA ${featureName}`,
      description: `Test all implementations for: ${ticket.title}`,
      context: { ticket, featureName },
      priority: 'HIGH',
      dependsOn: tasks.map((t) => t.taskId),
    };
    tasks.push(qaTask);

    // For FULLSTACK: frontend and backend run in parallel
    if (ticket.scope === 'FULLSTACK') {
      const feTaskId = tasks.find((t) => t.assignedTo === 'frontend-agent')?.taskId;
      const beTaskId = tasks.find((t) => t.assignedTo === 'backend-agent')?.taskId;
      if (feTaskId && beTaskId) parallelGroups.push([feTaskId, beTaskId]);
    }

    // Risk analysis
    if (ticket.dependencies.length > 0) {
      risks.push(`Depends on: ${ticket.dependencies.join(', ')} — ensure these are available`);
    }
    if (ticket.edgeCases.length > 5) {
      risks.push('High number of edge cases — QA phase will be thorough');
    }
    if (ticket.priority === 'CRITICAL') {
      risks.push('CRITICAL priority — zero tolerance for bugs, QA must PASS before delivery');
    }
    if (ticket.designLinks.length === 0 && (ticket.scope === 'FRONTEND' || ticket.scope === 'FULLSTACK')) {
      risks.push('No design links provided — frontend agent will use best judgment for UI');
    }

    const estimatedDuration = this.estimateDuration(ticket.scope, ticket.estimatedEffort);

    return {
      planId: uuidv4(),
      ticket,
      tasks,
      parallelGroups,
      estimatedDuration,
      risks,
      createdBy: 'main-agent',
      createdAt: new Date(),
    };
  }

  private deriveFeatureName(title: string): string {
    const cleaned = title.replace(/^(build|create|implement|add|scaffold|develop)\s+/i, '');
    const words = cleaned.split(/\s+/).slice(0, 2).join(' ');
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  private estimateDuration(scope: JiraTicket['scope'], effort?: string): string {
    if (effort) return effort;
    switch (scope) {
      case 'FRONTEND': return '2-3 hours';
      case 'BACKEND':  return '2-3 hours';
      case 'FULLSTACK': return '4-6 hours (parallel FE+BE)';
      default: return '3-5 hours';
    }
  }

  private printPlanSummary(plan: ExecutionPlan): void {
    console.log(`\n  📋 EXECUTION PLAN`);
    console.log(`  ─────────────────`);
    plan.tasks.forEach((t) => {
      const deps = t.dependsOn?.length ? ` (after: ${t.dependsOn.join(', ')})` : '';
      console.log(`  • [${t.assignedTo}] ${t.title}${deps}`);
    });
    if (plan.parallelGroups.length > 0) {
      console.log(`  ⚡ Parallel: ${plan.parallelGroups.map((g) => g.join(' & ')).join(' | ')}`);
    }
    if (plan.risks.length > 0) {
      console.log(`  ⚠️  Risks:`);
      plan.risks.forEach((r) => console.log(`     - ${r}`));
    }
    console.log(`  ⏱  Estimated: ${plan.estimatedDuration}\n`);
  }
}
