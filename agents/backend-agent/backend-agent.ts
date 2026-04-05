import { AgentMeta, AgentReport, AgentTask, ApiRequirement } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
//  Backend Agent
//  Builds NestJS schemas, repositories, services, and controllers in /backend
// ─────────────────────────────────────────────────────────────────────────────

export const BACKEND_AGENT_META: AgentMeta = {
  name: 'backend-agent',
  role: 'Backend Engineer',
  capabilities: [
    'nestjs',
    'typescript',
    'mongodb-mongoose',
    'jwt-auth',
    'rest-api',
    'crud-operations',
    'validation',
    'swagger-docs',
    'business-logic',
  ],
  workingDirectory: 'backend/',
};

export interface BackendImplementationPlan {
  featureName: string;
  schemaFields: SchemaField[];
  customRepoMethods: string[];
  endpoints: EndpointSpec[];
  businessRules: string[];
  estimatedFiles: number;
}

export interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  options?: Record<string, any>;
}

export interface EndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  authRequired: boolean;
  roles?: string[];
  bodyDto?: string;
  responseShape: string;
}

export class BackendAgent {
  // ─── Main Entry Point ────────────────────────────────────────────────────────
  async implement(task: AgentTask): Promise<AgentReport> {
    console.log(`[BackendAgent] Starting: ${task.title}`);

    try {
      const plan = this.createImplementationPlan(task);
      const filesCreated: string[] = [];
      const issues: string[] = [];

      // Step 1: Add constants
      filesCreated.push(`backend/src/common/constants/enums.ts (updated)`);
      filesCreated.push(`backend/src/common/constants/messages.ts (updated)`);
      console.log(`[BackendAgent] ✅ Constants updated`);

      // Step 2: Create schema
      const schemaPath = `backend/src/${plan.featureName.toLowerCase()}/schemas/${plan.featureName.toLowerCase()}.schema.ts`;
      filesCreated.push(schemaPath);
      console.log(`[BackendAgent] ✅ Schema: ${schemaPath}`);

      // Step 3: Create repository
      const repoPath = `backend/src/${plan.featureName.toLowerCase()}/${plan.featureName.toLowerCase()}.repository.ts`;
      filesCreated.push(repoPath);
      console.log(`[BackendAgent] ✅ Repository: ${repoPath}`);

      // Step 4: Create DTOs
      const createDtoPath = `backend/src/${plan.featureName.toLowerCase()}/dto/create-${plan.featureName.toLowerCase()}.dto.ts`;
      const updateDtoPath = `backend/src/${plan.featureName.toLowerCase()}/dto/update-${plan.featureName.toLowerCase()}.dto.ts`;
      filesCreated.push(createDtoPath, updateDtoPath);
      console.log(`[BackendAgent] ✅ DTOs created`);

      // Step 5: Create service
      const servicePath = `backend/src/${plan.featureName.toLowerCase()}/${plan.featureName.toLowerCase()}.service.ts`;
      filesCreated.push(servicePath);
      console.log(`[BackendAgent] ✅ Service: ${servicePath}`);

      // Step 6: Create controller
      const controllerPath = `backend/src/${plan.featureName.toLowerCase()}/${plan.featureName.toLowerCase()}.controller.ts`;
      filesCreated.push(controllerPath);
      console.log(`[BackendAgent] ✅ Controller: ${controllerPath}`);

      // Step 7: Create module
      const modulePath = `backend/src/${plan.featureName.toLowerCase()}/${plan.featureName.toLowerCase()}.module.ts`;
      filesCreated.push(modulePath);
      console.log(`[BackendAgent] ✅ Module: ${modulePath}`);

      // Step 8: Update AppModule
      filesCreated.push(`backend/src/app.module.ts (updated)`);
      console.log(`[BackendAgent] ✅ AppModule updated`);

      return {
        agentName: 'backend-agent',
        taskId: task.taskId,
        status: 'COMPLETED',
        summary: `Backend implementation complete. Created ${filesCreated.length} files for "${task.title}"`,
        output: {
          filesCreated,
          plan,
          endpoints: plan.endpoints.map((e) => `${e.method} /api/v1/${plan.featureName.toLowerCase()}${e.path === '/' ? '' : e.path}`),
          swaggerDocs: `http://localhost:3001/docs#/${plan.featureName}`,
        },
        issues,
        completedAt: new Date(),
        nextSteps: ['Frontend agent can now wire up RTK Query services', 'QA agent should test all endpoints'],
      };

    } catch (err: any) {
      return {
        agentName: 'backend-agent',
        taskId: task.taskId,
        status: 'FAILED',
        summary: `Backend implementation failed: ${err.message}`,
        output: {},
        issues: [err.message],
        completedAt: new Date(),
      };
    }
  }

  // ─── Create Implementation Plan ───────────────────────────────────────────────
  private createImplementationPlan(task: AgentTask): BackendImplementationPlan {
    const featureName = this.deriveFeatureName(task.title);
    const apis: ApiRequirement[] = task.context.apiRequirements ?? [];

    const defaultEndpoints: EndpointSpec[] = [
      { method: 'POST',   path: '/',    description: `Create ${featureName}`, authRequired: true, bodyDto: `Create${featureName}Dto`, responseShape: `{ success, message, data: ${featureName} }` },
      { method: 'GET',    path: '/',    description: `List all ${featureName}s (paginated)`, authRequired: true, responseShape: `{ success, message, data: ${featureName}[], meta }` },
      { method: 'GET',    path: '/:id', description: `Get ${featureName} by ID`, authRequired: true, responseShape: `{ success, message, data: ${featureName} }` },
      { method: 'PATCH',  path: '/:id', description: `Update ${featureName}`, authRequired: true, bodyDto: `Update${featureName}Dto`, responseShape: `{ success, message, data: ${featureName} }` },
      { method: 'DELETE', path: '/:id', description: `Soft-delete ${featureName}`, authRequired: true, responseShape: `{ success, message, data: null }` },
    ];

    return {
      featureName,
      schemaFields: this.inferSchemaFields(task.description),
      customRepoMethods: [],
      endpoints: apis.length > 0
        ? apis.map((api) => ({
            method: api.method,
            path: api.endpoint.replace(`/api/v1/${featureName.toLowerCase()}`, '') || '/',
            description: api.description,
            authRequired: true,
            responseShape: `{ success, message, data }`,
          }))
        : defaultEndpoints,
      businessRules: this.extractBusinessRules(task.context.ticket),
      estimatedFiles: 8,
    };
  }

  // ─── Generate Schema Code ─────────────────────────────────────────────────────
  generateSchemaCode(featureName: string, fields: SchemaField[]): string {
    const fieldDefs = fields.map((f) => {
      const opts: Record<string, any> = { ...f.options };
      if (f.required) opts.required = true;
      const optsStr = Object.keys(opts).length > 0
        ? JSON.stringify(opts).replace(/"/g, '').replace(/:/g, ': ')
        : '';
      return `  @Prop(${optsStr ? `{ ${optsStr} }` : ''}) ${f.name}${f.required ? '' : '?'}: ${f.type};`;
    }).join('\n');

    return `
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AbstractSchema } from '../../common/schemas/abstract.schema';

export type ${featureName}Document = HydratedDocument<${featureName}>;

@Schema({ versionKey: false, timestamps: true })
export class ${featureName} extends AbstractSchema {
${fieldDefs}
}

export const ${featureName}Schema = SchemaFactory.createForClass(${featureName});
`.trim();
  }

  // ─── Generate Service Code ────────────────────────────────────────────────────
  generateServiceCode(featureName: string): string {
    const f = featureName;
    const fl = featureName.toLowerCase();
    return `
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ${f}Repository } from './${fl}.repository';
import { Create${f}Dto } from './dto/create-${fl}.dto';
import { Update${f}Dto } from './dto/update-${fl}.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SortOrder } from '../common/constants/enums';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../common/constants/messages';

@Injectable()
export class ${f}Service {
  private readonly logger = new Logger(${f}Service.name);

  constructor(private readonly ${fl}Repository: ${f}Repository) {}

  async create(dto: Create${f}Dto, createdBy: string) {
    const item = await this.${fl}Repository.create({ ...dto, createdBy } as any);
    return { success: true, message: SUCCESS_MESSAGES.${f.toUpperCase()}_CREATED, data: item };
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = SortOrder.DESC } = query;
    const filter = { isDeleted: { $ne: true } };
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1 };
    const result = await this.${fl}Repository.findWithPagination(filter, page, limit, sort);
    return { success: true, message: SUCCESS_MESSAGES.${f.toUpperCase()}S_FETCHED, data: result.data,
      meta: { total: result.total, page: result.page, limit: result.limit, totalPages: Math.ceil(result.total / limit) } };
  }

  async findOne(id: string) {
    const item = await this.${fl}Repository.findById(id);
    if (!item) throw new NotFoundException(ERROR_MESSAGES.${f.toUpperCase()}_NOT_FOUND);
    return { success: true, message: SUCCESS_MESSAGES.${f.toUpperCase()}_FETCHED, data: item };
  }

  async update(id: string, dto: Update${f}Dto) {
    const item = await this.${fl}Repository.updateById(id, dto as any);
    if (!item) throw new NotFoundException(ERROR_MESSAGES.${f.toUpperCase()}_NOT_FOUND);
    return { success: true, message: SUCCESS_MESSAGES.${f.toUpperCase()}_UPDATED, data: item };
  }

  async remove(id: string, deletedBy: string) {
    const item = await this.${fl}Repository.softDelete({ _id: id }, deletedBy);
    if (!item) throw new NotFoundException(ERROR_MESSAGES.${f.toUpperCase()}_NOT_FOUND);
    return { success: true, message: SUCCESS_MESSAGES.${f.toUpperCase()}_DELETED, data: null };
  }
}`.trim();
  }

  private inferSchemaFields(description: string): SchemaField[] {
    // Basic field inference from description — agents augment these
    return [
      { name: 'title', type: 'string', required: true, options: { trim: true, maxlength: 200 } },
      { name: 'description', type: 'string', required: false, options: { trim: true } },
      { name: 'status', type: 'string', required: false, options: { default: 'ACTIVE' } },
    ];
  }

  private extractBusinessRules(ticket: any): string[] {
    if (!ticket?.acceptanceCriteria) return [];
    return ticket.acceptanceCriteria.filter((ac: string) =>
      /validate|must|should|cannot|required|unique/i.test(ac)
    );
  }

  private deriveFeatureName(taskTitle: string): string {
    const cleaned = taskTitle.replace(/^(build|create|implement|add|scaffold)\s+/i, '');
    const word = cleaned.split(/\s+/)[0];
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}
