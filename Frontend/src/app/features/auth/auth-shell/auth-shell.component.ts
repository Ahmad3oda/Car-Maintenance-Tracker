import { Component, Input } from '@angular/core';
import { RoadSceneComponent } from './road-scene.component';

/**
 * Split layout shared by login and register: a brand panel with the
 * driving-car scene beside the form (stacked above it on small screens).
 * The page's form is projected into the right-hand column.
 */
@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [RoadSceneComponent],
  templateUrl: './auth-shell.component.html',
  styles: `
    :host { display: block; }
    .float-a, .float-b { animation: auth-float 6s ease-in-out infinite alternate; }
    .float-b { animation-delay: -3s; }
    @keyframes auth-float { to { transform: translateY(-8px); } }
    .gauge { animation: auth-gauge 2.4s var(--ease-out) 0.4s both; }
    @keyframes auth-gauge { from { transform: scaleX(0); } }
  `,
})
export class AuthShellComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle = '';
}
