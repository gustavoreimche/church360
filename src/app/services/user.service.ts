import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  localStorage = inject(LocalStorageService);

  user: User | null = this.localStorage.user;

  setUser(value: User): void {
    this.localStorage.setUser(value);
    this.user = value;
  }
}
