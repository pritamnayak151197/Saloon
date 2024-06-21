import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = 'admin'; // Hard-coded user role (for demonstration)

    // Check if the user is logged in
    if (!this.isLoggedIn()) {
      this.router.navigate(['/Login']); // Redirect to login if not logged in
      return false;
    }

    // Define hard-coded permissions based on user roles
    const permissions = {
      superadmin: ['Saloons', 'Services', 'Packages', 'Customer'],
      admin: ['Saloons', 'Services', 'Packages'],
      customer: ['Customer']
    };

    const routeConfig = next.routeConfig;
    const routePermission = routeConfig ? routeConfig.path || '' : '';

    // Allow access if the user has permission for the current route
    if (permissions[userRole].includes(routePermission)) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']); // Redirect to unauthorized if access is not allowed
      return false;
    }
  }

  // Simulate isLoggedIn method (replace with your actual implementation)
  isLoggedIn(): boolean {
    // Implement your login check logic here
    return true; // For demonstration, always return true
  }
}
