import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SidebarLink {
  name: string;
  url: string;
  svg?: string[];
  fill?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class SidebarComponent {
  appName = 'Car Maintenance';
  activeUrl = '';

  links: SidebarLink[] = [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'assets/icons/dashboard.png'

    },
    {
      name: 'Cars',
      url: '/cars',
      fill: true,
      icon: 'assets/icons/car-white.png'
    },
    {
      name: 'Maintenance Logs',
      url: '/events',
      svg: [
        'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      ]
    }
  ];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activeUrl = event.urlAfterRedirects;
    });
  }

  isMainLink(url: string): boolean {
    if (url === '/dashboard') {
      return this.activeUrl === '/' || this.activeUrl.startsWith('/dashboard');
    }
    return this.activeUrl.startsWith(url);
  }
}
