import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false })
export abstract class AbstractSchema {
  _id: Types.ObjectId;

  @Prop({ default: false, select: false })
  isDeleted?: boolean;

  @Prop({ type: SchemaTypes.ObjectId, select: false })
  deletedBy?: string;

  @Prop({ type: Date, select: false })
  deletedAt?: Date;
}
