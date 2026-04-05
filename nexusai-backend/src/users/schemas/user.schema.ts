import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { AbstractSchema } from '../../common/schemas/abstract.schema';
import { UserRole, UserStatus, UserGender } from '../../common/constants/enums';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User extends AbstractSchema {
  // ─────────────────────────────────────────────
  //  Identity
  // ─────────────────────────────────────────────
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ trim: true })
  phoneNumber?: string;

  @Prop({ enum: UserGender })
  gender?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  avatar?: string;

  // ─────────────────────────────────────────────
  //  Role & Status
  // ─────────────────────────────────────────────
  @Prop({ enum: UserRole, default: UserRole.USER })
  role: string;

  @Prop({ enum: UserStatus, default: UserStatus.INACTIVE })
  status: string;

  // ─────────────────────────────────────────────
  //  Email Verification
  // ─────────────────────────────────────────────
  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ select: false })
  emailVerificationToken?: string;

  @Prop({ select: false })
  emailVerificationExpiry?: Date;

  // ─────────────────────────────────────────────
  //  Password Reset
  // ─────────────────────────────────────────────
  @Prop({ select: false })
  passwordResetToken?: string;

  @Prop({ select: false })
  passwordResetExpiry?: Date;

  // ─────────────────────────────────────────────
  //  Refresh Token
  // ─────────────────────────────────────────────
  @Prop({ select: false })
  refreshToken?: string;

  // ─────────────────────────────────────────────
  //  Address
  // ─────────────────────────────────────────────
  @Prop({
    type: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    _id: false,
  })
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };

  // ─────────────────────────────────────────────
  //  Organisation (for multi-tenancy expansion)
  // ─────────────────────────────────────────────
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization?: string;

  // ─────────────────────────────────────────────
  //  Audit
  // ─────────────────────────────────────────────
  @Prop({ type: Date })
  lastSeen?: Date;

  @Prop({ type: SchemaTypes.ObjectId })
  createdBy?: string;

  @Prop({ type: SchemaTypes.ObjectId })
  updatedBy?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// ─── Virtuals ──────────────────────────────────
UserSchema.virtual('fullName').get(function (this: UserDocument) {
  return `${this.firstName} ${this.lastName}`;
});

// ─── Indexes ───────────────────────────────────
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });
