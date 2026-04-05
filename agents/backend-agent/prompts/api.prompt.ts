// ─────────────────────────────────────────────────────────────────────────────
//  Backend Agent — API Generation Prompt
//  Injected when generating specific files (schema, service, controller, etc.)
// ─────────────────────────────────────────────────────────────────────────────

import { SchemaField, EndpointSpec } from '../backend-agent';

// ─── Schema Generation ────────────────────────────────────────────────────────
export const buildSchemaPrompt = (featureName: string, fields: SchemaField[]): string => `
Generate a Mongoose schema for the "${featureName}" feature.

Fields to include:
${fields.map((f) => `- ${f.name}: ${f.type} (required: ${f.required}${f.options ? ', options: ' + JSON.stringify(f.options) : ''})`).join('\n')}

Rules:
1. Extend AbstractSchema (provides _id, isDeleted, deletedBy, deletedAt)
2. Use @Schema({ versionKey: false, timestamps: true })
3. Use @Prop() decorator from @nestjs/mongoose for each field
4. Export: ${featureName}Document type, ${featureName} class, ${featureName}Schema (SchemaFactory)
5. Import AbstractSchema from '../../common/schemas/abstract.schema'

File path: backend/src/${featureName.toLowerCase()}/schemas/${featureName.toLowerCase()}.schema.ts
`.trim();

// ─── Repository Generation ────────────────────────────────────────────────────
export const buildRepositoryPrompt = (featureName: string, customMethods: string[]): string => `
Generate a NestJS repository for the "${featureName}" feature.

Rules:
1. Extend AbstractRepository<${featureName}Document>
2. Inject @InjectModel(${featureName}.name) in constructor
3. Add protected readonly logger = new Logger(${featureName}Repository.name)
4. Custom methods to implement:
${customMethods.length > 0 ? customMethods.map((m) => `   - ${m}`).join('\n') : '   - (none, only inherited methods needed)'}

File path: backend/src/${featureName.toLowerCase()}/${featureName.toLowerCase()}.repository.ts

Available inherited methods (DO NOT reimplement):
- create, findOne, findById, find, findWithPagination
- updateOne, updateById, softDelete, deleteOne, count, exists
`.trim();

// ─── DTO Generation ───────────────────────────────────────────────────────────
export const buildDtoPrompt = (featureName: string, fields: SchemaField[]): string => `
Generate two DTOs for the "${featureName}" feature:

1. Create${featureName}Dto — all required fields with class-validator decorators
2. Update${featureName}Dto — extends PartialType(Create${featureName}Dto), all fields optional

Fields:
${fields.map((f) => `- ${f.name}: ${f.type} (required: ${f.required})`).join('\n')}

Rules for each field, pick appropriate validators:
- string → @IsString(), @IsNotEmpty(), @MaxLength(200)
- number → @IsNumber(), @Min(0)
- boolean → @IsBoolean()
- enum → @IsEnum(EnumName)
- optional fields → @IsOptional() before other validators
- Add @ApiProperty({ example: ... }) for every field

File paths:
- backend/src/${featureName.toLowerCase()}/dto/create-${featureName.toLowerCase()}.dto.ts
- backend/src/${featureName.toLowerCase()}/dto/update-${featureName.toLowerCase()}.dto.ts
`.trim();

// ─── Service Generation ───────────────────────────────────────────────────────
export const buildServicePrompt = (
  featureName: string,
  businessRules: string[],
): string => `
Generate a NestJS service for the "${featureName}" feature.

Business rules to enforce:
${businessRules.length > 0 ? businessRules.map((r) => `- ${r}`).join('\n') : '- Standard CRUD operations'}

Required methods:
1. create(dto: Create${featureName}Dto, createdBy: string)
   - Check for duplicates if unique field exists
   - Use repository.create({ ...dto, createdBy })
   - Return { success: true, message: SUCCESS_MESSAGES.${featureName.toUpperCase()}_CREATED, data: item }

2. findAll(query: PaginationDto)
   - Filter: { isDeleted: { $ne: true } }
   - Use repository.findWithPagination
   - Return with meta: { total, page, limit, totalPages }

3. findOne(id: string)
   - Use repository.findById(id)
   - Throw NotFoundException if not found
   - Return { success: true, message: ..., data: item }

4. update(id: string, dto: Update${featureName}Dto)
   - Use repository.updateById(id, dto)
   - Throw NotFoundException if not found

5. remove(id: string, deletedBy: string)
   - Use repository.softDelete({ _id: id }, deletedBy)
   - NEVER hard delete

Rules:
- Import SUCCESS_MESSAGES and ERROR_MESSAGES from constants
- Always use private readonly logger = new Logger(...)
- All errors: throw NestJS HTTP exceptions (never RpcException)
- Use @Injectable() decorator

File path: backend/src/${featureName.toLowerCase()}/${featureName.toLowerCase()}.service.ts
`.trim();

// ─── Controller Generation ────────────────────────────────────────────────────
export const buildControllerPrompt = (
  featureName: string,
  endpoints: EndpointSpec[],
): string => `
Generate a NestJS controller for the "${featureName}" feature.

Endpoints to implement:
${endpoints
  .map(
    (e) =>
      `- ${e.method} ${e.path} → ${e.description}
   Auth: ${e.authRequired ? 'JWT required' : '@Public()'}
   ${e.roles ? `Roles: ${e.roles.join(', ')}` : ''}
   ${e.bodyDto ? `Body DTO: ${e.bodyDto}` : ''}
   Response: ${e.responseShape}`,
  )
  .join('\n\n')}

Rules:
1. @ApiTags('${featureName}')
2. @ApiBearerAuth() on the class (not individual methods)
3. @ApiOperation({ summary: '...' }) on each method
4. @ApiResponse({ status: 200/201, description: '...' }) on each method
5. Use @CurrentUser() to extract JWT payload (user._id for createdBy/deletedBy)
6. Use @Query() dto: PaginationDto for list endpoints
7. Use @Param('id') for :id routes
8. Use @Body() dto for POST/PATCH
9. Controller path: @Controller('${featureName.toLowerCase()}')

File path: backend/src/${featureName.toLowerCase()}/${featureName.toLowerCase()}.controller.ts
`.trim();

// ─── Module Generation ────────────────────────────────────────────────────────
export const buildModulePrompt = (featureName: string): string => `
Generate a NestJS module for the "${featureName}" feature.

Rules:
1. MongooseModule.forFeature([{ name: ${featureName}.name, schema: ${featureName}Schema }])
2. controllers: [${featureName}Controller]
3. providers: [${featureName}Service, ${featureName}Repository]
4. exports: [${featureName}Service]
5. Use @Module() decorator from @nestjs/common

File path: backend/src/${featureName.toLowerCase()}/${featureName.toLowerCase()}.module.ts

After creating this module, update backend/src/app.module.ts to import ${featureName}Module.
`.trim();
