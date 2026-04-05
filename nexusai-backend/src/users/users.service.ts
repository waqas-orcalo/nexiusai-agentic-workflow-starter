import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SortOrder } from '../common/constants/enums';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../common/constants/messages';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly userRepository: UserRepository) {}

  // ─────────────────────────────────────────────
  //  Get My Profile
  // ─────────────────────────────────────────────
  async getMyProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.USER_FETCHED,
      data: user,
    };
  }

  // ─────────────────────────────────────────────
  //  Update My Profile
  // ─────────────────────────────────────────────
  async updateMyProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.userRepository.updateById(userId, dto as any);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.USER_UPDATED,
      data: user,
    };
  }

  // ─────────────────────────────────────────────
  //  Get All Users (Admin)
  // ─────────────────────────────────────────────
  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = SortOrder.DESC, search } =
      query;

    const filter: Record<string, any> = { isDeleted: { $ne: true } };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1,
    };

    const result = await this.userRepository.findWithPagination(filter, page, limit, sort);

    return {
      success: true,
      message: SUCCESS_MESSAGES.USERS_FETCHED,
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  // ─────────────────────────────────────────────
  //  Get One User (Admin)
  // ─────────────────────────────────────────────
  async findOne(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user || (user as any).isDeleted) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.USER_FETCHED,
      data: user,
    };
  }

  // ─────────────────────────────────────────────
  //  Delete User (Admin — soft delete)
  // ─────────────────────────────────────────────
  async remove(id: string, deletedBy: string) {
    const user = await this.userRepository.softDelete({ _id: id }, deletedBy);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.USER_DELETED,
      data: null,
    };
  }
}
