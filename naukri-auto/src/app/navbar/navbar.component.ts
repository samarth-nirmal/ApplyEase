import { Component, HostListener } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../jobServices/auth.service';
import { JobService } from '../jobServices/job.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router, private jobService : JobService) {}
  userId : any | undefined
  logoSrc = 'applogo.png';
  isScrolled = false;
  LoggedIn : boolean = false;
  isLandingPage: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
    this.logoSrc = window.scrollY > 10 ? 'app-logo-black.png' : 'applogo.png';
    
  }

  ngOnInit() {
      this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLandingPage = event.url === '/landing-page' || event.urlAfterRedirects === '/landing-page';
      }
    });
  }

  isUserLoggedIn() {
    return this.authService.isAuthenticated();
  }


  login() {
    this.router.navigate(['/login'])
  }
  userProfile() {
    this.userId = this.authService.getUserId();
    this.router.navigate(['user-profile', this.userId])
  }

  jobSearch() {
    this.router.navigate(['/job-inputs'])
  }

  dashboard() {
    this.router.navigate(['/landing-page'])
  }

  resumeBuilder() {
    this.router.navigate(['/create-resume-options'])
  }

  loginToNaukri() {
    this.userId = this.authService.getUserId();
    this.jobService.naukriLogin(this.userId).subscribe((data) => {
      
    })
  }

  fetchedJobs() {
    this.router.navigate(['/fetched-jobs'])
  }

  logout() {
    this.authService.logout();
    // this.router.navigate(['/login']);
  }
}
