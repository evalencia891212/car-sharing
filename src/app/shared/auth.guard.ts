import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

// export const AuthGuard: CanActivateFn = (route, state) => {
//   return false;
// };

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private user_service: UserService, private router: Router) {}

  canActivate(): boolean {
    
    if (this.user_service.isAuthenticated) {
      return true; // Allow access if the user is authenticated
    } else {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
      return false; // Prevent access to the route
    }
  }
}