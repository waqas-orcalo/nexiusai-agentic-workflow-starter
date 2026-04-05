import { QAAgent } from '../../agents/qa-agent/qa-agent';
import { AgentReport, AgentTask, WorkflowRun } from '../../agents/types';
import { StepHandler, StepHandlerResult, WorkflowContext } from '../workflow.types';

// ─────────────────────────────────────────────────────────────────────────────
//  Step 4 — QA Testing
//  Invokes the QA Agent with the completed dev reports.
//  QA runs only after BOTH (or the appropriate scope's) dev agents complete.
// ─────────────────────────────────────────────────────────────────────────────

export class QATestingStep implements StepHandler {
  name = 'QA_TESTING' as const;
  private qaAgent = new QAAgent();

  async execute(run: WorkflowRun, context: WorkflowContext): Promise<StepHandlerResult> {
    console.log(`[Step4:QATesting] Starting QA phase...`);

    if (!context.ticket) {
      return { success: false, output: {}, error: 'No ticket in context — cannot run QA' };
    }

    const ticket = context.ticket;
    const devReports: AgentReport[] = [
      ...(context.frontendReport ? [context.frontendReport] : []),
      ...(context.backendReport  ? [context.backendReport]  : []),
    ];

    if (devReports.length === 0) {
      return { success: false, output: {}, error: 'No dev reports found — QA requires dev to complete first' };
    }

    // Verify dev completed successfully before running QA
    const failedDev = devReports.filter((r) => r.status === 'FAILED');
    if (failedDev.length > 0) {
      console.warn(`[Step4:QATesting] ⚠️  Dev reports contain failures. QA will still run but expect failures.`);
      failedDev.forEach((r) => console.warn(`[Step4:QATesting]    ${r.agentName}: ${r.summary}`));
    }

    // Build QA task
    const featureName = this.deriveFeatureName(ticket.title);
    const qaTask: AgentTask = {
      taskId: `${run.runId}-qa`,
      assignedTo: 'qa-agent',
      title: `QA ${featureName}`,
      description: `Verify all implementations for: ${ticket.title}`,
      context: {
        ticket,
        featureName,
        frontendReport: context.frontendReport?.output,
        backendReport: context.backendReport?.output,
      },
      priority: ticket.priority === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
      dependsOn: devReports.map((r) => r.taskId),
    };

    console.log(`[Step4:QATesting] Invoking QA Agent...`);
    const qaReport = await this.qaAgent.test(qaTask, devReports);
    context.qaReport = qaReport;

    const icon = qaReport.status === 'COMPLETED' ? '✅' : qaReport.status === 'PARTIAL' ? '⚠️' : '❌';
    console.log(`[Step4:QATesting] ${icon} QA Status: ${qaReport.output.qaReport?.overallStatus ?? qaReport.status}`);
    console.log(`[Step4:QATesting]    Tests Passed: ${qaReport.output.passed ?? 0}`);
    console.log(`[Step4:QATesting]    Tests Failed: ${qaReport.output.failed ?? 0}`);
    console.log(`[Step4:QATesting]    Bugs Found: ${qaReport.output.bugs ?? 0}`);

    if (qaReport.issues.length > 0) {
      console.log(`[Step4:QATesting] Bug Summary:`);
      qaReport.issues.forEach((issue) => console.log(`[Step4:QATesting]    ${issue}`));
    }

    if (qaReport.nextSteps?.length) {
      console.log(`[Step4:QATesting] Next Steps:`);
      qaReport.nextSteps.forEach((ns) => console.log(`[Step4:QATesting]    → ${ns}`));
    }

    return {
      success: qaReport.status !== 'FAILED',
      output: { qaReport: qaReport.output },
      nextStep: 'COMPLETION',
      agentReports: [qaReport],
    };
  }

  private deriveFeatureName(title: string): string {
    const cleaned = title.replace(/^(build|create|implement|add|scaffold|develop)\s+/i, '');
    const word = cleaned.split(/\s+/)[0];
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}
