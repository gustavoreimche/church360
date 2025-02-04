import { Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { LOCAL_STORAGE_TOKEN } from '../tokens/local-storage.tokens';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  get user(): User | null {
    const user = localStorage.getItem(LOCAL_STORAGE_TOKEN.USER);
    if (!user) {
      return null;
    }
    return JSON.parse(user);
  }

  setUser(user: User) {
    localStorage.setItem(LOCAL_STORAGE_TOKEN.USER, JSON.stringify(user));
  }
}
