import { FrontendAgent } from '../../agents/frontend-agent/frontend-agent';
import { BackendAgent } from '../../agents/backend-agent/backend-agent';
import { AgentReport, AgentTask, WorkflowRun } from '../../agents/types';
import { StepHandler, StepHandlerResult, WorkflowContext } from '../workflow.types';

// ─────────────────────────────────────────────────────────────────────────────
//  Step 3 — Parallel Dev
//  Invokes Frontend Agent and Backend Agent simultaneously (Promise.all).
//  For FRONTEND-only or BACKEND-only scopes, only one agent runs.
// ─────────────────────────────────────────────────────────────────────────────

export class ParallelDevStep implements StepHandler {
  name = 'PARALLEL_DEV' as const;
  private frontendAgent = new FrontendAgent();
  private backendAgent = new BackendAgent();

  async execute(run: WorkflowRun, context: WorkflowContext): Promise<StepHandlerResult> {
    console.log(`[Step3:ParallelDev] Starting development phase...`);

    if (!context.plan || !context.ticket) {
      return { success: false, output: {}, error: 'No plan or ticket — Steps 1 and 2 must complete first' };
    }

    const { plan, ticket } = context;
    const scope = ticket.scope;
    const agentReports: AgentReport[] = [];

    // Find tasks from plan
    const feTask = plan.tasks.find((t) => t.assignedTo === 'frontend-agent');
    const beTask = plan.tasks.find((t) => t.assignedTo === 'backend-agent');

    try {
      if (scope === 'FULLSTACK') {
        // ── Run FE + BE in PARALLEL ──────────────────────────────────────────
        console.log(`[Step3:ParallelDev] ⚡ Launching Frontend + Backend agents in PARALLEL`);

        const [feReport, beReport] = await Promise.all([
          this.runFrontend(feTask!),
          this.runBackend(beTask!),
        ]);

        context.frontendReport = feReport;
        context.backendReport = beReport;
        agentReports.push(feReport, beReport);

        this.logReport('Frontend', feReport);
        this.logReport('Backend', beReport);

      } else if (scope === 'FRONTEND') {
        // ── Frontend only ─────────────────────────────────────────────────────
        console.log(`[Step3:ParallelDev] Running Frontend Agent only`);
        const feReport = await this.runFrontend(feTask!);
        context.frontendReport = feReport;
        agentReports.push(feReport);
        this.logReport('Frontend', feReport);

      } else if (scope === 'BACKEND') {
        // ── Backend only ──────────────────────────────────────────────────────
        console.log(`[Step3:ParallelDev] Running Backend Agent only`);
        const beReport = await this.runBackend(beTask!);
        context.backendReport = beReport;
        agentReports.push(beReport);
        this.logReport('Backend', beReport);
      }

      // Check if any agent failed
      const failedReports = agentReports.filter((r) => r.status === 'FAILED');
      if (failedReports.length > 0) {
        const errorMessages = failedReports.map((r) => `${r.agentName}: ${r.summary}`).join('; ');
        return {
          success: false,
          output: { agentReports },
          error: `Dev agents failed: ${errorMessages}`,
          agentReports,
          nextStep: 'COMPLETION', // Skip QA, go to completion with failure status
        };
      }

      // Summarize what was built
      const summary = this.buildDevSummary(context);
      console.log(`[Step3:ParallelDev] ✅ Development complete`);
      console.log(summary);

      return {
        success: true,
        output: {
          frontendReport: context.frontendReport?.output,
          backendReport: context.backendReport?.output,
          summary,
        },
        nextStep: 'QA_TESTING',
        agentReports,
      };

    } catch (err: any) {
      return {
        success: false,
        output: {},
        error: `Parallel dev crashed: ${err.message}`,
        agentReports,
      };
    }
  }

  // ─── Agent Runners ───────────────────────────────────────────────────────────
  private async runFrontend(task: AgentTask): Promise<AgentReport> {
    console.log(`[Step3:ParallelDev] [Frontend] Starting: ${task.title}`);
    const report = await this.frontendAgent.implement(task);
    return report;
  }

  private async runBackend(task: AgentTask): Promise<AgentReport> {
    console.log(`[Step3:ParallelDev] [Backend] Starting: ${task.title}`);
    const report = await this.backendAgent.implement(task);
    return report;
  }

  // ─── Logging ─────────────────────────────────────────────────────────────────
  private logReport(label: string, report: AgentReport): void {
    const icon = report.status === 'COMPLETED' ? '✅' : '❌';
    console.log(`[Step3:ParallelDev] ${icon} ${label} Agent: ${report.status}`);
    console.log(`[Step3:ParallelDev]    ${report.summary}`);
    if (report.issues.length > 0) {
      report.issues.forEach((issue) => console.warn(`[Step3:ParallelDev]    ⚠️  ${issue}`));
    }
    if (report.nextSteps?.length) {
      report.nextSteps.forEach((ns) => console.log(`[Step3:ParallelDev]    → ${ns}`));
    }
  }

  private buildDevSummary(context: WorkflowContext): string {
    const lines: string[] = ['\n  📦 DEV SUMMARY', '  ─────────────'];
    const fe = context.frontendReport?.output;
    const be = context.backendReport?.output;

    if (fe) {
      lines.push(`  Frontend:`);
      (fe.filesCreated as string[] ?? []).slice(0, 5).forEach((f: string) => lines.push(`    • ${f}`));
      if ((fe.filesCreated as string[] ?? []).length > 5) {
        lines.push(`    ... and ${(fe.filesCreated as string[]).length - 5} more`);
      }
    }
    if (be) {
      lines.push(`  Backend:`);
      (be.filesCreated as string[] ?? []).slice(0, 5).forEach((f: string) => lines.push(`    • ${f}`));
      (be.endpoints as string[] ?? []).forEach((e: string) => lines.push(`    → ${e}`));
    }

    return lines.join('\n');
  }
}
