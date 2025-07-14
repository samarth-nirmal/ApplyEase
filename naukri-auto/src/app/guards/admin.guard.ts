import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../jobServices/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/landing-page']);
      return false;
    }

    if (this.authService.getUserRole() === 'Admin') {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
