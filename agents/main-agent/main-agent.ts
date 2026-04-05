import {
  AgentMeta,
  AgentReport,
  AgentTask,
  ExecutionPlan,
  JiraTicket,
  WorkflowRun,
  WorkflowStep,
  WorkflowStatus,
  AgentName,
  StepResult,
} from '../types';
import { FinalWorkflowReport } from '../../workflow/workflow.types';
import { JiraExploreStep } from '../../workflow/steps/step1-jira-explore';
import { PlanningStep } from '../../workflow/steps/step2-planning';
import { ParallelDevStep } from '../../workflow/steps/step3-parallel-dev';
import { QATestingStep } from '../../workflow/steps/step4-qa-testing';
import { CompletionStep } from '../../workflow/steps/step5-completion';
import { WorkflowContext } from '../../workflow/workflow.types';

// ─────────────────────────────────────────────────────────────────────────────
//  Main Agent — Orchestrator
//  Controls the entire workflow. Invokes all sub-agents. Never does dev work.
// ─────────────────────────────────────────────────────────────────────────────

export const MAIN_AGENT_META: AgentMeta = {
  name: 'main-agent',
  role: 'Orchestrator / Planner / Decision Maker / Progress Tracker',
  capabilities: [
    'planning',
    'agent-invocation',
    'decision-making',
    'progress-tracking',
    'report-generation',
    'failure-handling',
  ],
};

export class MainAgent {
  private run: WorkflowRun;

  constructor(jiraUrl = '', triggeredBy = 'system') {
    this.run = {
      runId: `run_${Date.now()}`,
      jiraUrl,
      status: 'PENDING',
      currentStep: 'JIRA_EXPLORE',
      steps: [],
      reports: [],
      startedAt: new Date(),
      triggeredBy,
    };
  }

  // ─── Top-Level Orchestrate ───────────────────────────────────────────────────
  // Called by WorkflowOrchestrator.run() — executes all 5 steps in sequence.
  async orchestrate(input: {
    jiraUrl: string;
    triggeredBy: string;
    runId: string;
  }): Promise<FinalWorkflowReport> {
    this.run.jiraUrl = input.jiraUrl;
    this.run.triggeredBy = input.triggeredBy;
    this.run.runId = input.runId;
    this.run.status = 'RUNNING';
    this.run.startedAt = new Date();

    const context: WorkflowContext = {
      jiraUrl: input.jiraUrl,
      triggeredBy: input.triggeredBy,
      logs: [],
    };

    const steps = [
      new JiraExploreStep(),
      new PlanningStep(),
      new ParallelDevStep(),
      new QATestingStep(),
      new CompletionStep(),
    ];

    for (const step of steps) {
      this.updateStep(step.name, 'RUNNING', []);
      try {
        const result = await step.execute(this.run, context);
        if (result.agentReports) this.run.reports.push(...result.agentReports);

        if (!result.success) {
          this.updateStep(step.name, 'FAILED', []);
          this.run.status = 'FAILED';
          break;
        }

        this.updateStep(step.name, 'COMPLETED', []);
      } catch (err: any) {
        this.updateStep(step.name, 'FAILED', []);
        this.run.status = 'FAILED';
        console.error(`[MainAgent] Step ${step.name} threw: ${err.message}`);
        break;
      }
    }

    this.run.completedAt = new Date();

    // Extract final report from completion step output
    const completionStep = this.run.steps.find((s) => s.step === 'COMPLETION');
    if (completionStep?.output?.finalReport) {
      return completionStep.output.finalReport as FinalWorkflowReport;
    }

    // Fallback report
    return {
      runId: this.run.runId,
      jiraUrl: this.run.jiraUrl,
      feature: this.run.ticket?.title ?? 'Unknown',
      status: this.run.status === 'COMPLETED' ? 'SUCCESS' : 'FAILED',
      duration: '0s',
      stepsCompleted: this.run.steps.filter((s) => s.status === 'COMPLETED').map((s) => s.step),
      agentReports: {},
      filesCreated: { frontend: [], backend: [] },
      endpoints: [],
      components: [],
      recommendations: [],
      completedAt: new Date(),
    };
  }

  // ─── Step 1: Invoke Jira Explore Agent ──────────────────────────────────────
  async invokeJiraExploreAgent(): Promise<AgentReport> {
    this.updateStep('JIRA_EXPLORE', 'RUNNING', ['jira-explore-agent']);
    console.log(`[MainAgent] → Invoking jira-explore-agent for: ${this.run.jiraUrl}`);

    // In Claude Cowork: read .claude/skills/jira-explore/SKILL.md and follow it
    // The jira-explore-agent returns a structured JiraTicket object
    const report = await this.delegateTo('jira-explore-agent', {
      action: 'ANALYZE_TICKET',
      jiraUrl: this.run.jiraUrl,
    });

    if (report.status === 'COMPLETED' && report.output.ticket) {
      this.run.ticket = report.output.ticket as JiraTicket;
      this.updateStep('JIRA_EXPLORE', 'COMPLETED', ['jira-explore-agent']);
      console.log(`[MainAgent] ✅ Jira analysis complete: "${this.run.ticket.title}"`);
    } else {
      this.updateStep('JIRA_EXPLORE', 'FAILED', ['jira-explore-agent']);
      throw new Error(`[MainAgent] ❌ Jira explore failed: ${report.issues.join(', ')}`);
    }

    return report;
  }

  // ─── Step 2: Create Execution Plan ──────────────────────────────────────────
  createExecutionPlan(): ExecutionPlan {
    this.updateStep('PLANNING', 'RUNNING', ['main-agent']);

    if (!this.run.ticket) throw new Error('[MainAgent] Cannot plan without a ticket.');

    const ticket = this.run.ticket;
    const tasks: AgentTask[] = [];

    // Assign frontend tasks
    if (ticket.scope === 'FRONTEND' || ticket.scope === 'FULLSTACK') {
      tasks.push({
        taskId: `task_fe_${Date.now()}`,
        assignedTo: 'frontend-agent',
        title: `Build UI for: ${ticket.title}`,
        description: `Implement all frontend components, pages, and API integrations as specified in the Jira ticket.`,
        context: {
          ticket,
          workingDirectory: 'frontend/',
          designLinks: ticket.designLinks,
          apiRequirements: ticket.apiRequirements,
        },
        priority: 'HIGH',
      });
    }

    // Assign backend tasks
    if (ticket.scope === 'BACKEND' || ticket.scope === 'FULLSTACK') {
      tasks.push({
        taskId: `task_be_${Date.now() + 1}`,
        assignedTo: 'backend-agent',
        title: `Build APIs for: ${ticket.title}`,
        description: `Implement all backend schemas, APIs, business logic, and validation as specified in the Jira ticket.`,
        context: {
          ticket,
          workingDirectory: 'backend/',
          apiRequirements: ticket.apiRequirements,
        },
        priority: 'HIGH',
      });
    }

    const plan: ExecutionPlan = {
      planId: `plan_${Date.now()}`,
      ticket,
      tasks,
      parallelGroups: [tasks.map((t) => t.taskId)], // all dev tasks run in parallel
      estimatedDuration: this.estimateDuration(tasks.length),
      risks: ticket.edgeCases.map((ec) => `Edge case: ${ec}`),
      createdBy: 'main-agent',
      createdAt: new Date(),
    };

    this.updateStep('PLANNING', 'COMPLETED', ['main-agent']);
    console.log(`[MainAgent] 📋 Execution plan created: ${tasks.length} task(s)`);

    return plan;
  }

  // ─── Step 3: Invoke Dev Agents (parallel) ───────────────────────────────────
  async invokeDevAgents(plan: ExecutionPlan): Promise<AgentReport[]> {
    this.updateStep('PARALLEL_DEV', 'RUNNING',
      plan.tasks.map((t) => t.assignedTo as AgentName));

    console.log(`[MainAgent] 🚀 Invoking ${plan.tasks.length} dev agent(s) in parallel...`);

    // Run all dev tasks in parallel
    const reports = await Promise.all(
      plan.tasks.map((task) =>
        this.delegateTo(task.assignedTo, {
          action: 'IMPLEMENT',
          task,
        }),
      ),
    );

    const allPassed = reports.every((r) => r.status === 'COMPLETED');
    this.updateStep('PARALLEL_DEV', allPassed ? 'COMPLETED' : 'FAILED',
      plan.tasks.map((t) => t.assignedTo as AgentName));

    this.run.reports.push(...reports);
    return reports;
  }

  // ─── Step 4: Invoke QA Agent ────────────────────────────────────────────────
  async invokeQAAgent(devReports: AgentReport[]): Promise<AgentReport> {
    this.updateStep('QA_TESTING', 'RUNNING', ['qa-agent']);
    console.log('[MainAgent] 🧪 Invoking qa-agent...');

    const report = await this.delegateTo('qa-agent', {
      action: 'TEST',
      ticket: this.run.ticket,
      devReports,
      frontendReport: devReports.find((r) => r.agentName === 'frontend-agent'),
      backendReport: devReports.find((r) => r.agentName === 'backend-agent'),
    });

    const allPassed = report.output?.qaReport?.overallStatus === 'PASS';
    this.updateStep('QA_TESTING', allPassed ? 'COMPLETED' : 'FAILED', ['qa-agent']);

    this.run.reports.push(report);
    return report;
  }

  // ─── Step 5: Deliver Final Report ───────────────────────────────────────────
  deliverFinalReport(): string {
    this.updateStep('COMPLETION', 'RUNNING', ['main-agent']);

    const ticket = this.run.ticket;
    const qaReport = this.run.reports.find((r) => r.agentName === 'qa-agent');
    const feReport = this.run.reports.find((r) => r.agentName === 'frontend-agent');
    const beReport = this.run.reports.find((r) => r.agentName === 'backend-agent');

    const allCompleted = this.run.reports.every((r) => r.status === 'COMPLETED');
    this.run.status = allCompleted ? 'COMPLETED' : 'FAILED';
    this.run.completedAt = new Date();

    const report = `
PROJECT COMPLETE REPORT
═══════════════════════════════════════

Ticket:          ${ticket?.title ?? 'N/A'}
Jira URL:        ${this.run.jiraUrl}
Scope:           ${ticket?.scope ?? 'N/A'}
Status:          ${this.run.status === 'COMPLETED' ? 'COMPLETED ✅' : 'FAILED ❌'}

─── Steps Summary ──────────────────────────────────────
${this.run.steps.map((s) => `${s.status === 'COMPLETED' ? '✅' : '❌'} ${s.step.padEnd(15)} → ${s.status}`).join('\n')}

─── Agents Invoked ─────────────────────────────────────
${this.run.reports.map((r) => `• ${r.agentName.padEnd(22)}: ${r.status}`).join('\n')}

─── Deliverables ───────────────────────────────────────
Frontend : ${feReport?.output?.filesCreated?.join(', ') ?? 'N/A'}
Backend  : ${beReport?.output?.filesCreated?.join(', ') ?? 'N/A'}

─── Issues Encountered ─────────────────────────────────
${this.run.reports.flatMap((r) => r.issues).join('\n') || 'None'}

─── QA Result ──────────────────────────────────────────
Status   : ${qaReport?.output?.qaReport?.overallStatus ?? 'N/A'}
Passed   : ${qaReport?.output?.qaReport?.passed?.length ?? 0} tests
Failed   : ${qaReport?.output?.qaReport?.failed?.length ?? 0} tests
Bugs     : ${qaReport?.output?.qaReport?.bugs?.length ?? 0}

Completed At: ${this.run.completedAt.toISOString()}
═══════════════════════════════════════
`.trim();

    this.updateStep('COMPLETION', 'COMPLETED', ['main-agent']);
    return report;
  }

  // ─── Private: Delegate to a sub-agent ───────────────────────────────────────
  // In Claude Cowork, this triggers the relevant agent skill.
  private async delegateTo(agentName: AgentName, payload: Record<string, any>): Promise<AgentReport> {
    // Claude Cowork reads the agent's AGENT.md and executes accordingly.
    // This function is the runtime bridge — in production, replace with your agent SDK call.
    console.log(`[MainAgent] → Delegating to ${agentName}:`, payload.action);

    return {
      agentName,
      taskId: payload.task?.taskId ?? `task_${Date.now()}`,
      status: 'COMPLETED',
      summary: `${agentName} completed ${payload.action}`,
      output: {},
      issues: [],
      completedAt: new Date(),
    };
  }

  // ─── Private: Update step status ────────────────────────────────────────────
  private updateStep(
    step: WorkflowStep,
    status: StepResult['status'],
    agentsInvolved: AgentName[],
  ) {
    const existing = this.run.steps.find((s) => s.step === step);
    if (existing) {
      existing.status = status;
      if (status === 'COMPLETED' || status === 'FAILED') existing.completedAt = new Date();
    } else {
      this.run.steps.push({
        step,
        status,
        agentsInvolved,
        startedAt: new Date(),
      });
    }
    this.run.currentStep = step;
  }

  private estimateDuration(taskCount: number): string {
    const mins = taskCount * 15;
    return mins >= 60 ? `~${Math.ceil(mins / 60)}h` : `~${mins}m`;
  }

  getRunState(): WorkflowRun { return this.run; }
}
