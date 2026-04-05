import { AgentReport, WorkflowRun } from '../../agents/types';
import { FinalWorkflowReport, StepHandler, StepHandlerResult, WorkflowContext } from '../workflow.types';

// ─────────────────────────────────────────────────────────────────────────────
//  Step 5 — Completion
//  Assembles the final PROJECT COMPLETE REPORT from all agent outputs.
//  Determines overall workflow status. Prints the summary to console.
// ─────────────────────────────────────────────────────────────────────────────

export class CompletionStep implements StepHandler {
  name = 'COMPLETION' as const;

  async execute(run: WorkflowRun, context: WorkflowContext): Promise<StepHandlerResult> {
    console.log(`[Step5:Completion] Assembling final report...`);

    const report = this.buildFinalReport(run, context);

    this.printFinalReport(report);

    return {
      success: report.status !== 'FAILED',
      output: { finalReport: report },
    };
  }

  // ─── Build Final Report ────────────────────────────────────────────────────
  private buildFinalReport(run: WorkflowRun, context: WorkflowContext): FinalWorkflowReport {
    const { ticket, frontendReport, backendReport, qaReport } = context;

    // Collect all files created
    const frontendFiles = (frontendReport?.output?.filesCreated as string[]) ?? [];
    const backendFiles  = (backendReport?.output?.filesCreated as string[]) ?? [];

    // Collect endpoints
    const endpoints = (backendReport?.output?.endpoints as string[]) ?? [];

    // Collect components
    const components: string[] = [];
    const fePlan = frontendReport?.output?.plan;
    if (fePlan?.components) {
      (fePlan.components as any[]).forEach((c) => components.push(c.name));
    }
    if (fePlan?.pages) {
      (fePlan.pages as any[]).forEach((p) => components.push(`Page: ${p.name}`));
    }

    // QA results
    const qaOverall = qaReport?.output?.qaReport?.overallStatus;
    const bugsFound = qaReport?.output?.bugs ?? 0;

    // Determine overall status
    const devFailed = [frontendReport, backendReport].some((r) => r?.status === 'FAILED');
    const qaFailed = qaReport?.status === 'FAILED';
    const overallStatus: FinalWorkflowReport['status'] =
      devFailed ? 'FAILED' :
      qaFailed  ? 'PARTIAL' :
      'SUCCESS';

    // Recommendations
    const recommendations = this.buildRecommendations(context, overallStatus, bugsFound);

    // Duration
    const duration = this.formatDuration(run.startedAt, new Date());

    // Which steps completed
    const stepsCompleted = run.steps
      .filter((s) => s.status === 'COMPLETED')
      .map((s) => s.step);

    return {
      runId: run.runId,
      jiraUrl: run.jiraUrl,
      feature: ticket?.title ?? 'Unknown Feature',
      status: overallStatus,
      duration,
      stepsCompleted,
      agentReports: {
        frontend: frontendReport,
        backend: backendReport,
        qa: qaReport,
      },
      filesCreated: {
        frontend: frontendFiles,
        backend: backendFiles,
      },
      endpoints,
      components,
      qaStatus: qaOverall ?? (qaReport ? 'SKIPPED' : 'SKIPPED'),
      bugsFound,
      recommendations,
      completedAt: new Date(),
    };
  }

  // ─── Build Recommendations ─────────────────────────────────────────────────
  private buildRecommendations(
    context: WorkflowContext,
    status: FinalWorkflowReport['status'],
    bugsFound: number,
  ): string[] {
    const recs: string[] = [];
    const { frontendReport, backendReport, qaReport } = context;

    if (status === 'SUCCESS' && bugsFound === 0) {
      recs.push('✅ All systems operational. Ready for code review and merge.');
      recs.push('Run `npm run build` in both frontend/ and backend/ to verify production build.');
      recs.push('Submit PR and assign to senior engineer for review.');
    }

    if (status === 'PARTIAL') {
      recs.push('⚠️  Workflow partially succeeded. Review bug reports before proceeding.');
      if (qaReport?.nextSteps) {
        qaReport.nextSteps.forEach((ns) => recs.push(ns));
      }
    }

    if (status === 'FAILED') {
      recs.push('❌ Workflow failed. Do not merge. Fix issues and re-run.');
      if (frontendReport?.status === 'FAILED') {
        recs.push(`Frontend agent failed: ${frontendReport.summary}`);
      }
      if (backendReport?.status === 'FAILED') {
        recs.push(`Backend agent failed: ${backendReport.summary}`);
      }
    }

    if (bugsFound > 0) {
      recs.push(`Address ${bugsFound} bug(s) identified by QA before deployment.`);
    }

    return recs;
  }

  // ─── Print Final Report ────────────────────────────────────────────────────
  private printFinalReport(report: FinalWorkflowReport): void {
    const statusIcon = report.status === 'SUCCESS' ? '✅' : report.status === 'PARTIAL' ? '⚠️' : '❌';
    const qaIcon = report.qaStatus === 'PASS' ? '✅' : report.qaStatus === 'FAIL' ? '❌' : '⚠️';

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  ${statusIcon} PROJECT COMPLETE REPORT`);
    console.log(`${'═'.repeat(60)}`);
    console.log(`  Run ID:   ${report.runId}`);
    console.log(`  Feature:  ${report.feature}`);
    console.log(`  Status:   ${report.status}`);
    console.log(`  Duration: ${report.duration}`);
    console.log(`  Jira:     ${report.jiraUrl}`);
    console.log(`${'─'.repeat(60)}`);

    if (report.endpoints.length > 0) {
      console.log(`  BACKEND ENDPOINTS (${report.endpoints.length}):`);
      report.endpoints.forEach((e) => console.log(`    ${e}`));
    }

    if (report.components.length > 0) {
      console.log(`  FRONTEND COMPONENTS (${report.components.length}):`);
      report.components.forEach((c) => console.log(`    • ${c}`));
    }

    if (report.filesCreated.backend.length > 0) {
      console.log(`  BACKEND FILES CREATED (${report.filesCreated.backend.length}):`);
      report.filesCreated.backend.slice(0, 8).forEach((f) => console.log(`    ${f}`));
      if (report.filesCreated.backend.length > 8) {
        console.log(`    ... and ${report.filesCreated.backend.length - 8} more`);
      }
    }

    if (report.filesCreated.frontend.length > 0) {
      console.log(`  FRONTEND FILES CREATED (${report.filesCreated.frontend.length}):`);
      report.filesCreated.frontend.slice(0, 8).forEach((f) => console.log(`    ${f}`));
      if (report.filesCreated.frontend.length > 8) {
        console.log(`    ... and ${report.filesCreated.frontend.length - 8} more`);
      }
    }

    console.log(`${'─'.repeat(60)}`);
    console.log(`  ${qaIcon} QA Status: ${report.qaStatus ?? 'SKIPPED'} | Bugs: ${report.bugsFound ?? 0}`);
    console.log(`${'─'.repeat(60)}`);
    console.log(`  RECOMMENDATIONS:`);
    report.recommendations.forEach((r) => console.log(`    ${r}`));
    console.log(`${'═'.repeat(60)}\n`);
  }

  // ─── Duration Formatter ────────────────────────────────────────────────────
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
