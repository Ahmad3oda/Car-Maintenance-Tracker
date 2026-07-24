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
import { CarDto, CreateCarDto } from '../../../shared/models/api.models';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './car-form.component.html',
})
export class CarFormComponent implements OnInit {
  carForm: FormGroup;
  photoPreview: string | null = null;
  isEditMode: boolean = false;
  carId?: number;

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private router: Router,
    private route: ActivatedRoute,
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
        this.carService.getCar(this.carId).subscribe((car: CarDto) => {
          if (car) {
            this.carForm.patchValue(car);
            this.photoPreview = car.photoPath || null;
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

  // car-form.component.ts
  onSubmit() {
    const dto: CreateCarDto = this.carForm.value;

    const request$ = this.carId
      ? this.carService.updateCar(this.carId, dto)
      : this.carService.createCar(dto);

    request$.subscribe(() => this.router.navigate(['/cars']));
  }
}
