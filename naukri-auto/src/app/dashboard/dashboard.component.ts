import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

    constructor(private router : Router) {

    }

    openJobSearch() {
      this.router.navigate(['/job-inputs']);
    }
}
