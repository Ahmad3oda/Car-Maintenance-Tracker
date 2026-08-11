import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SidebarLink {
  name: string;
  url: string;
  svg: string[];
  fill?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  appName = 'Car Maintenance';
  activeUrl = '';

  links: SidebarLink[] = [
    {
      name: 'Dashboard',
      url: '/dashboard',
      svg: [
        'M3 4a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V4z',
        'M14 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4z',
        'M3 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7z',
        'M14 11a1 1 0 011-1h4a1 1 0 011 1v9a1 1 0 01-1 1h-4a1 1 0 01-1-1v-9z'
      ]
    },
    {
      name: 'Cars',
      url: '/cars',
      fill: true,
      svg: [
        'M1.4 8.6C0.6 8.6 0.1 9.2 0.1 10.2V11.5C0.1 13 0.8 14 2 14H2.3A3.1 3.1 0 0 1 8.3 14H15.7A3.1 3.1 0 0 1 21.7 14H22.4C23.4 14 23.9 13 23.9 11.5C23.9 10 22.8 9.1 21.1 8.9L18.6 8.4L15.8 5.3C15.4 4.7 14.5 4.3 13.7 4.3H7C6.1 4.3 5.4 4.7 4.9 5.3L3.5 7.7L1.4 8.6ZM6.7 5.6L5.2 8C5 8.3 5.2 8.5 5.5 8.5H8.2C8.4 8.5 8.5 8.3 8.5 8V5.9C8.5 5.6 8.4 5.5 8.1 5.5H6.7ZM9.5 5.6V8C9.5 8.3 9.6 8.5 9.9 8.5H17.5C17.8 8.5 18 8.3 17.9 8L15.7 5.6H9.9C9.6 5.6 9.5 5.6 9.5 5.6ZM10.3 9.6H11.5C11.9 9.6 12.1 9.9 12.1 10.2C12.1 10.5 11.9 10.8 11.5 10.8H10.3C10 10.8 9.7 10.5 9.7 10.2C9.7 9.9 10 9.6 10.3 9.6ZM5.3 11A3 3 0 1 0 5.3 17A3 3 0 1 0 5.3 11ZM5.3 12.6A1.4 1.4 0 1 1 5.3 15.4A1.4 1.4 0 1 1 5.3 12.6ZM18.7 11A3 3 0 1 0 18.7 17A3 3 0 1 0 18.7 11ZM18.7 12.6A1.4 1.4 0 1 1 18.7 15.4A1.4 1.4 0 1 1 18.7 12.6Z'
      ]
    },
    {
      name: 'Settings',
      url: '/settings',
      svg: [
        'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
        'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
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
