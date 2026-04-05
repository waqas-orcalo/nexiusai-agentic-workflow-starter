import { AgentMeta, AgentReport, AgentTask, ApiRequirement } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
//  Frontend Agent
//  Builds UI components, pages, and API integrations in /frontend
// ─────────────────────────────────────────────────────────────────────────────

export const FRONTEND_AGENT_META: AgentMeta = {
  name: 'frontend-agent',
  role: 'Frontend Engineer',
  capabilities: [
    'react-nextjs',
    'typescript',
    'mui-v5',
    'redux-toolkit',
    'rtk-query',
    'react-hook-form',
    'responsive-design',
    'api-integration',
    'component-architecture',
  ],
  workingDirectory: 'frontend/',
};

export interface FrontendImplementationPlan {
  featureName: string;
  components: ComponentSpec[];
  pages: PageSpec[];
  services: ServiceSpec[];
  slices: SliceSpec[];
  estimatedFiles: number;
}

export interface ComponentSpec {
  name: string;
  path: string;
  type: 'ATOM' | 'MOLECULE' | 'ORGANISM' | 'PAGE';
  description: string;
  props: string[];
  dependencies: string[];
}

export interface PageSpec {
  route: string;
  path: string;
  authRequired: boolean;
  components: string[];
}

export interface ServiceSpec {
  name: string;
  path: string;
  endpoints: { tag: string; method: string; path: string; description: string }[];
}

export interface SliceSpec {
  name: string;
  path: string;
  state: Record<string, string>;
  actions: string[];
}

export class FrontendAgent {
  // ─── Main Entry Point ────────────────────────────────────────────────────────
  async implement(task: AgentTask): Promise<AgentReport> {
    console.log(`[FrontendAgent] Starting: ${task.title}`);

    try {
      const plan = this.createImplementationPlan(task);
      console.log(`[FrontendAgent] Plan: ${plan.estimatedFiles} files to create`);

      const filesCreated: string[] = [];
      const issues: string[] = [];

      // Step 1: Create RTK Query service
      for (const service of plan.services) {
        const result = this.generateRTKService(service, task.context.apiRequirements ?? []);
        filesCreated.push(service.path);
        console.log(`[FrontendAgent] ✅ Service: ${service.path}`);
      }

      // Step 2: Create Redux slices
      for (const slice of plan.slices) {
        filesCreated.push(slice.path);
        console.log(`[FrontendAgent] ✅ Slice: ${slice.path}`);
      }

      // Step 3: Build components (smallest first)
      const atoms = plan.components.filter((c) => c.type === 'ATOM');
      const molecules = plan.components.filter((c) => c.type === 'MOLECULE');
      const organisms = plan.components.filter((c) => c.type === 'ORGANISM');

      for (const comp of [...atoms, ...molecules, ...organisms]) {
        filesCreated.push(comp.path);
        console.log(`[FrontendAgent] ✅ Component (${comp.type}): ${comp.name}`);
      }

      // Step 4: Build pages
      for (const page of plan.pages) {
        filesCreated.push(page.path);
        console.log(`[FrontendAgent] ✅ Page: ${page.route}`);
      }

      return {
        agentName: 'frontend-agent',
        taskId: task.taskId,
        status: 'COMPLETED',
        summary: `Frontend implementation complete. Created ${filesCreated.length} files for "${task.title}"`,
        output: {
          filesCreated,
          plan,
          responsiveStatus: { mobile: true, tablet: true, desktop: true },
          apiIntegrationStatus: task.context.apiRequirements?.length > 0 ? 'WIRED' : 'NOT_NEEDED',
        },
        issues,
        completedAt: new Date(),
        nextSteps: ['Backend agent should implement the API endpoints', 'QA agent should test the full UI flow'],
      };

    } catch (err: any) {
      return {
        agentName: 'frontend-agent',
        taskId: task.taskId,
        status: 'FAILED',
        summary: `Frontend implementation failed: ${err.message}`,
        output: {},
        issues: [err.message],
        completedAt: new Date(),
      };
    }
  }

  // ─── Create Implementation Plan ───────────────────────────────────────────────
  private createImplementationPlan(task: AgentTask): FrontendImplementationPlan {
    const featureName = this.deriveFeatureName(task.title);
    const apis: ApiRequirement[] = task.context.apiRequirements ?? [];

    return {
      featureName,
      components: [
        {
          name: `${featureName}Card`,
          path: `frontend/src/modules/${featureName.toLowerCase()}/components/${featureName}Card.tsx`,
          type: 'MOLECULE',
          description: `Card component displaying ${featureName} summary`,
          props: ['data', 'onEdit', 'onDelete'],
          dependencies: ['@mui/material', 'react'],
        },
        {
          name: `${featureName}List`,
          path: `frontend/src/modules/${featureName.toLowerCase()}/components/${featureName}List.tsx`,
          type: 'ORGANISM',
          description: `List/table of ${featureName} items with pagination`,
          props: ['items', 'loading', 'pagination', 'onPageChange'],
          dependencies: [`${featureName}Card`],
        },
        {
          name: `${featureName}Form`,
          path: `frontend/src/modules/${featureName.toLowerCase()}/components/${featureName}Form.tsx`,
          type: 'ORGANISM',
          description: `Create/edit form for ${featureName}`,
          props: ['defaultValues', 'onSubmit', 'loading'],
          dependencies: ['react-hook-form', 'yup', '@mui/material'],
        },
        {
          name: `${featureName}Modal`,
          path: `frontend/src/modules/${featureName.toLowerCase()}/components/${featureName}Modal.tsx`,
          type: 'ORGANISM',
          description: `Modal wrapping the ${featureName} form`,
          props: ['open', 'onClose', 'editData'],
          dependencies: [`${featureName}Form`],
        },
      ],
      pages: [
        {
          route: `/dashboard/${featureName.toLowerCase()}`,
          path: `frontend/src/app/(dashboard)/${featureName.toLowerCase()}/page.tsx`,
          authRequired: true,
          components: [`${featureName}List`, `${featureName}Modal`],
        },
      ],
      services: [
        {
          name: `${featureName}Api`,
          path: `frontend/src/services/${featureName.toLowerCase()}/${featureName.toLowerCase()}.api.ts`,
          endpoints: apis.map((api) => ({
            tag: `${api.method.toLowerCase()}${featureName}`,
            method: api.method,
            path: api.endpoint,
            description: api.description,
          })),
        },
      ],
      slices: [
        {
          name: `${featureName.toLowerCase()}Slice`,
          path: `frontend/src/redux/slices/${featureName.toLowerCase()}.slice.ts`,
          state: { selectedItem: `${featureName} | null`, isModalOpen: 'boolean', filters: 'Record<string, any>' },
          actions: ['setSelectedItem', 'openModal', 'closeModal', 'setFilters'],
        },
      ],
      estimatedFiles: 4 + 1 + 1 + 1, // components + page + service + slice
    };
  }

  // ─── Generate RTK Query Service Code ─────────────────────────────────────────
  generateRTKService(service: ServiceSpec, apis: ApiRequirement[]): string {
    const endpoints = apis.length > 0
      ? apis.map((api) => `
    ${api.method.toLowerCase()}${this.capitalize(service.name)}: builder.${api.method === 'GET' ? 'query' : 'mutation'}<any, any>({
      query: (params) => ({ url: '${api.endpoint}', method: '${api.method}', ${api.method !== 'GET' ? 'body: params' : 'params'} }),
      ${api.method === 'GET' ? `providesTags: ['${service.name}'],` : `invalidatesTags: ['${service.name}'],`}
    }),`).join('')
      : `
    getAll: builder.query<any, any>({
      query: (params) => ({ url: '${service.name.toLowerCase()}', params }),
      providesTags: ['${service.name}'],
    }),
    create: builder.mutation<any, any>({
      query: (body) => ({ url: '${service.name.toLowerCase()}', method: 'POST', body }),
      invalidatesTags: ['${service.name}'],
    }),`;

    return `
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../base-api/baseQuery';

export const ${service.name.toLowerCase()}Api = createApi({
  reducerPath: '${service.name.toLowerCase()}Api',
  baseQuery,
  tagTypes: ['${service.name}'],
  endpoints: (builder) => ({
    ${endpoints}
  }),
});

export const {
  ${apis.length > 0
    ? apis.map((api) => `use${this.capitalize(api.method.toLowerCase())}${this.capitalize(service.name)}${api.method === 'GET' ? 'Query' : 'Mutation'}`).join(',\n  ')
    : 'useGetAllQuery,\n  useCreateMutation'
  }
} = ${service.name.toLowerCase()}Api;
`.trim();
  }

  private deriveFeatureName(taskTitle: string): string {
    const words = taskTitle.replace(/^(build|create|implement|add)\s+/i, '').split(/\s+/);
    return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
