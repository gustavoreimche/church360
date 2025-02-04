import { Component } from '@angular/core';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [NzInputGroupComponent, FormsModule, NzInputDirective],
  template: `
    <nz-input-group>
      <input type="text" nz-input [(ngModel)]="inputValue" placeholder="input with clear icon" />
    </nz-input-group>
  `,
})
export class LoginPage {
  inputValue!: string;
}
