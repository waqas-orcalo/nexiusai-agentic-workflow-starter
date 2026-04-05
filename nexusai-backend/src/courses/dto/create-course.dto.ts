import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { CourseLevel } from '../../common/constants/enums';

export class CreateCourseDto {
  @ApiProperty({ example: 'NestJS Monolith Masterclass' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title: string;

  @ApiPropertyOptional({ example: 'A complete guide to building monolithic apps with NestJS.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 49.99 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ enum: CourseLevel, default: CourseLevel.BEGINNER })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({ example: 'https://s3.amazonaws.com/bucket/thumbnail.jpg' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ example: ['nestjs', 'typescript', 'mongodb'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
