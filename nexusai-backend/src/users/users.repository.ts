import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../common/repositories/abstract.repository';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  /**
   * Find user by email (includes password field for auth checks).
   */
  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase(), isDeleted: { $ne: true } })
      .select('+password')
      .lean<UserDocument>(true);
  }

  /**
   * Find user with refresh token (for token rotation).
   */
  async findByIdWithRefreshToken(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findById(id)
      .select('+refreshToken')
      .lean<UserDocument>(true);
  }

  /**
   * Find user with reset-password fields.
   */
  async findByResetToken(token: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        passwordResetToken: token,
        passwordResetExpiry: { $gt: new Date() },
        isDeleted: { $ne: true },
      })
      .select('+passwordResetToken +passwordResetExpiry')
      .lean<UserDocument>(true);
  }

  /**
   * Find user with email verification fields.
   */
  async findByVerificationToken(token: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        emailVerificationToken: token,
        emailVerificationExpiry: { $gt: new Date() },
        isDeleted: { $ne: true },
      })
      .select('+emailVerificationToken +emailVerificationExpiry')
      .lean<UserDocument>(true);
  }
}
