import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { NzPageHeaderComponent } from 'ng-zorro-antd/page-header';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-page-wrapper',
  imports: [NzPageHeaderComponent, NzIconModule],
  template: `
    <header>
      <nz-page-header [nzGhost]="false" (nzBack)="onBack()" nzBackIcon [nzTitle]="title()" [nzSubtitle]="subTitle()" />
    </header>
    <main class="main-container"><ng-content /></main>
  `,
  styles: `
    .main-container {
      padding: 0 24px;
    }
  `,
})
export class PageWrapperComponent {
  title = input.required<string>();
  subTitle = input<string>();
  _location = inject(Location);
  onBack() {
    this._location.back();
  }
}
