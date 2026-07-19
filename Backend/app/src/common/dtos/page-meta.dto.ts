import { ApiProperty } from '@nestjs/swagger';

export interface PageMetaDtoParameters {
  pageOptionsDto: { page?: number; limit?: number };
  itemCount: number;
}

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly totalItems: number;

  @ApiProperty()
  readonly totalPages: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page || 1;
    this.limit = pageOptionsDto.limit || 10;
    this.totalItems = itemCount;
    this.totalPages = Math.ceil(this.totalItems / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.totalPages;
  }
}
