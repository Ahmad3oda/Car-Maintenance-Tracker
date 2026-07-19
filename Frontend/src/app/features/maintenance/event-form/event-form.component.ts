import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MaintenanceService } from '../../../core/services/maintenance.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './event-form.component.html'
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  carId!: number;
  itemId!: number;
  eventId?: number;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private maintenanceService: MaintenanceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      maintenanceDate: ['', Validators.required],
      kmCounter: ['', [Validators.required, Validators.min(0)]],
      itemCost: ['', [Validators.required, Validators.min(0)]],
      notes: [''],
      extraCosts: this.fb.array([])
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.carId = Number(params.get('carId'));
      this.itemId = Number(params.get('itemId'));
      const id = params.get('eventId');
      
      if (id) {
        this.isEditMode = true;
        this.eventId = Number(id);
        this.maintenanceService.getEvent(this.eventId).subscribe(event => {
          if (event) {
            this.eventForm.patchValue({
              maintenanceDate: event.maintenanceDate,
              kmCounter: event.kmCounter,
              itemCost: event.itemCost,
              notes: event.notes
            });
            
            // clear extraCosts FormArray and populate with existing ones
            this.extraCosts.clear();
            if (event.extraCosts) {
              event.extraCosts.forEach(ec => {
                this.extraCosts.push(this.fb.group({
                  name: [ec.name, Validators.required],
                  cost: [ec.cost, [Validators.required, Validators.min(0)]]
                }));
              });
            }
          }
        });
      }
    });
  }

  get extraCosts() {
    return this.eventForm.get('extraCosts') as FormArray;
  }

  addExtraCost() {
    this.extraCosts.push(this.fb.group({
      name: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(0)]]
    }));
  }

  removeExtraCost(index: number) {
    this.extraCosts.removeAt(index);
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const eventData = {
        ...this.eventForm.value,
        itemId: this.itemId
      };
      
      if (this.isEditMode && this.eventId) {
        this.maintenanceService.updateEvent(this.eventId, eventData).subscribe(() => {
          this.router.navigate(['/cars', this.carId, 'items', this.itemId, 'events']);
        });
      } else {
        this.maintenanceService.addEvent(eventData).subscribe(() => {
          this.router.navigate(['/cars', this.carId, 'items', this.itemId, 'events']);
        });
      }
    }
  }
}
