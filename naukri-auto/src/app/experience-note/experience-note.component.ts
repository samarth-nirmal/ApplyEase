import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-experience-note',
  templateUrl: './experience-note.component.html',
  styleUrl: './experience-note.component.css'
})
export class ExperienceNoteComponent {

  constructor(private router: Router) { 
    // This constructor can be used for any initialization if needed

  }

  experienceOptions = [
    'Fresher',
    'Less than 3 Years',
    '3 - 5 Years',
    '5 - 10 Years',
    '10+ Years'
  ];

  selectedOption: string | null = null;

  selectOption(option: string): void {
    this.selectedOption = option;
  }

  selectTemplate() {
    this.router.navigate(['/select-template']);
  }

}
