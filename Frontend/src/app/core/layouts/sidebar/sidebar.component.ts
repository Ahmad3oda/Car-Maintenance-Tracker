import { Component, Input } from '@angular/core';
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
      height: 100%;
    }
    /* Labels slide and fade instead of popping when the rail collapses. */
    .nav-label {
      transition: opacity 200ms ease 80ms, transform 300ms var(--ease-out);
    }
    /* Springs past the target slightly, then settles. */
    .nav-pill {
      transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .nav-label.is-hidden {
      opacity: 0;
      transform: translateX(-8px);
      pointer-events: none;
      transition-delay: 0ms;
    }
  `]
})
export class SidebarComponent {
  /** Icon-only rail (desktop). */
  @Input() collapsed = false;

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

  /** Row of the active link (rows are h-11 + space-y-1 = 48px apart). */
  get activeIndex(): number {
    return this.links.findIndex(link => this.isMainLink(link.url));
  }

  isMainLink(url: string): boolean {
    if (url === '/dashboard') {
      return this.activeUrl === '/' || this.activeUrl.startsWith('/dashboard');
    }
    return this.activeUrl.startsWith(url);
  }
}
