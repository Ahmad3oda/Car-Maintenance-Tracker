import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CarDto } from '../../../shared/models/api.models';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './car-form.component.html',
})
export class CarFormComponent implements OnInit {
  carForm: FormGroup;
  photoPreview: string | null = null;
  selectedFile: File | null = null;
  isEditMode: boolean = false;
  carId?: number;

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
  ) {
    this.carForm = this.fb.group({
      plateNumber: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [
        '',
        [Validators.required, Validators.min(1886), Validators.max(2100)],
      ],
      currentKm: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.carId = Number(id);
        this.carService.getCar(this.carId).subscribe({
          next: (car: CarDto) => {
            if (car) {
              this.carForm.patchValue({
                plateNumber: car.plateNumber,
                brand: car.brand,
                model: car.model,
                year: car.year,
                currentKm: car.currentKm,
              });
              this.photoPreview = car.photoPath
                ? this.carService.getPhotoUrl(car.photoPath)
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
    if (this.carForm.invalid) return;

    const formValue = this.carForm.value;
    const payload = this.carService.toFormData(formValue, this.selectedFile);

    const request$ = this.carId
      ? this.carService.updateCar(this.carId, payload)
      : this.carService.createCar(payload);

    request$.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.carId ? 'Car updated successfully' : 'Car added successfully',
        );
        this.router.navigate(['/cars']);
      },
      error: () => {},
    });
  }
}
