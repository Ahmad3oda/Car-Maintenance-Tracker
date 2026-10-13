import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IconComponent, IconName } from '../../../shared/components/icon/icon.component';

interface SidebarLink {
  name: string;
  url: string;
  svg?: string[];
  fill?: boolean;
  icon?: IconName;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
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
      icon: 'dashboard',
    },
    {
      name: 'Cars',
      url: '/cars',
      fill: true,
      icon: 'car'
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
