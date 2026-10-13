import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsSerializer {
  @ApiProperty() totalCars: number;
  @ApiProperty() totalItems: number;
  @ApiProperty({
    description:
      'Services in the last 30 days, excluding initial installations',
  })
  itemsReplacedLastMonth: number;
  @ApiProperty({
    description:
      'Services in the last 365 days, excluding initial installations',
  })
  itemsReplacedLastYear: number;
  @ApiProperty({ description: 'Item and extra costs in the last 30 days' })
  costSpentLastMonth: number;
  @ApiProperty({ description: 'Item and extra costs in the last 365 days' })
  costSpentLastYear: number;
}
