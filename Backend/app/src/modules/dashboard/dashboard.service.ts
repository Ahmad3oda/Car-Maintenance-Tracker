import { Injectable } from '@nestjs/common';
import { DataSource, Between } from 'typeorm';
import { Car } from '../cars/entities/car.entity';
import { Item } from '../items/entities/item.entity';
import { MaintenanceRecord } from '../maintenance-records/entities/maintenance-record.entity';
import { INITIAL_INSTALLATION_NOTE } from '../maintenance-records/maintenance-records.constants';
import { DashboardStatsSerializer } from './dashboard-stats.serializer';

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  /** Counts only the given user's cars, items and records. */
  async getStats(
    userId: number,
    now = new Date(),
  ): Promise<DashboardStatsSerializer> {
    const monthAgo = new Date(now.getTime() - 30 * DAY_MS);
    const yearAgo = new Date(now.getTime() - 365 * DAY_MS);

    const [totalCars, totalItems, records] = await Promise.all([
      this.dataSource.getRepository(Car).countBy({ userId }),
      this.dataSource.getRepository(Item).countBy({ car: { userId } }),
      this.dataSource.getRepository(MaintenanceRecord).find({
        select: ['maintenanceDate', 'itemCost', 'extraCosts', 'notes'],
        where: { maintenanceDate: Between(yearAgo, now), car: { userId } },
      }),
    ]);

    const stats: DashboardStatsSerializer = {
      totalCars,
      totalItems,
      itemsReplacedLastMonth: 0,
      itemsReplacedLastYear: 0,
      costSpentLastMonth: 0,
      costSpentLastYear: 0,
    };

    for (const record of records) {
      const inLastMonth = new Date(record.maintenanceDate) >= monthAgo;
      // Installation baselines are not replacements, but their cost is spend.
      const isReplacement = record.notes !== INITIAL_INSTALLATION_NOTE;
      const cost = recordCost(record);

      stats.costSpentLastYear += cost;
      if (isReplacement) stats.itemsReplacedLastYear++;
      if (inLastMonth) {
        stats.costSpentLastMonth += cost;
        if (isReplacement) stats.itemsReplacedLastMonth++;
      }
    }

    return stats;
  }
}

function recordCost(record: MaintenanceRecord): number {
  return (record.extraCosts ?? []).reduce(
    (sum, extra) => sum + Number(extra.cost || 0),
    Number(record.itemCost || 0),
  );
}
