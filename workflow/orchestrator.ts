import { v4 as uuidv4 } from 'uuid';
import {
  AgentReport,
  ExecutionPlan,
  WorkflowRun,
  WorkflowStatus,
  WorkflowStep,
} from '../agents/types';
import { MainAgent } from '../agents/main-agent/main-agent';
import {
  DEFAULT_ORCHESTRATOR_CONFIG,
  FinalWorkflowReport,
  OrchestratorConfig,
  WorkflowContext,
  WorkflowEvent,
  WorkflowEventType,
  WorkflowLog,
} from './workflow.types';

// ─────────────────────────────────────────────────────────────────────────────
//  NexusAI Workflow Orchestrator
//  Top-level controller for the 5-step multi-agent development workflow.
//  Delegates all agent work to MainAgent, tracks state, emits events.
// ─────────────────────────────────────────────────────────────────────────────

export class WorkflowOrchestrator {
  private mainAgent: MainAgent;
  private config: OrchestratorConfig;
  private eventListeners: ((event: WorkflowEvent) => void)[] = [];

  constructor(config: Partial<OrchestratorConfig> = {}) {
    this.config = { ...DEFAULT_ORCHESTRATOR_CONFIG, ...config };
    this.mainAgent = new MainAgent();
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Start a full workflow run for a given Jira ticket URL.
   * Steps: JIRA_EXPLORE → PLANNING → PARALLEL_DEV → QA_TESTING → COMPLETION
   */
  async run(jiraUrl: string, triggeredBy: string): Promise<FinalWorkflowReport> {
    const runId = uuidv4();
    const startedAt = new Date();

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  NexusAI Workflow Starting`);
    console.log(`  Run ID: ${runId}`);
    console.log(`  Jira URL: ${jiraUrl}`);
    console.log(`  Triggered by: ${triggeredBy}`);
    console.log(`${'═'.repeat(60)}\n`);

    const context: WorkflowContext = {
      jiraUrl,
      triggeredBy,
      logs: [],
    };

    // Build initial WorkflowRun state
    const run: WorkflowRun = {
      runId,
      jiraUrl,
      status: 'RUNNING',
      currentStep: 'JIRA_EXPLORE',
      steps: [
        { step: 'JIRA_EXPLORE',   status: 'PENDING', agentsInvolved: ['jira-explore-agent'] },
        { step: 'PLANNING',       status: 'PENDING', agentsInvolved: ['main-agent'] },
        { step: 'PARALLEL_DEV',   status: 'PENDING', agentsInvolved: ['frontend-agent', 'backend-agent'] },
        { step: 'QA_TESTING',     status: 'PENDING', agentsInvolved: ['qa-agent'] },
        { step: 'COMPLETION',     status: 'PENDING', agentsInvolved: ['main-agent'] },
      ],
      reports: [],
      startedAt,
      triggeredBy,
    };

    this.emit({ type: 'WORKFLOW_STARTED', runId, timestamp: new Date() });

    try {
      if (this.config.dryRun) {
        this.log(context, 'JIRA_EXPLORE', 'INFO', '🔍 Dry run mode — planning only, no agents invoked');
        return this.buildDryRunReport(runId, jiraUrl, startedAt, context);
      }

      // Delegate everything to the MainAgent
      const finalReport = await this.mainAgent.orchestrate({ jiraUrl, triggeredBy, runId });

      // Collect reports
      run.reports = Object.values(finalReport.agentReports).filter(Boolean) as AgentReport[];
      run.status = finalReport.status === 'SUCCESS' ? 'COMPLETED' : 'FAILED';
      run.completedAt = new Date();

      this.emit({ type: 'WORKFLOW_COMPLETED', runId, timestamp: new Date(), payload: { status: finalReport.status } });

      const duration = this.formatDuration(startedAt, run.completedAt);
      console.log(`\n${'═'.repeat(60)}`);
      console.log(`  ✅ Workflow ${finalReport.status}`);
      console.log(`  Duration: ${duration}`);
      console.log(`  Bugs Found: ${finalReport.bugsFound ?? 0}`);
      console.log(`${'═'.repeat(60)}\n`);

      return finalReport;

    } catch (err: any) {
      run.status = 'FAILED';
      run.completedAt = new Date();
      this.emit({ type: 'WORKFLOW_FAILED', runId, timestamp: new Date(), payload: { error: err.message } });

      console.error(`[Orchestrator] ❌ Workflow failed: ${err.message}`);

      return this.buildErrorReport(runId, jiraUrl, startedAt, err.message);
    }
  }

  // ─── Dry Run (plan only) ────────────────────────────────────────────────────
  async planOnly(jiraUrl: string, triggeredBy: string): Promise<void> {
    const orchestrator = new WorkflowOrchestrator({ ...this.config, dryRun: true });
    await orchestrator.run(jiraUrl, triggeredBy);
  }

  // ─── Event System ───────────────────────────────────────────────────────────
  onEvent(listener: (event: WorkflowEvent) => void): void {
    this.eventListeners.push(listener);
  }

  private emit(event: WorkflowEvent): void {
    for (const listener of this.eventListeners) {
      try { listener(event); } catch { /* ignore listener errors */ }
    }
  }

  // ─── Step State Helpers ──────────────────────────────────────────────────────
  private startStep(run: WorkflowRun, step: WorkflowStep): void {
    const s = run.steps.find((x) => x.step === step);
    if (s) { s.status = 'RUNNING'; s.startedAt = new Date(); }
    run.currentStep = step;
    this.emit({ type: 'STEP_STARTED', runId: run.runId, step, timestamp: new Date() });
    console.log(`[Orchestrator] ▶  Step: ${step}`);
  }

  private completeStep(run: WorkflowRun, step: WorkflowStep, output?: Record<string, any>): void {
    const s = run.steps.find((x) => x.step === step);
    if (s) { s.status = 'COMPLETED'; s.completedAt = new Date(); s.output = output; }
    this.emit({ type: 'STEP_COMPLETED', runId: run.runId, step, timestamp: new Date() });
    console.log(`[Orchestrator] ✅ Step Complete: ${step}`);
  }

  private failStep(run: WorkflowRun, step: WorkflowStep, error: string): void {
    const s = run.steps.find((x) => x.step === step);
    if (s) { s.status = 'FAILED'; s.completedAt = new Date(); s.error = error; }
    this.emit({ type: 'STEP_FAILED', runId: run.runId, step, timestamp: new Date(), payload: { error } });
    console.error(`[Orchestrator] ❌ Step Failed: ${step} — ${error}`);
  }

  // ─── Logging ────────────────────────────────────────────────────────────────
  private log(
    context: WorkflowContext,
    step: WorkflowStep,
    level: WorkflowLog['level'],
    message: string,
    agentName?: string,
  ): void {
    const entry: WorkflowLog = { timestamp: new Date(), step, level, message, agentName };
    context.logs.push(entry);
    const prefix = level === 'ERROR' ? '❌' : level === 'WARN' ? '⚠️' : 'ℹ️';
    console.log(`[Orchestrator][${step}] ${prefix} ${message}`);
  }

  // ─── Report Builders ─────────────────────────────────────────────────────────
  private buildErrorReport(
    runId: string,
    jiraUrl: string,
    startedAt: Date,
    error: string,
  ): FinalWorkflowReport {
    return {
      runId,
      jiraUrl,
      feature: 'Unknown',
      status: 'FAILED',
      duration: this.formatDuration(startedAt, new Date()),
      stepsCompleted: [],
      agentReports: {},
      filesCreated: { frontend: [], backend: [] },
      endpoints: [],
      components: [],
      qaStatus: 'SKIPPED',
      bugsFound: 0,
      recommendations: [`Fix orchestration error: ${error}`],
      completedAt: new Date(),
    };
  }

  private buildDryRunReport(
    runId: string,
    jiraUrl: string,
    startedAt: Date,
    context: WorkflowContext,
  ): FinalWorkflowReport {
    return {
      runId,
      jiraUrl,
      feature: 'Dry Run',
      status: 'PARTIAL',
      duration: this.formatDuration(startedAt, new Date()),
      stepsCompleted: [],
      agentReports: {},
      filesCreated: { frontend: [], backend: [] },
      endpoints: [],
      components: [],
      qaStatus: 'SKIPPED',
      bugsFound: 0,
      recommendations: ['Dry run complete. Remove dryRun flag to execute full workflow.'],
      completedAt: new Date(),
    };
  }

  // ─── Duration Formatter ──────────────────────────────────────────────────────
  private formatDuration(start: Date, end: Date): string {
    const ms = end.getTime() - start.getTime();
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
  }
}

// ─── Factory Function ─────────────────────────────────────────────────────────
export function createOrchestrator(config?: Partial<OrchestratorConfig>): WorkflowOrchestrator {
  return new WorkflowOrchestrator(config);
}
