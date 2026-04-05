import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AiModelCategory, AiModelPricingModel, AiModelStatus } from '../../common/constants/enums';

export class CreateAiModelDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() provider: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() emoji?: string;
  @ApiPropertyOptional({ enum: AiModelCategory }) @IsOptional() @IsEnum(AiModelCategory) category?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() contextWindow?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() pricePer1MTokens?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() priceDisplay?: string;
  @ApiPropertyOptional({ enum: AiModelPricingModel }) @IsOptional() @IsEnum(AiModelPricingModel) pricingModel?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() rating?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isOpenSource?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional({ enum: AiModelStatus }) @IsOptional() @IsEnum(AiModelStatus) status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() releaseDate?: string;
}
