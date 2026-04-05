import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { AgentRepository } from './agents.repository';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SortOrder } from '../common/constants/enums';

const MOCK_AGENTS = [
  { name: 'Research Agent', description: 'Automates web research and generates structured reports.', emoji: '🔍', aiModelName: 'GPT-5', tools: ['Web search', 'PDF reader'], templateType: 'RESEARCH', isTemplate: true, status: 'ACTIVE' },
  { name: 'Support Agent', description: 'Handles tickets, FAQs, and escalates complex issues.', emoji: '💼', aiModelName: 'Claude Sonnet 4.6', tools: ['Email', 'Ticketing'], templateType: 'SUPPORT', isTemplate: true, status: 'ACTIVE' },
  { name: 'Coding Agent', description: 'Writes, reviews and debugs code across any language.', emoji: '💻', aiModelName: 'GPT-5', tools: ['Code tools', 'GitHub'], templateType: 'CODING', isTemplate: true, status: 'ACTIVE' },
  { name: 'Data Agent', description: 'Queries databases and builds automated data reports.', emoji: '📊', aiModelName: 'Gemini 3.1 Pro', tools: ['Database', 'CSV'], templateType: 'DATA', isTemplate: true, status: 'ACTIVE' },
  { name: 'Marketing Agent', description: 'Creates campaigns, copy and social content.', emoji: '📣', aiModelName: 'Claude Opus 4.6', tools: ['Analytics', 'Social'], templateType: 'MARKETING', isTemplate: true, status: 'ACTIVE' },
  { name: 'Sales Agent', description: 'Qualifies leads and drafts personalised outreach.', emoji: '💰', aiModelName: 'GPT-4.1', tools: ['CRM', 'Email'], templateType: 'SALES', isTemplate: true, status: 'ACTIVE' },
];

@Injectable()
export class AgentsService implements OnModuleInit {
  private readonly logger = new Logger(AgentsService.name);

  constructor(private readonly agentRepository: AgentRepository) {}

  async onModuleInit() {
    await this.seedMockData();
  }

  private async seedMockData() {
    try {
      const count = await this.agentRepository.count({});
      if (count === 0) {
        this.logger.log('Seeding agents...');
        for (const agent of MOCK_AGENTS) {
          await this.agentRepository.create(agent as any);
        }
        this.logger.log(`Seeded ${MOCK_AGENTS.length} agents.`);
      }
    } catch (err) {
      this.logger.error('Failed to seed agents', err);
    }
  }

  async create(dto: CreateAgentDto) {
    const agent = await this.agentRepository.create(dto as any);
    return { success: true, message: 'Agent created.', data: agent };
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = SortOrder.DESC, search } = query;

    const filter: Record<string, any> = { isDeleted: { $ne: true } };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1 };
    const result = await this.agentRepository.findWithPagination(filter, page, limit, sort);

    return { success: true, message: 'Agents fetched.', data: result };
  }

  async findOne(id: string) {
    const agent = await this.agentRepository.findById(id);
    if (!agent || (agent as any).isDeleted) throw new NotFoundException('Agent not found.');
    return { success: true, message: 'Agent fetched.', data: agent };
  }

  async update(id: string, dto: UpdateAgentDto) {
    const agent = await this.agentRepository.updateById(id, dto as any);
    if (!agent) throw new NotFoundException('Agent not found.');
    return { success: true, message: 'Agent updated.', data: agent };
  }

  async remove(id: string) {
    const agent = await this.agentRepository.softDelete({ _id: id }, 'system');
    if (!agent) throw new NotFoundException('Agent not found.');
    return { success: true, message: 'Agent deleted.', data: null };
  }
}
