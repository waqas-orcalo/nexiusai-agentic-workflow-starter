import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AbstractSchema } from '../../common/schemas/abstract.schema';
import { AiModelCategory, AiModelPricingModel, AiModelStatus } from '../../common/constants/enums';

export type AiModelDocument = HydratedDocument<AiModel>;

@Schema({ versionKey: false, timestamps: true })
export class AiModel extends AbstractSchema {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  provider: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  emoji?: string;

  @Prop({ enum: Object.values(AiModelCategory), default: AiModelCategory.LANGUAGE })
  category: string;

  @Prop({ default: 0 })
  contextWindow?: number;

  @Prop({ default: 0 })
  pricePer1MTokens?: number;

  @Prop({ trim: true })
  priceDisplay?: string;

  @Prop({ enum: Object.values(AiModelPricingModel), default: AiModelPricingModel.PAY_PER_USE })
  pricingModel: string;

  @Prop({ min: 0, max: 5, default: 0 })
  rating?: number;

  @Prop({ default: false })
  isOpenSource?: boolean;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ enum: Object.values(AiModelStatus), default: AiModelStatus.ACTIVE })
  status: string;

  @Prop({ trim: true })
  releaseDate?: string;
}

export const AiModelSchema = SchemaFactory.createForClass(AiModel);

AiModelSchema.index({ category: 1 });
AiModelSchema.index({ provider: 1 });
AiModelSchema.index({ status: 1 });
AiModelSchema.index({ createdAt: -1 });
