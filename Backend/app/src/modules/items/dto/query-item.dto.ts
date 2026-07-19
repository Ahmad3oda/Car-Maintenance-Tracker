import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QueryBaseDto } from '../../../dtos/query.dto';

export class QueryItemDto extends QueryBaseDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Sort by', example: 'name' })
  sortBy?: 'name' | 'lastRecordDate';
}
