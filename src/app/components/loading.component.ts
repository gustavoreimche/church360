import { Component, inject, input, computed } from '@angular/core';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [NzSpinComponent],
  template: `
    @if (isLoading()) {
      <nz-spin nzSimple [nzSpinning]="isLoading()" nzSize="large">
        <ng-content />
      </nz-spin>
    } @else {
      <ng-content />
    }
  `,
  styles: `
    .overlay {
      width: 100dvw;
      height: 100dvh;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.7); /* Fundo com transparência */
      z-index: 1000;
    }
  `,
})
export class LoadingComponent {
  ld = inject(LoadingService);
  loading = input<boolean>();

  isLoading = computed(() => this.loading() ?? this.ld.isActive());
}
