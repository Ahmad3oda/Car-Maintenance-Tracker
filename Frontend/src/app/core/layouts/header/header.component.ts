import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';
import { DashboardService } from '../../services/dashboard.service';
import { CarService } from '../../services/car.service';
import { ItemService } from '../../services/item.service';
import { CarDto, ItemDto, UpcomingItemDto } from '../../../shared/models/api.models';
import { UrgencyBadgeComponent } from '../../../shared/components/urgency-badge/urgency-badge.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UrgencyBadgeComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @Output() menuClick = new EventEmitter<void>();

  private themeService = inject(ThemeService);
  private dashboardService = inject(DashboardService);
  private carService = inject(CarService);
  private itemService = inject(ItemService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  isProfileMenuOpen = false;
  isNotificationsMenuOpen = false;

  // Search properties
  searchQuery = '';
  isSearchFocused = false;
  isSearching = false;
  matchedCars: CarDto[] = [];
  matchedItems: ItemDto[] = [];
  highlightedIndex = -1;
  private searchSubject = new Subject<string>();

  dueAlerts: {
    overdue: number;
    dueSoon: number;
    totalDue: number;
    items: UpcomingItemDto[];
  } = {
    overdue: 0,
    dueSoon: 0,
    totalDue: 0,
    items: [],
  };

  get isDark(): boolean {
    return this.themeService.isDark();
  }

  get hasSearchResults(): boolean {
    return this.matchedCars.length > 0 || this.matchedItems.length > 0;
  }

  get showSearchDropdown(): boolean {
    return this.isSearchFocused && this.searchQuery.trim().length > 0;
  }

  get totalSearchResultsCount(): number {
    return this.matchedCars.length + this.matchedItems.length;
  }

  ngOnInit() {
    this.loadDueAlerts();

    this.searchSubject
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) => {
          const query = term.trim();
          if (!query) {
            this.matchedCars = [];
            this.matchedItems = [];
            this.highlightedIndex = -1;
            this.isSearching = false;
            return of({ cars: [], items: [] });
          }
          this.isSearching = true;
          return forkJoin({
            cars: this.carService
              .getCarsList({ search: query, limit: 5 })
              .pipe(catchError(() => of([]))),
            items: this.itemService
              .getItemsList({ search: query, limit: 5 })
              .pipe(catchError(() => of([]))),
          });
        }),
      )
      .subscribe({
        next: ({ cars, items }) => {
          this.matchedCars = cars;
          this.matchedItems = items;
          this.highlightedIndex = -1;
          this.isSearching = false;
        },
        error: () => {
          this.isSearching = false;
        },
      });
  }

  loadDueAlerts() {
    this.dashboardService.getDueAlertsSummary().subscribe({
      next: (summary) => {
        this.dueAlerts = summary;
      },
      error: () => {},
    });
  }

  onSearchInput(value: string) {
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  onSearchFocus() {
    this.isSearchFocused = true;
    if (this.searchQuery.trim() && !this.hasSearchResults && !this.isSearching) {
      this.searchSubject.next(this.searchQuery);
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.matchedCars = [];
    this.matchedItems = [];
    this.highlightedIndex = -1;
    this.isSearching = false;
  }

  onSearchKeyDown(event: KeyboardEvent) {
    if (!this.showSearchDropdown) return;

    const total = this.totalSearchResultsCount;
    if (total === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.highlightedIndex < total - 1) {
        this.highlightedIndex++;
      } else {
        this.highlightedIndex = 0;
      }
      this.scrollToHighlighted();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.highlightedIndex > 0) {
        this.highlightedIndex--;
      } else if (this.highlightedIndex === 0) {
        this.highlightedIndex = -1;
      } else {
        this.highlightedIndex = total - 1;
      }
      this.scrollToHighlighted();
    } else if (event.key === 'Enter') {
      if (this.highlightedIndex >= 0 && this.highlightedIndex < total) {
        event.preventDefault();
        if (this.highlightedIndex < this.matchedCars.length) {
          this.selectCar(this.matchedCars[this.highlightedIndex]);
        } else {
          const itemIndex = this.highlightedIndex - this.matchedCars.length;
          this.selectItem(this.matchedItems[itemIndex]);
        }
      }
    } else if (event.key === 'Escape') {
      this.isSearchFocused = false;
      this.highlightedIndex = -1;
    }
  }

  private scrollToHighlighted() {
    if (this.highlightedIndex < 0) return;
    setTimeout(() => {
      const el = this.elementRef.nativeElement.querySelector(
        `#search-result-${this.highlightedIndex}`,
      );
      if (el) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  selectCar(car: CarDto) {
    this.isSearchFocused = false;
    this.clearSearch();
    this.router.navigate(['/cars', car.id]);
  }

  selectItem(item: ItemDto) {
    this.isSearchFocused = false;
    this.clearSearch();
    if (item.carId) {
      this.router.navigate(['/cars', item.carId, 'items', item.id, 'events']);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isSearchFocused = false;
      this.closeMenus();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.isSearchFocused = false;
    this.closeMenus();
  }

  onMenuClick() {
    this.menuClick.emit();
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    this.isNotificationsMenuOpen = false;
    this.isSearchFocused = false;
  }

  toggleNotificationsMenu() {
    this.isNotificationsMenuOpen = !this.isNotificationsMenuOpen;
    this.isProfileMenuOpen = false;
    this.isSearchFocused = false;
    if (this.isNotificationsMenuOpen) {
      this.loadDueAlerts();
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  closeMenus() {
    this.isProfileMenuOpen = false;
    this.isNotificationsMenuOpen = false;
  }
}
