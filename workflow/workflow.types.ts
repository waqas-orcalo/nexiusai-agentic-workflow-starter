// ─────────────────────────────────────────────────────────────────────────────
//  Workflow — Internal Types
//  Extended types used only within the workflow orchestration layer
// ─────────────────────────────────────────────────────────────────────────────

import { AgentReport, ExecutionPlan, JiraTicket, WorkflowRun, WorkflowStep } from '../agents/types';

// ─── Step Handlers ─────────────────────────────────────────────────────────────
export interface StepHandler {
  name: WorkflowStep;
  execute(run: WorkflowRun, context: WorkflowContext): Promise<StepHandlerResult>;
}

export interface StepHandlerResult {
  success: boolean;
  output: Record<string, any>;
  nextStep?: WorkflowStep;
  error?: string;
  agentReports?: AgentReport[];
}

// ─── Workflow Context ─────────────────────────────────────────────────────────
// Passed through every step — accumulates state as workflow progresses
export interface WorkflowContext {
  jiraUrl: string;
  triggeredBy: string;

  // Populated after JIRA_EXPLORE step
  ticket?: JiraTicket;

  // Populated after PLANNING step
  plan?: ExecutionPlan;

  // Populated after PARALLEL_DEV step
  frontendReport?: AgentReport;
  backendReport?: AgentReport;

  // Populated after QA_TESTING step
  qaReport?: AgentReport;

  // Accumulated logs
  logs: WorkflowLog[];
}

export interface WorkflowLog {
  timestamp: Date;
  step: WorkflowStep;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  agentName?: string;
}

// ─── Orchestrator Config ──────────────────────────────────────────────────────
export interface OrchestratorConfig {
  maxRetries: number;         // How many times to retry a failed step
  stepTimeoutMs: number;      // Max time for a single step (ms)
  parallelDevTimeoutMs: number; // Max time for parallel FE+BE dev (ms)
  enableQA: boolean;          // Can disable QA for fast dev runs
  dryRun: boolean;            // Plan only — don't actually invoke agents
}

export const DEFAULT_ORCHESTRATOR_CONFIG: OrchestratorConfig = {
  maxRetries: 1,
  stepTimeoutMs: 5 * 60 * 1000,      // 5 minutes per step
  parallelDevTimeoutMs: 30 * 60 * 1000, // 30 minutes for dev
  enableQA: true,
  dryRun: false,
};

// ─── Workflow Events ──────────────────────────────────────────────────────────
export type WorkflowEventType =
  | 'WORKFLOW_STARTED'
  | 'STEP_STARTED'
  | 'STEP_COMPLETED'
  | 'STEP_FAILED'
  | 'AGENT_INVOKED'
  | 'AGENT_COMPLETED'
  | 'WORKFLOW_COMPLETED'
  | 'WORKFLOW_FAILED';

export interface WorkflowEvent {
  type: WorkflowEventType;
  runId: string;
  step?: WorkflowStep;
  agentName?: string;
  timestamp: Date;
  payload?: Record<string, any>;
}

// ─── Final Report ─────────────────────────────────────────────────────────────
export interface FinalWorkflowReport {
  runId: string;
  jiraUrl: string;
  feature: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  duration: string;
  stepsCompleted: WorkflowStep[];
  agentReports: {
    jiraExplore?: AgentReport;
    frontend?: AgentReport;
    backend?: AgentReport;
    qa?: AgentReport;
  };
  filesCreated: {
    frontend: string[];
    backend: string[];
  };
  endpoints: string[];
  components: string[];
  qaStatus?: 'PASS' | 'FAIL' | 'PARTIAL' | 'SKIPPED';
  bugsFound?: number;
  recommendations: string[];
  completedAt: Date;
}
