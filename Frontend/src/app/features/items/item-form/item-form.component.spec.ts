import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ItemFormComponent, todayLocalIso } from './item-form.component';

describe('ItemFormComponent', () => {
  let component: ItemFormComponent;
  let fixture: ComponentFixture<ItemFormComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemFormComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemFormComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('defaults the install date to today in local time', () => {
    expect(component.itemForm.get('installedDate')!.value).toBe(todayLocalIso());
  });

  it('formats a local date as YYYY-MM-DD', () => {
    expect(todayLocalIso(new Date(2026, 0, 5, 1, 30))).toBe('2026-01-05');
  });

  it('requires a name', () => {
    expect(component.itemForm.valid).toBeFalse();
    component.itemForm.patchValue({ name: 'Oil filter' });
    expect(component.itemForm.valid).toBeTrue();
  });
});
