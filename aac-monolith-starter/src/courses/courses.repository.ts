import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../common/repositories/abstract.repository';
import { Course, CourseDocument } from './schemas/course.schema';

@Injectable()
export class CourseRepository extends AbstractRepository<CourseDocument> {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
  ) {
    super(courseModel);
  }

  // Add course-specific query methods here as needed.
  // Example:
  // async findByInstructor(instructorId: string): Promise<CourseDocument[]> {
  //   return this.courseModel
  //     .find({ instructor: instructorId, isDeleted: { $ne: true } })
  //     .lean<CourseDocument[]>(true);
  // }
}
