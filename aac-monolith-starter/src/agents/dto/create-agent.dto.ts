import { IsString, IsOptional, IsBoolean, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AgentTemplateType, AgentStatus } from '../../common/constants/enums';

export class CreateAgentDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() emoji?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() aiModelName?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) tools?: string[];
  @ApiPropertyOptional({ enum: AgentTemplateType }) @IsOptional() @IsEnum(AgentTemplateType) templateType?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isTemplate?: boolean;
  @ApiPropertyOptional({ enum: AgentStatus }) @IsOptional() @IsEnum(AgentStatus) status?: string;
}
