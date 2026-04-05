import { AgentMeta, AgentReport, JiraTicket, ApiRequirement } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
//  Jira Explore Agent
//  Reads a Jira ticket, extracts all requirements, returns structured report.
// ─────────────────────────────────────────────────────────────────────────────

export const JIRA_EXPLORE_AGENT_META: AgentMeta = {
  name: 'jira-explore-agent',
  role: 'Jira Analyst / Requirements Extractor',
  capabilities: [
    'read-jira-ticket',
    'extract-acceptance-criteria',
    'extract-api-requirements',
    'extract-design-links',
    'classify-scope',
    'identify-edge-cases',
    'risk-assessment',
  ],
};

export interface JiraExploreInput {
  jiraUrl: string;
  jiraBaseUrl?: string;    // e.g. https://org.atlassian.net
  jiraEmail?: string;
  jiraApiToken?: string;
}

export interface JiraRawData {
  key: string;
  summary: string;
  description: string;
  priority: string;
  labels: string[];
  components: string[];
  storyPoints?: number;
  attachments: string[];
  links: string[];
  customFields?: Record<string, any>;
}

export class JiraExploreAgent {
  private readonly taskId: string;

  constructor(taskId: string) {
    this.taskId = taskId;
  }

  // ─── Main Entry Point ────────────────────────────────────────────────────────
  async analyze(input: JiraExploreInput): Promise<AgentReport> {
    console.log(`[JiraExploreAgent] Analyzing: ${input.jiraUrl}`);

    try {
      // Step 1: Fetch raw ticket data
      const raw = await this.fetchTicket(input);

      // Step 2: Extract structured data
      const ticket = this.extractTicket(raw, input.jiraUrl);

      // Step 3: Build report
      const report: AgentReport = {
        agentName: 'jira-explore-agent',
        taskId: this.taskId,
        status: 'COMPLETED',
        summary: `Analyzed ticket "${ticket.title}" — Scope: ${ticket.scope}, Priority: ${ticket.priority}`,
        output: {
          ticket,
          rawSummary: this.buildTextReport(ticket),
        },
        issues: this.detectIssues(ticket),
        completedAt: new Date(),
        nextSteps: ['Main Agent should create an ExecutionPlan based on the extracted ticket'],
      };

      console.log(`[JiraExploreAgent] ✅ Analysis complete: "${ticket.title}"`);
      return report;

    } catch (err: any) {
      return {
        agentName: 'jira-explore-agent',
        taskId: this.taskId,
        status: 'FAILED',
        summary: `Failed to analyze Jira ticket: ${err.message}`,
        output: {},
        issues: [err.message],
        completedAt: new Date(),
      };
    }
  }

  // ─── Fetch Ticket from Jira REST API ────────────────────────────────────────
  private async fetchTicket(input: JiraExploreInput): Promise<JiraRawData> {
    // Extract ticket key from URL (e.g. NAP-42 from https://org.atlassian.net/browse/NAP-42)
    const key = this.extractTicketKey(input.jiraUrl);

    if (!input.jiraBaseUrl || !input.jiraApiToken) {
      // Return a mock for local/Claude Cowork usage
      return this.getMockTicket(key, input.jiraUrl);
    }

    const url = `${input.jiraBaseUrl}/rest/api/3/issue/${key}`;
    const headers = {
      Authorization: `Basic ${Buffer.from(`${input.jiraEmail}:${input.jiraApiToken}`).toString('base64')}`,
      'Content-Type': 'application/json',
    };

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Jira API error: ${res.status} ${res.statusText}`);

    const data: any = await res.json();
    return {
      key: data.key,
      summary: data.fields.summary,
      description: this.parseAtlassianDoc(data.fields.description),
      priority: data.fields.priority?.name ?? 'MEDIUM',
      labels: data.fields.labels ?? [],
      components: data.fields.components?.map((c: any) => c.name) ?? [],
      storyPoints: data.fields.story_points ?? data.fields.customfield_10016,
      attachments: data.fields.attachment?.map((a: any) => a.content) ?? [],
      links: data.fields.issuelinks?.map((l: any) => l.outwardIssue?.key).filter(Boolean) ?? [],
    };
  }

  // ─── Extract Structured JiraTicket ───────────────────────────────────────────
  private extractTicket(raw: JiraRawData, url: string): JiraTicket {
    return {
      ticketId: raw.key,
      url,
      title: raw.summary,
      description: raw.description,
      acceptanceCriteria: this.extractAcceptanceCriteria(raw.description),
      scope: this.classifyScope(raw),
      designLinks: this.extractDesignLinks(raw),
      apiRequirements: this.extractApiRequirements(raw.description),
      dependencies: raw.links,
      edgeCases: this.extractEdgeCases(raw.description),
      priority: this.normalizePriority(raw.priority),
      estimatedEffort: raw.storyPoints ? `${raw.storyPoints} story points` : undefined,
    };
  }

  // ─── Scope Classification ────────────────────────────────────────────────────
  private classifyScope(raw: JiraRawData): 'FRONTEND' | 'BACKEND' | 'FULLSTACK' {
    const text = `${raw.summary} ${raw.description} ${raw.labels.join(' ')} ${raw.components.join(' ')}`.toLowerCase();

    const frontendSignals = ['ui', 'page', 'component', 'screen', 'design', 'figma', 'layout', 'button', 'form', 'frontend'];
    const backendSignals = ['api', 'endpoint', 'schema', 'database', 'service', 'backend', 'auth', 'crud', 'migration', 'queue'];

    const hasFE = frontendSignals.some((s) => text.includes(s));
    const hasBE = backendSignals.some((s) => text.includes(s));

    if (hasFE && hasBE) return 'FULLSTACK';
    if (hasBE) return 'BACKEND';
    return 'FRONTEND'; // default to frontend if ambiguous
  }

  // ─── Extract Acceptance Criteria ─────────────────────────────────────────────
  private extractAcceptanceCriteria(description: string): string[] {
    const section = description.match(/acceptance criteria[:\s]*([\s\S]*?)(?:\n#{2,}|\n\*{3,}|$)/i);
    if (!section) {
      // Infer from description bullet points
      const bullets = description.match(/^[•\-\*]\s+(.+)$/gm) ?? [];
      return bullets.map((b) => b.replace(/^[•\-\*]\s+/, '').trim());
    }
    const lines = section[1].split('\n').filter((l) => l.trim().length > 0);
    return lines.map((l) => l.replace(/^[\d\.\-\*•]\s*/, '').trim());
  }

  // ─── Extract API Requirements ─────────────────────────────────────────────────
  private extractApiRequirements(description: string): ApiRequirement[] {
    const requirements: ApiRequirement[] = [];
    const apiPattern = /\b(GET|POST|PUT|PATCH|DELETE)\s+(\/[a-zA-Z0-9\/\-_{}:]+)/g;
    let match: RegExpExecArray | null;

    while ((match = apiPattern.exec(description)) !== null) {
      requirements.push({
        method: match[1] as ApiRequirement['method'],
        endpoint: match[2],
        description: `API endpoint extracted from ticket description`,
      });
    }

    return requirements;
  }

  // ─── Extract Design Links ────────────────────────────────────────────────────
  private extractDesignLinks(raw: JiraRawData): string[] {
    const allText = `${raw.description} ${raw.attachments.join(' ')}`;
    const figmaPattern = /https?:\/\/(?:www\.)?figma\.com\/[^\s"')]+/g;
    const imagePattern = /https?:\/\/[^\s"')]+\.(?:png|jpg|jpeg|gif|webp)/g;

    const figmaLinks = allText.match(figmaPattern) ?? [];
    const imageLinks = allText.match(imagePattern) ?? [];

    return [...new Set([...figmaLinks, ...imageLinks, ...raw.attachments])];
  }

  // ─── Extract Edge Cases ───────────────────────────────────────────────────────
  private extractEdgeCases(description: string): string[] {
    const section = description.match(/(?:edge cases?|risks?|notes?)[:\s]*([\s\S]*?)(?:\n#{2,}|$)/i);
    if (!section) return [];
    return section[1]
      .split('\n')
      .filter((l) => l.trim().length > 0)
      .map((l) => l.replace(/^[\d\.\-\*•]\s*/, '').trim());
  }

  // ─── Build Text Report ────────────────────────────────────────────────────────
  private buildTextReport(ticket: JiraTicket): string {
    return `
JIRA ANALYSIS REPORT
════════════════════════════════════════

Ticket ID:    ${ticket.ticketId}
Title:        ${ticket.title}
URL:          ${ticket.url}
Priority:     ${ticket.priority}
Scope:        ${ticket.scope}
Effort:       ${ticket.estimatedEffort ?? 'Not specified'}

─── Acceptance Criteria ─────────────────
${ticket.acceptanceCriteria.map((ac, i) => `${i + 1}. ${ac}`).join('\n') || 'None specified'}

─── API Requirements ────────────────────
${ticket.apiRequirements.map((api) => `${api.method.padEnd(7)} ${api.endpoint.padEnd(30)} ${api.description}`).join('\n') || 'None'}

─── Design Links ────────────────────────
${ticket.designLinks.join('\n') || 'None'}

─── Dependencies ────────────────────────
${ticket.dependencies.join('\n') || 'None'}

─── Edge Cases ──────────────────────────
${ticket.edgeCases.map((ec, i) => `${i + 1}. ${ec}`).join('\n') || 'None'}

════════════════════════════════════════
`.trim();
  }

  private detectIssues(ticket: JiraTicket): string[] {
    const issues: string[] = [];
    if (!ticket.acceptanceCriteria.length) issues.push('No acceptance criteria found — QA will be limited');
    if (!ticket.designLinks.length && (ticket.scope === 'FRONTEND' || ticket.scope === 'FULLSTACK'))
      issues.push('No design links found — frontend agent will need to infer layout');
    if (ticket.edgeCases.length === 0) issues.push('No edge cases documented — QA should probe for them');
    return issues;
  }

  private extractTicketKey(url: string): string {
    const match = url.match(/([A-Z]+-\d+)/);
    return match ? match[1] : 'TICKET-1';
  }

  private normalizePriority(p: string): JiraTicket['priority'] {
    const map: Record<string, JiraTicket['priority']> = {
      'Highest': 'CRITICAL', 'Critical': 'CRITICAL',
      'High': 'HIGH', 'Medium': 'MEDIUM', 'Low': 'LOW', 'Lowest': 'LOW',
    };
    return map[p] ?? 'MEDIUM';
  }

  private parseAtlassianDoc(doc: any): string {
    if (typeof doc === 'string') return doc;
    if (!doc?.content) return '';
    return doc.content
      .flatMap((block: any) => block.content?.map((c: any) => c.text ?? '') ?? [])
      .join('\n');
  }

  private getMockTicket(key: string, url: string): JiraRawData {
    return {
      key,
      summary: `[Mock] Feature from ${url}`,
      description: `This is a mock ticket for local development.\n\nAcceptance Criteria:\n- User can perform the action\n- System responds within 2 seconds\n- Error states are handled`,
      priority: 'HIGH',
      labels: ['frontend', 'backend'],
      components: ['API', 'UI'],
      storyPoints: 5,
      attachments: [],
      links: [],
    };
  }
}
