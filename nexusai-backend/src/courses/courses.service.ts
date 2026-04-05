import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CourseRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SortOrder } from '../common/constants/enums';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../common/constants/messages';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(private readonly courseRepository: CourseRepository) {}

  // ─────────────────────────────────────────────
  //  Create Course
  // ─────────────────────────────────────────────
  async create(dto: CreateCourseDto, instructorId: string) {
    const course = await this.courseRepository.create({
      ...dto,
      instructor: instructorId,
    } as any);

    return {
      success: true,
      message: SUCCESS_MESSAGES.COURSE_CREATED,
      data: course,
    };
  }

  // ─────────────────────────────────────────────
  //  Find All (paginated)
  // ─────────────────────────────────────────────
  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = SortOrder.DESC, search } =
      query;

    const filter: Record<string, any> = { isDeleted: { $ne: true } };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1,
    };

    const result = await this.courseRepository.findWithPagination(filter, page, limit, sort);

    return {
      success: true,
      message: SUCCESS_MESSAGES.COURSES_FETCHED,
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
  //  Find One
  // ─────────────────────────────────────────────
  async findOne(id: string) {
    const course = await this.courseRepository.findById(id);
    if (!course || (course as any).isDeleted) {
      throw new NotFoundException(ERROR_MESSAGES.COURSE_NOT_FOUND);
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.COURSE_FETCHED,
      data: course,
    };
  }

  // ─────────────────────────────────────────────
  //  Update
  // ─────────────────────────────────────────────
  async update(id: string, dto: UpdateCourseDto, updatedBy: string) {
    const course = await this.courseRepository.updateById(id, {
      ...dto,
      updatedBy,
    } as any);

    if (!course) {
      throw new NotFoundException(ERROR_MESSAGES.COURSE_NOT_FOUND);
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.COURSE_UPDATED,
      data: course,
    };
  }

  // ─────────────────────────────────────────────
  //  Remove (soft delete)
  // ─────────────────────────────────────────────
  async remove(id: string, deletedBy: string) {
    const course = await this.courseRepository.softDelete({ _id: id }, deletedBy);
    if (!course) {
      throw new NotFoundException(ERROR_MESSAGES.COURSE_NOT_FOUND);
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.COURSE_DELETED,
      data: null,
    };
  }
}
