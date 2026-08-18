import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { ItemService } from '../../../core/services/item.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CarDto, ItemDto, PageMeta } from '../../../shared/models/api.models';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ImageModalComponent } from '../../../shared/components/image-modal/image-modal.component';
import { DataTableComponent } from '../../../shared/components/table/data-table.component';
import { SortHeaderComponent } from '../../../shared/components/table/sort-header.component';
import { ImportModalComponent } from '../import-modal/import-modal.component';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EmptyStateComponent,
    ImageModalComponent,
    DataTableComponent,
    SortHeaderComponent,
    ImportModalComponent,
  ],
  templateUrl: './car-details.component.html',
})
export class CarDetailsComponent implements OnInit {
  car?: CarDto;
  items: ItemDto[] = [];
  itemsMeta?: PageMeta;
  carId!: number;
  currentPage = 1;
  currentLimit = 5;
  sortBy = 'createdAt';
  order: 'ASC' | 'DESC' = 'DESC';
  loadingItems = false;

  isImageModalOpen = false;
  modalImageUrl: string | null = null;
  modalImageTitle = '';

  isImportModalOpen = false;
  isExporting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private itemService: ItemService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.carId = id;
        this.loadCarData();
        this.loadItemsData();
      }
    });
  }

  loadCarData() {
    this.carService.getCar(this.carId).subscribe({
      next: (car) => (this.car = car),
      error: () => {},
    });
  }

  loadItemsData() {
    this.loadingItems = true;
    this.itemService
      .getItemsForCarPaged(this.carId, {
        page: this.currentPage,
        limit: this.currentLimit,
        sortBy: this.sortBy,
        order: this.order,
      })
      .subscribe({
        next: (page) => {
          this.items = page.data || [];
          this.itemsMeta = page.meta;
          this.loadingItems = false;
        },
        error: () => {
          this.loadingItems = false;
        },
      });
  }

  onSortChange(event: { sortBy: string; order: 'ASC' | 'DESC' }) {
    this.sortBy = event.sortBy;
    this.order = event.order;
    this.currentPage = 1;
    this.loadItemsData();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadItemsData();
  }

  onLimitChange(limit: number) {
    this.currentLimit = limit;
    this.currentPage = 1;
    this.loadItemsData();
  }

  getCarPhotoUrl(path?: string | null): string | null {
    return this.carService.getPhotoUrl(path);
  }

  getItemPhotoUrl(path?: string | null): string | null {
    return this.itemService.getPhotoUrl(path);
  }

  openImageModal(url: string | null, title: string) {
    if (!url) return;
    this.modalImageUrl = url;
    this.modalImageTitle = title;
    this.isImageModalOpen = true;
  }

  closeImageModal() {
    this.isImageModalOpen = false;
    this.modalImageUrl = null;
  }

  getLastInstallmentDate(item: ItemDto): string | Date | null {
    return item.lastInstallment || item.lastMaintenanceDate || null;
  }

  onDeleteItem(itemId: number, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.deleteItem(itemId).subscribe({
        next: () => {
          this.notificationService.showSuccess('Item deleted successfully');
          this.loadItemsData();
        },
        error: () => {},
      });
    }
  }

  navigateToAddItem() {
    this.router.navigate(['/cars', this.carId, 'items', 'add']);
  }

  navigateToEvents(itemId: number) {
    this.router.navigate(['/cars', this.carId, 'items', itemId, 'events']);
  }

  openImportModal() {
    this.isImportModalOpen = true;
  }

  closeImportModal() {
    this.isImportModalOpen = false;
  }

  onImportCompleted() {
    this.loadCarData();
    this.loadItemsData();
  }

  onExportData() {
    if (this.isExporting || !this.car) return;
    this.isExporting = true;
    this.carService.downloadExportedCarData(this.car.id, this.car.plateNumber).subscribe({
      next: () => {
        this.isExporting = false;
        this.notificationService.showSuccess('Car maintenance data exported successfully!');
      },
      error: (err) => {
        this.isExporting = false;
        this.notificationService.showError(
          err.error?.message || 'Failed to export car data.'
        );
      },
    });
  }
}
