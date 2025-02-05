import { inject, Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({ providedIn: 'root' })
export class ToasterService {
  nzNotification = inject(NzNotificationService);

  success(msg: string, title?: string): void {
    this.nzNotification.create('success', title ?? 'Sucesso!', msg);
  }
  info(msg: string, title?: string): void {
    this.nzNotification.create('info', title ?? 'Informação!', msg);
  }
  warning(msg: string, title?: string): void {
    this.nzNotification.create('warning', title ?? 'Aviso!', msg);
  }
  error(msg: string, title?: string): void {
    this.nzNotification.create('error', title ?? 'Erro!', msg);
  }
}
