import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { AiModelRepository } from './ai-models.repository';
import { CreateAiModelDto } from './dto/create-ai-model.dto';
import { UpdateAiModelDto } from './dto/update-ai-model.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SortOrder } from '../common/constants/enums';

const MOCK_AI_MODELS = [
  { name: 'GPT-5', provider: 'OpenAI', emoji: '🧠', category: 'Language', description: 'Most capable reasoning model with extended thinking and 128K context window.', contextWindow: 128000, pricePer1MTokens: 15, priceDisplay: '$15/1M', pricingModel: 'Pay Per Use', rating: 4.9, isOpenSource: false, tags: ['reasoning', 'language', 'coding'], status: 'ACTIVE', releaseDate: 'Apr 2025' },
  { name: 'Claude Opus 4.6', provider: 'Anthropic', emoji: '👑', category: 'Language', description: "Anthropic's most powerful model for complex tasks.", contextWindow: 200000, pricePer1MTokens: 30, priceDisplay: '$30/1M', pricingModel: 'Pay Per Use', rating: 4.9, isOpenSource: false, tags: ['reasoning', 'language', 'safety'], status: 'ACTIVE', releaseDate: 'Mar 2025' },
  { name: 'Gemini 3.1 Pro', provider: 'Google DeepMind', emoji: '🔬', category: 'Multimodal', description: "Google's frontier multimodal model.", contextWindow: 1000000, pricePer1MTokens: 7, priceDisplay: '$7/1M', pricingModel: 'Pay Per Use', rating: 4.8, isOpenSource: false, tags: ['multimodal', 'vision', 'language'], status: 'ACTIVE', releaseDate: 'Mar 2025' },
  { name: 'Llama 4 Maverick', provider: 'Meta', emoji: '🦙', category: 'Language', description: "Meta's most capable open-source model.", contextWindow: 128000, pricePer1MTokens: 0, priceDisplay: 'Free', pricingModel: 'Free', rating: 4.7, isOpenSource: true, tags: ['open-source', 'language'], status: 'ACTIVE', releaseDate: 'Apr 2025' },
  { name: 'GPT-4o', provider: 'OpenAI', emoji: '🌟', category: 'Vision', description: 'Multimodal model with vision and audio capabilities.', contextWindow: 128000, pricePer1MTokens: 5, priceDisplay: '$5/1M', pricingModel: 'Pay Per Use', rating: 4.8, isOpenSource: false, tags: ['vision', 'multimodal'], status: 'ACTIVE', releaseDate: 'May 2024' },
  { name: 'Mistral Large', provider: 'Mistral AI', emoji: '💨', category: 'Language', description: "Mistral's flagship reasoning model.", contextWindow: 128000, pricePer1MTokens: 8, priceDisplay: '$8/1M', pricingModel: 'Pay Per Use', rating: 4.6, isOpenSource: false, tags: ['language', 'reasoning'], status: 'ACTIVE', releaseDate: 'Feb 2025' },
  { name: 'DeepSeek V3', provider: 'DeepSeek', emoji: '💻', category: 'Code', description: 'State-of-the-art code generation model.', contextWindow: 64000, pricePer1MTokens: 0, priceDisplay: 'Free', pricingModel: 'Free', rating: 4.7, isOpenSource: true, tags: ['code', 'open-source'], status: 'ACTIVE', releaseDate: 'Jan 2025' },
  { name: 'Qwen 2.5 Max', provider: 'Alibaba (Qwen)', emoji: '🀄', category: 'Language', description: "Alibaba's powerful multilingual model.", contextWindow: 128000, pricePer1MTokens: 2, priceDisplay: '$2/1M', pricingModel: 'Pay Per Use', rating: 4.6, isOpenSource: false, tags: ['language', 'multilingual'], status: 'ACTIVE', releaseDate: 'Feb 2025' },
  { name: 'Stable Diffusion 3.5', provider: 'Stability AI', emoji: '🎨', category: 'Image Gen', description: 'State-of-the-art image generation model.', contextWindow: 0, pricePer1MTokens: 0, priceDisplay: 'Free', pricingModel: 'Free', rating: 4.7, isOpenSource: true, tags: ['image-gen', 'open-source'], status: 'ACTIVE', releaseDate: 'Dec 2024' },
  { name: 'Cohere Command R+', provider: 'Cohere', emoji: '🔧', category: 'Language', description: 'Enterprise-grade RAG and search model.', contextWindow: 128000, pricePer1MTokens: 3, priceDisplay: '$3/1M', pricingModel: 'Pay Per Use', rating: 4.5, isOpenSource: false, tags: ['RAG', 'enterprise', 'language'], status: 'ACTIVE', releaseDate: 'Mar 2024' },
  { name: 'GPT-4.1', provider: 'OpenAI', emoji: '⚡', category: 'Language', description: 'Fast and efficient model for everyday tasks.', contextWindow: 128000, pricePer1MTokens: 0.4, priceDisplay: '$0.4/1M', pricingModel: 'Pay Per Use', rating: 4.6, isOpenSource: false, tags: ['fast', 'efficient', 'language'], status: 'ACTIVE', releaseDate: 'Apr 2025' },
  { name: 'Claude Sonnet 4.6', provider: 'Anthropic', emoji: '⚡', category: 'Language', description: 'Fast and intelligent model balancing capability and speed.', contextWindow: 200000, pricePer1MTokens: 3, priceDisplay: '$3/1M', pricingModel: 'Pay Per Use', rating: 4.8, isOpenSource: false, tags: ['language', 'fast', 'coding'], status: 'ACTIVE', releaseDate: 'Mar 2025' },
];

@Injectable()
export class AiModelsService implements OnModuleInit {
  private readonly logger = new Logger(AiModelsService.name);

  constructor(private readonly aiModelRepository: AiModelRepository) {}

  async onModuleInit() {
    await this.seedMockData();
  }

  private async seedMockData() {
    try {
      const count = await this.aiModelRepository.count({});
      if (count === 0) {
        this.logger.log('Seeding AI models...');
        for (const model of MOCK_AI_MODELS) {
          await this.aiModelRepository.create(model as any);
        }
        this.logger.log(`Seeded ${MOCK_AI_MODELS.length} AI models.`);
      }
    } catch (err) {
      this.logger.error('Failed to seed AI models', err);
    }
  }

  async create(dto: CreateAiModelDto) {
    const model = await this.aiModelRepository.create(dto as any);
    return { success: true, message: 'AI model created.', data: model };
  }

  async findAll(query: PaginationDto & { category?: string }) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = SortOrder.DESC, search, category } = query;

    const filter: Record<string, any> = { isDeleted: { $ne: true } };
    if (category && category !== 'All') filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1 };
    const result = await this.aiModelRepository.findWithPagination(filter, page, limit, sort);

    return {
      success: true,
      message: 'AI models fetched.',
      data: result,
    };
  }

  async findOne(id: string) {
    const model = await this.aiModelRepository.findById(id);
    if (!model || (model as any).isDeleted) throw new NotFoundException('AI model not found.');
    return { success: true, message: 'AI model fetched.', data: model };
  }

  async update(id: string, dto: UpdateAiModelDto) {
    const model = await this.aiModelRepository.updateById(id, dto as any);
    if (!model) throw new NotFoundException('AI model not found.');
    return { success: true, message: 'AI model updated.', data: model };
  }

  async remove(id: string) {
    const model = await this.aiModelRepository.softDelete({ _id: id }, 'system');
    if (!model) throw new NotFoundException('AI model not found.');
    return { success: true, message: 'AI model deleted.', data: null };
  }
}
