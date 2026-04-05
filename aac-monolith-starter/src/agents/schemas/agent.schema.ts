import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AbstractSchema } from '../../common/schemas/abstract.schema';
import { AgentTemplateType, AgentStatus } from '../../common/constants/enums';

export type AgentDocument = HydratedDocument<Agent>;

@Schema({ versionKey: false, timestamps: true })
export class Agent extends AbstractSchema {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  emoji?: string;

  @Prop({ trim: true })
  aiModelName?: string;

  @Prop({ type: [String], default: [] })
  tools?: string[];

  @Prop({ enum: Object.values(AgentTemplateType), default: AgentTemplateType.CUSTOM })
  templateType: string;

  @Prop({ default: true })
  isTemplate?: boolean;

  @Prop({ enum: Object.values(AgentStatus), default: AgentStatus.ACTIVE })
  status: string;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);

AgentSchema.index({ templateType: 1 });
AgentSchema.index({ isTemplate: 1 });
AgentSchema.index({ status: 1 });
AgentSchema.index({ createdAt: -1 });
