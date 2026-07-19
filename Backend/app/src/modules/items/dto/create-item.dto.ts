import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the item' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
