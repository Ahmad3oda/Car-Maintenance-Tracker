import { Component, OnInit, ViewContainerRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Frontend';

  // TEMP-PALETTE: temporary palette preview, loaded in its own chunk.
  // Remove this hook and the palette-switcher folder after choosing.
  private readonly viewContainer = inject(ViewContainerRef);

  ngOnInit(): void {
    void import(
      './shared/components/palette-switcher/palette-switcher.component'
    ).then((m) => this.viewContainer.createComponent(m.PaletteSwitcherComponent));
  }
}
