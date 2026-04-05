import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiModelsService } from './ai-models.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('AI Models')
@Controller('ai-models')
export class AiModelsController {
  constructor(private readonly aiModelsService: AiModelsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all AI models' })
  findAll(@Query() query: PaginationDto & { category?: string }) {
    return this.aiModelsService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single AI model by ID' })
  findOne(@Param('id') id: string) {
    return this.aiModelsService.findOne(id);
  }
}
