import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../common/constants/enums';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Courses')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // ─────────────────────────────────────────────
  //  POST /courses
  // ─────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new course (Admin only)' })
  @ApiResponse({ status: 201, description: 'Course created.' })
  create(@Body() dto: CreateCourseDto, @CurrentUser() user: any) {
    return this.coursesService.create(dto, user.userId);
  }

  // ─────────────────────────────────────────────
  //  GET /courses
  // ─────────────────────────────────────────────
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all courses with pagination' })
  @ApiResponse({ status: 200, description: 'Courses fetched.' })
  findAll(@Query() query: PaginationDto) {
    return this.coursesService.findAll(query);
  }

  // ─────────────────────────────────────────────
  //  GET /courses/:id
  // ─────────────────────────────────────────────
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single course by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the course' })
  @ApiResponse({ status: 200, description: 'Course fetched.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  // ─────────────────────────────────────────────
  //  PATCH /courses/:id
  // ─────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a course (Admin only)' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the course' })
  @ApiResponse({ status: 200, description: 'Course updated.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto, @CurrentUser() user: any) {
    return this.coursesService.update(id, dto, user.userId);
  }

  // ─────────────────────────────────────────────
  //  DELETE /courses/:id
  // ─────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete a course (Super Admin only)' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the course' })
  @ApiResponse({ status: 200, description: 'Course deleted.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.remove(id, user.userId);
  }
}
