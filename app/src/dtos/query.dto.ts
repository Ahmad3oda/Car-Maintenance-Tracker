import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryBaseDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Search query', example: 'engine oil' })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Page number', example: '1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Page limit', example: '10' })
  limit?: number = 20;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Sort order', example: 'ASC' })
  order?: 'ASC' | 'DESC' = 'DESC';
}
