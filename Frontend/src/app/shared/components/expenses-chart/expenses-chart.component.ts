import { Component, OnInit, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceService } from '../../../core/services/maintenance.service';
import { CarService } from '../../../core/services/car.service';
import { CarDto, MaintenanceRecordDto } from '../../models/api.models';

export type ChartPeriod = 'lifetime' | 'day' | 'week' | 'month' | 'year';

export interface ChartPoint {
  label: string;
  subLabel?: string;
  cost: number;
  count: number;
  x: number;
  y: number;
  rawDate?: Date;
}

@Component({
  selector: 'app-expenses-chart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses-chart.component.html',
})
export class ExpensesChartComponent implements OnInit, OnChanges {
  private maintenanceService = inject(MaintenanceService);
  private carService = inject(CarService);

  @Input() carsList: CarDto[] = [];
  selectedCarId: number | null = null;
  selectedPeriod: ChartPeriod = 'year';

  loading = false;
  records: MaintenanceRecordDto[] = [];

  // Chart data state
  chartPoints: ChartPoint[] = [];
  pathD = '';
  areaD = '';
  maxCost = 0;
  totalExpense = 0;
  averageExpense = 0;
  highestExpense = 0;

  // Active hover point
  activePoint: ChartPoint | null = null;

  // SVG Chart Dimensions
  readonly svgWidth = 800;
  readonly svgHeight = 220;
  readonly paddingX = 45;
  readonly paddingTop = 25;
  readonly paddingBottom = 35;

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['carsList'] && !changes['carsList'].firstChange) {
      // Updated carsList
    }
  }

  loadData() {
    this.loading = true;
    const { startDate, endDate } = this.calculatePeriodDates(this.selectedPeriod);

    this.maintenanceService
      .getAllEvents({
        limit: 1000,
        page: 1,
        carId: this.selectedCarId || undefined,
        startDate,
        endDate,
        sortBy: 'maintenanceDate',
        order: 'ASC',
      })
      .subscribe({
        next: (page) => {
          this.records = page.data || [];
          this.processChartData();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  calculatePeriodDates(period: ChartPeriod): { startDate?: string; endDate?: string } {
    if (period === 'lifetime') return {};

    const now = new Date();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate.setDate(now.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }

  onPeriodChange(period: ChartPeriod) {
    if (this.selectedPeriod !== period) {
      this.selectedPeriod = period;
      this.activePoint = null;
      this.loadData();
    }
  }

  onCarFilterChange(carIdVal: any) {
    this.selectedCarId = carIdVal ? Number(carIdVal) : null;
    this.activePoint = null;
    this.loadData();
  }

  processChartData() {
    // 1. Compute total metrics
    this.totalExpense = 0;
    this.highestExpense = 0;

    const costs = this.records.map((r) => {
      const c = this.getRecordCost(r);
      this.totalExpense += c;
      if (c > this.highestExpense) this.highestExpense = c;
      return { date: new Date(r.maintenanceDate), cost: c };
    });

    this.averageExpense = this.records.length > 0 ? this.totalExpense / this.records.length : 0;

    // 2. Generate time bucket points based on selectedPeriod
    const buckets = this.generateTimeBuckets(this.selectedPeriod, costs);
    this.chartPoints = buckets;

    // 3. Compute SVG coordinates & curves
    if (buckets.length === 0) {
      this.pathD = '';
      this.areaD = '';
      this.maxCost = 0;
      return;
    }

    this.maxCost = Math.max(...buckets.map((b) => b.cost), 100);

    const availableW = this.svgWidth - this.paddingX * 2;
    const availableH = this.svgHeight - this.paddingTop - this.paddingBottom;

    buckets.forEach((b, index) => {
      const ratioX = buckets.length > 1 ? index / (buckets.length - 1) : 0.5;
      b.x = this.paddingX + ratioX * availableW;

      const ratioY = b.cost / this.maxCost;
      b.y = this.svgHeight - this.paddingBottom - ratioY * availableH;
    });

    if (buckets.length === 1) {
      const pt = buckets[0];
      this.pathD = `M ${this.paddingX} ${pt.y} L ${this.svgWidth - this.paddingX} ${pt.y}`;
      this.areaD = `M ${this.paddingX} ${this.svgHeight - this.paddingBottom} L ${this.paddingX} ${pt.y} L ${this.svgWidth - this.paddingX} ${pt.y} L ${this.svgWidth - this.paddingX} ${this.svgHeight - this.paddingBottom} Z`;
      return;
    }

    // Smooth Bezier Curve generation
    this.pathD = this.buildSmoothPath(buckets);
    const firstX = buckets[0].x;
    const lastX = buckets[buckets.length - 1].x;
    const bottomY = this.svgHeight - this.paddingBottom;
    this.areaD = `${this.pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }

  private buildSmoothPath(points: ChartPoint[]): string {
    if (points.length < 2) return '';
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }

  private generateTimeBuckets(
    period: ChartPeriod,
    costs: { date: Date; cost: number }[],
  ): ChartPoint[] {
    const now = new Date();

    if (period === 'day') {
      // 6 time blocks across the day (every 4 hours)
      const points: ChartPoint[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 4 * 60 * 60 * 1000);
        const label = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        points.push({ label, cost: 0, count: 0, x: 0, y: 0, rawDate: d });
      }
      costs.forEach((c) => {
        let closestIdx = 0;
        let minDiff = Infinity;
        points.forEach((p, idx) => {
          const diff = Math.abs(c.date.getTime() - p.rawDate!.getTime());
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });
        points[closestIdx].cost += c.cost;
        points[closestIdx].count += 1;
      });
      return points;
    }

    if (period === 'week') {
      // 7 days of the week
      const points: ChartPoint[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const label = d.toLocaleDateString([], { weekday: 'short' });
        const subLabel = d.toLocaleDateString([], { day: '2-digit', month: 'short' });
        points.push({ label, subLabel, cost: 0, count: 0, x: 0, y: 0, rawDate: d });
      }
      costs.forEach((c) => {
        const idx = points.findIndex(
          (p) => p.rawDate!.toDateString() === c.date.toDateString(),
        );
        if (idx !== -1) {
          points[idx].cost += c.cost;
          points[idx].count += 1;
        }
      });
      return points;
    }

    if (period === 'month') {
      // 6 intervals across the month (~5 days each)
      const points: ChartPoint[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i * 6);
        const label = d.toLocaleDateString([], { day: '2-digit', month: 'short' });
        points.push({ label, cost: 0, count: 0, x: 0, y: 0, rawDate: d });
      }
      costs.forEach((c) => {
        let closestIdx = 0;
        let minDiff = Infinity;
        points.forEach((p, idx) => {
          const diff = Math.abs(c.date.getTime() - p.rawDate!.getTime());
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });
        points[closestIdx].cost += c.cost;
        points[closestIdx].count += 1;
      });
      return points;
    }

    if (period === 'year') {
      // 12 months
      const points: ChartPoint[] = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleDateString([], { month: 'short' });
        points.push({ label, cost: 0, count: 0, x: 0, y: 0, rawDate: d });
      }
      costs.forEach((c) => {
        const idx = points.findIndex(
          (p) =>
            p.rawDate!.getMonth() === c.date.getMonth() &&
            p.rawDate!.getFullYear() === c.date.getFullYear(),
        );
        if (idx !== -1) {
          points[idx].cost += c.cost;
          points[idx].count += 1;
        }
      });
      return points;
    }

    // Lifetime: Group by month or year dynamically
    if (costs.length === 0) return [];

    // Group costs by YYYY-MM
    const groupMap = new Map<string, { label: string; cost: number; count: number }>();
    costs.forEach((c) => {
      const key = `${c.date.getFullYear()}-${String(c.date.getMonth() + 1).padStart(2, '0')}`;
      const label = c.date.toLocaleDateString([], { month: 'short', year: '2-digit' });
      const existing = groupMap.get(key) || { label, cost: 0, count: 0 };
      existing.cost += c.cost;
      existing.count += 1;
      groupMap.set(key, existing);
    });

    const points: ChartPoint[] = [];
    groupMap.forEach((val) => {
      points.push({ label: val.label, cost: val.cost, count: val.count, x: 0, y: 0 });
    });

    return points.length > 0 ? points : [];
  }

  private getRecordCost(record: MaintenanceRecordDto): number {
    if (record.totalCost !== undefined && record.totalCost !== null) {
      return Number(record.totalCost);
    }
    let total = Number(record.itemCost || 0);
    if (record.extraCosts && Array.isArray(record.extraCosts)) {
      total += record.extraCosts.reduce(
        (sum, cost) => sum + Number(cost.cost || 0),
        0,
      );
    }
    return total;
  }

  setActivePoint(pt: ChartPoint | null) {
    this.activePoint = pt;
  }

  isTooltipBelow(pt: ChartPoint): boolean {
    return pt.y < 85;
  }

  getTooltipTransform(pt: ChartPoint): string {
    const isBelow = this.isTooltipBelow(pt);
    const translateY = isBelow ? 'translateY(14px)' : 'translateY(-100%) translateY(-14px)';

    if (pt.x < 75) {
      return `translateX(-12px) ${translateY}`;
    }
    if (pt.x > this.svgWidth - 75) {
      return `translateX(calc(-100% + 12px)) ${translateY}`;
    }
    return `translateX(-50%) ${translateY}`;
  }

  getArrowLeftPercent(pt: ChartPoint): string {
    if (pt.x < 75) {
      return '16px';
    }
    if (pt.x > this.svgWidth - 75) {
      return 'calc(100% - 16px)';
    }
    return '50%';
  }
}
