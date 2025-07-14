import { Component, OnInit } from '@angular/core';
import { AuthService } from './jobServices/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private authService: AuthService, private router : Router) {}

  ngOnInit(): void {
    // if (!this.authService.isAuthenticated()) {
    //   this.authService.logout();
    // }
  }

  shouldHideNavbar(): boolean {
    const hiddenRoutes = ['/login'];
    return hiddenRoutes.includes(this.router.url);
  }
}