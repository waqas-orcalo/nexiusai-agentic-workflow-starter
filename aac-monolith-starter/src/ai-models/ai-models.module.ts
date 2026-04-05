import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiModelsController } from './ai-models.controller';
import { AiModelsService } from './ai-models.service';
import { AiModelRepository } from './ai-models.repository';
import { AiModel, AiModelSchema } from './schemas/ai-model.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AiModel.name, schema: AiModelSchema }]),
  ],
  controllers: [AiModelsController],
  providers: [AiModelsService, AiModelRepository],
  exports: [AiModelRepository, AiModelsService],
})
export class AiModelsModule {}
