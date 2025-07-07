import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-resume-options',
  templateUrl: './create-resume-options.component.html',
  styleUrl: './create-resume-options.component.css'
})
export class CreateResumeOptionsComponent {
  constructor(private router: Router) {}

  onUploadResume() {
    this.router.navigate(['/user-experience']);
  }

  onStartFresh() {
    this.router.navigate(['/user-experience']);
  }
}
