import { computed, Injectable, signal } from '@angular/core';
import { Observable, OperatorFunction, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  loadingCount = signal(0);
  isActive = computed(() => this.loadingCount() > 0);

  start() {
    const qtd = this.loadingCount();
    this.loadingCount.set(qtd + 1);
  }

  stop() {
    this.loadingCount.set(this.loadingCount() - 1);
  }
}

export function loader<T>(loader: LoadingService): OperatorFunction<T, T> {
  return (source: Observable<T>) => {
    loader.start();

    return source.pipe(
      catchError((err: unknown) => {
        loader.stop();
        return throwError(() => err);
      }),
      finalize(() => loader.stop()),
    );
  };
}
