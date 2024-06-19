// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = next.data['expectedRole'];

    if (true) {
      const userType = this.authService.getUserType();

      if (userType === 'admin' && (expectedRole === 'admin' || expectedRole === 'superadmin')) {
        return true;
      } else if (userType === 'superadmin' && expectedRole === 'superadmin') {
        return true;
      } else {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    } else {
      this.router.navigate(['/Login']); // Redirect to login if not logged in
      return false;
    }
  }
}
