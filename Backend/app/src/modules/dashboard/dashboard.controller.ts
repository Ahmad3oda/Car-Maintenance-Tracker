import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardStatsSerializer } from './dashboard-stats.serializer';

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Fleet totals plus service counts and spend' })
  @ApiResponse({ status: 200, type: DashboardStatsSerializer })
  getStats(): Promise<DashboardStatsSerializer> {
    return this.dashboardService.getStats();
  }
}
