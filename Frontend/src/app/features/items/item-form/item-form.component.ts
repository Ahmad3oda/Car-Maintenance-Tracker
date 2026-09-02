import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ItemDto } from '../../../shared/models/api.models';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './item-form.component.html',
})
export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  photoPreview: string | null = null;
  selectedFile: File | null = null;
  carId!: number;
  itemId?: number;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      manufacturer: [''],
      installedDate: [new Date().toISOString().substring(0, 10), Validators.required],
      installedKm: ['', [Validators.min(0)]],
      expectedMaintenanceKm: ['', [Validators.min(0)]],
      expectedMaintenanceMonths: ['', [Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.carId = Number(params.get('carId') || params.get('id'));
      const id = params.get('itemId');

      if (id) {
        this.isEditMode = true;
        this.itemId = Number(id);
        this.itemService.getItem(this.itemId).subscribe({
          next: (item: ItemDto) => {
            if (item) {
              this.itemForm.patchValue({
                name: item.name,
                description: item.description || '',
                manufacturer: item.manufacturer || '',
                installedDate: item.installedDate
                  ? new Date(item.installedDate).toISOString().substring(0, 10)
                  : '',
                installedKm: item.installedKm !== undefined && item.installedKm !== null ? item.installedKm : '',
                expectedMaintenanceKm: item.expectedMaintenanceKm || '',
                expectedMaintenanceMonths: item.expectedMaintenanceMonths || '',
              });
              this.photoPreview = item.photoPath
                ? this.itemService.getPhotoUrl(item.photoPath)
                : null;
            }
          },
          error: () => {},
        });
      }
    });
  }

  handlePhotoSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.photoPreview = URL.createObjectURL(file);
    }
  }

  onSubmit() {
    if (this.itemForm.invalid) return;

    const formValue = this.itemForm.value;
    const payload = this.itemService.toFormData(
      {
        ...formValue,
        carId: this.carId,
      },
      this.selectedFile,
    );

    const request$ =
      this.isEditMode && this.itemId
        ? this.itemService.updateItem(this.itemId, payload)
        : this.itemService.createItem(payload);

    request$.subscribe({
      next: (res: ItemDto) => {
        this.notificationService.showSuccess(
          this.isEditMode
            ? 'Item updated successfully'
            : 'Item added successfully',
        );
        const targetItemId = this.itemId || res?.id;
        if (targetItemId) {
          this.router.navigate(['/cars', this.carId, 'items', targetItemId, 'events']);
        } else {
          this.router.navigate(['/cars', this.carId]);
        }
      },
      error: () => {},
    });
  }
}
