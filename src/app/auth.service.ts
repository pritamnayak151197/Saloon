// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'currentUser';

  constructor() {}
  userData: any;

  authenticateUser(userData: any): boolean {
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }

  getCurrentUser(): any {
    this.userData = localStorage.getItem('userData');
    return JSON.parse(this.userData);
  }

  getUserType(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser.userType;
  }

  isAdmin(): boolean {
    return this.getUserType() === 'admin';
  }

  isSuperAdmin(): boolean {
    return this.getUserType() === 'superadmin';
  }
}
