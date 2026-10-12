import { Pipe, PipeTransform, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PhotoService } from '../../core/services/photo.service';

/** Usage: <img [src]="photoUrl | authImage | async" /> */
@Pipe({ name: 'authImage', standalone: true })
export class AuthImagePipe implements PipeTransform {
  private readonly photos = inject(PhotoService);

  transform(url: string | null | undefined): Observable<string | null> {
    return this.photos.load(url);
  }
}
