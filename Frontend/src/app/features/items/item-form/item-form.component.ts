import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './item-form.component.html'
})
export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  photoPreview: string | null = null;
  carId!: number;
  itemId?: number;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      manufacturer: [''],
      serialNumber: [''],
      installedDate: [''],
      installedKm: ['', [Validators.min(0)]],
      nextMaintenanceKm: ['', [Validators.min(0)]],
      nextMaintenanceDate: ['']
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.carId = Number(params.get('carId') || params.get('id')); // backward compat if route was :id
      const id = params.get('itemId');
      
      if (id) {
        this.isEditMode = true;
        this.itemId = Number(id);
        this.itemService.getItem(this.itemId).subscribe(item => {
          if (item) {
            this.itemForm.patchValue(item);
            this.photoPreview = item.photoPath || null;
          }
        });
      }
    });
  }

  handlePhotoSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.photoPreview = URL.createObjectURL(file);
    } else {
      this.photoPreview = null;
    }
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;
      const itemData = {
        ...formValue,
        carId: this.carId,
        photoPath: this.photoPreview || undefined
      };

      if (this.isEditMode && this.itemId) {
        this.itemService.updateItem(this.itemId, itemData).subscribe(() => {
          this.router.navigate(['/cars', this.carId]);
        });
      } else {
        this.itemService.addItem(itemData).subscribe(() => {
          this.router.navigate(['/cars', this.carId]);
        });
      }
    }
  }
}
