import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService } from '../../../core/services/car.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ImportCarDataDto, ImportResultDto } from '../../../shared/models/api.models';

@Component({
  selector: 'app-import-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './import-modal.component.html',
})
export class ImportModalComponent {
  @Input() isOpen = false;
  @Input() carId!: number;
  @Input() carPlate?: string;
  @Output() closed = new EventEmitter<void>();
  @Output() imported = new EventEmitter<ImportResultDto>();

  jsonText = '';
  isLoading = false;
  errorMessage = '';
  dragOver = false;

  constructor(
    private carService: CarService,
    private notificationService: NotificationService,
  ) {}

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen && !this.isLoading) {
      this.close();
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.readFileAndImport(file);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.readFileAndImport(file);
      input.value = '';
    }
  }

  private readFileAndImport(file: File) {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      this.errorMessage = 'Please select a valid .json file.';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        this.executeImport(parsed);
      } catch (err: any) {
        this.errorMessage = `Invalid JSON file: ${err.message || 'Could not parse JSON.'}`;
      }
    };
    reader.onerror = () => {
      this.errorMessage = 'Failed to read the file from disk.';
    };
    reader.readAsText(file);
  }

  onPasteImport() {
    if (!this.jsonText.trim()) {
      this.errorMessage = 'Please paste your JSON data before confirming.';
      return;
    }

    try {
      const parsed = JSON.parse(this.jsonText.trim());
      this.executeImport(parsed);
    } catch (err: any) {
      this.errorMessage = `JSON Syntax Error: ${err.message || 'Please check that the JSON is valid.'}`;
    }
  }

  private executeImport(data: any) {
    if (!data || typeof data !== 'object') {
      this.errorMessage = 'Invalid data format: Expected a JSON object.';
      return;
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      this.errorMessage = 'Invalid JSON: Must contain an "items" array with at least one item.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload: ImportCarDataDto = {
      version: data.version || '1.0',
      items: data.items,
    };

    this.carService.importCarData(this.carId, payload).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.notificationService.showSuccess(
          result.message || `Successfully imported ${result.importedItems} items!`
        );
        this.imported.emit(result);
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.message ||
          (Array.isArray(err.error?.message) ? err.error.message.join(', ') : null) ||
          'Failed to import car maintenance data. Please check the JSON format.';
      },
    });
  }

  loadSampleTemplate() {
    const sample: ImportCarDataDto = {
      version: '1.0',
      items: [
        {
          name: 'Engine Oil & Filter',
          description: '5W-30 Full Synthetic Oil',
          manufacturer: 'Castrol Edge',
          installedDate: '2025-01-10',
          installedKm: 50000,
          expectedMaintenanceKm: 10000,
          expectedMaintenanceMonths: 6,
          events: [
            {
              maintenanceDate: '2025-07-15',
              kmCounter: 60000,
              itemCost: 45.0,
              extraCosts: [
                { name: 'Oil Filter', cost: 12.0 },
                { name: 'Labor', cost: 15.0 },
              ],
              notes: 'Regular scheduled service',
            },
          ],
        },
        {
          name: 'Front Brake Pads',
          description: 'Ceramic Brake Pads',
          manufacturer: 'Brembo',
          installedDate: '2025-02-01',
          installedKm: 52000,
          expectedMaintenanceKm: 30000,
          expectedMaintenanceMonths: 24,
          events: [],
        },
      ],
    };
    this.jsonText = JSON.stringify(sample, null, 2);
    this.errorMessage = '';
  }

  close() {
    if (this.isLoading) return;
    this.isOpen = false;
    this.jsonText = '';
    this.errorMessage = '';
    this.dragOver = false;
    this.closed.emit();
  }
}
