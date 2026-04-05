import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../common/repositories/abstract.repository';
import { AiModel, AiModelDocument } from './schemas/ai-model.schema';

@Injectable()
export class AiModelRepository extends AbstractRepository<AiModelDocument> {
  constructor(
    @InjectModel(AiModel.name) private readonly aiModelModel: Model<AiModelDocument>,
  ) {
    super(aiModelModel);
  }
}
