import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { AbstractSchema } from '../../common/schemas/abstract.schema';
import { CourseLevel, CourseStatus } from '../../common/constants/enums';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ versionKey: false, timestamps: true })
export class Course extends AbstractSchema {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0 })
  duration?: number; // in hours

  @Prop({ enum: CourseLevel, default: CourseLevel.BEGINNER })
  level: string;

  @Prop({ enum: CourseStatus, default: CourseStatus.DRAFT })
  status: string;

  @Prop()
  thumbnail?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  instructor: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

// ─── Indexes ─────────────────────────────────────────
CourseSchema.index({ status: 1 });
CourseSchema.index({ level: 1 });
CourseSchema.index({ instructor: 1 });
CourseSchema.index({ createdAt: -1 });
