import { Component, inject, OnInit } from '@angular/core';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { AuthContext } from '../api/auth.context';
import { loader, LoadingService } from '../services/loading.service';
import { LoadingComponent } from '../components/loading.component';
import { Router } from '@angular/router';
import { ToasterService } from '../services/toaster.service';

@Component({
  imports: [
    NzInputGroupComponent,
    FormsModule,
    NzInputDirective,
    NzFormDirective,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormControlComponent,
    NzButtonComponent,
    NzRowDirective,
    NzColDirective,
    LoadingComponent,
  ],
  template: `
    <app-loading>
      <form nz-form [formGroup]="form" class="login-form" (ngSubmit)="submitForm()">
        <nz-form-item>
          <nz-form-control nzErrorTip="Por favor informe um email!">
            <nz-input-group nzPrefixIcon="user">
              <input nz-input formControlName="email" placeholder="Email" type="email" />
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control>
            <nz-input-group nzPrefixIcon="lock">
              <input type="password" nz-input formControlName="password" placeholder="Password" />
            </nz-input-group>
          </nz-form-control>
        </nz-form-item>
        <div nz-row class="login-form-margin" nzJustify="end">
          <div nz-col [nzSpan]="24">
            <a class="login-form-forgot">Esqueci minha senha</a>
          </div>
        </div>
        <button nz-button class="login-form-button login-form-margin" [nzType]="'primary'">Entrar</button>
      </form>
    </app-loading>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }

      .login-form {
        max-width: 500px;
      }

      .login-form-margin {
        margin-bottom: 16px;
      }

      .login-form-forgot {
        float: right;
      }

      .login-form-button {
        width: 100%;
      }
    `,
  ],
})
export class LoginPage implements OnInit {
  _fb = inject(NonNullableFormBuilder);
  _auth = inject(AuthContext);
  _router = inject(Router);
  _loading = inject(LoadingService);
  _toaster = inject(ToasterService);

  form = this._fb.group({
    email: this._fb.control('', [Validators.required]),
    password: this._fb.control('', [Validators.required]),
  });

  ngOnInit(): void {
    this._auth.logout();
  }

  submitForm(): void {
    if (this.form.value.email && this.form.value.password)
      this._auth
        .signIn(this.form.value.email, this.form.value.password)
        .pipe(loader(this._loading))
        .subscribe(() => {
          this._router.navigate(['/home']);
        });
  }
}
