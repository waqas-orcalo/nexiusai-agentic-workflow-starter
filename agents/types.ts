// ─────────────────────────────────────────────────────────────────────────────
//  NexusAI — Shared Agent Types
//  All agents and the orchestrator import from this file.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Agent Identity ───────────────────────────────────────────────────────────
export type AgentName =
  | 'main-agent'
  | 'jira-explore-agent'
  | 'frontend-agent'
  | 'backend-agent'
  | 'qa-agent';

export type AgentStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'WAITING';

export interface AgentMeta {
  name: AgentName;
  role: string;
  capabilities: string[];
  workingDirectory?: string; // e.g. 'frontend/' or 'backend/'
}

// ─── Task ─────────────────────────────────────────────────────────────────────
export interface AgentTask {
  taskId: string;
  assignedTo: AgentName;
  title: string;
  description: string;
  context: Record<string, any>;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dependsOn?: string[]; // taskIds this task waits for
}

// ─── Report (each agent returns this to Main Agent) ──────────────────────────
export interface AgentReport {
  agentName: AgentName;
  taskId: string;
  status: 'COMPLETED' | 'FAILED' | 'PARTIAL';
  summary: string;
  output: Record<string, any>;
  issues: string[];
  completedAt: Date;
  nextSteps?: string[];
}

// ─── Jira Ticket ──────────────────────────────────────────────────────────────
export interface JiraTicket {
  ticketId: string;
  url: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  scope: 'FRONTEND' | 'BACKEND' | 'FULLSTACK';
  designLinks: string[];
  apiRequirements: ApiRequirement[];
  dependencies: string[];
  edgeCases: string[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedEffort?: string;
}

export interface ApiRequirement {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  description: string;
  requestBody?: Record<string, any>;
  responseShape?: Record<string, any>;
}

// ─── Workflow Execution ───────────────────────────────────────────────────────
export type WorkflowStep =
  | 'JIRA_EXPLORE'
  | 'PLANNING'
  | 'PARALLEL_DEV'
  | 'QA_TESTING'
  | 'COMPLETION';

export type WorkflowStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'FAILED';

export interface WorkflowRun {
  runId: string;
  jiraUrl: string;
  ticket?: JiraTicket;
  status: WorkflowStatus;
  currentStep: WorkflowStep;
  steps: StepResult[];
  reports: AgentReport[];
  startedAt: Date;
  completedAt?: Date;
  triggeredBy: string; // userId
}

export interface StepResult {
  step: WorkflowStep;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  agentsInvolved: AgentName[];
  startedAt?: Date;
  completedAt?: Date;
  output?: Record<string, any>;
  error?: string;
}

// ─── Execution Plan ───────────────────────────────────────────────────────────
export interface ExecutionPlan {
  planId: string;
  ticket: JiraTicket;
  tasks: AgentTask[];
  parallelGroups: string[][]; // taskIds that run in parallel
  estimatedDuration: string;
  risks: string[];
  createdBy: AgentName;
  createdAt: Date;
}

// ─── QA ───────────────────────────────────────────────────────────────────────
export interface BugReport {
  bugId: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  location: 'FRONTEND' | 'BACKEND' | 'INTEGRATION';
  steps: string[];
  expected: string;
  actual: string;
  screenshot?: string;
}

export interface QAReport {
  workflowRunId: string;
  testedFlows: string[];
  passed: string[];
  failed: string[];
  bugs: BugReport[];
  overallStatus: 'PASS' | 'FAIL' | 'PARTIAL';
  recommendations: string[];
  completedAt: Date;
}

// ─── Message bus (agents communicate through Main Agent) ─────────────────────
export interface AgentMessage {
  from: AgentName;
  to: AgentName | 'main-agent';
  type: 'TASK_ASSIGNED' | 'TASK_COMPLETE' | 'TASK_FAILED' | 'STATUS_UPDATE' | 'REQUEST_HELP';
  payload: Record<string, any>;
  timestamp: Date;
}
