import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { CarFormComponent } from './car-form.component';

describe('CarFormComponent', () => {
  let component: CarFormComponent;
  let fixture: ComponentFixture<CarFormComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarFormComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CarFormComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('starts in add mode with an empty, invalid form', () => {
    expect(component.isEditMode).toBeFalse();
    expect(component.carForm.valid).toBeFalse();
  });

  it('rejects a model year after next year', () => {
    component.carForm.patchValue({
      plateNumber: 'ABC',
      brand: 'Kia',
      model: 'Rio',
      currentKm: 0,
      year: new Date().getFullYear() + 2,
    });
    expect(component.carForm.get('year')!.hasError('max')).toBeTrue();
  });

  it('does not send anything while the form is invalid', () => {
    component.onSubmit();
    http.expectNone(() => true);
  });

  it('posts the car as form data when valid', () => {
    component.carForm.patchValue({
      plateNumber: 'ABC',
      brand: 'Kia',
      model: 'Rio',
      year: 2020,
      currentKm: 1000,
    });
    component.onSubmit();
    const req = http.expectOne((r) => r.method === 'POST' && r.url === '/cars');
    expect((req.request.body as FormData).get('brand')).toBe('Kia');
    req.flush({ id: 1 });
  });
});
