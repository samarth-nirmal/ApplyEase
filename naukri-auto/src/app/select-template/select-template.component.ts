import { Component } from '@angular/core';
import { ResumeBuilderServiceService } from '../jobServices/resume-builder-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-template',
  templateUrl: './select-template.component.html',
  styleUrl: './select-template.component.css'
})
export class SelectTemplateComponent {
  constructor(private resumeBuilder : ResumeBuilderServiceService, private router : Router) { }
  templateList: { id: number, name: string }[] = [
    { id: 1, name: 'Resume Template 1.jpeg' },
    { id: 2, name: 'Resume Template 2.jpeg' },
    { id: 3, name: 'Resume Template 3.jpeg' }
  ];

  selectedTemplate: number = 0;
  transferTemplate: number = 0;;

  selectTemplate(template: number): void {
    this.selectedTemplate = template;
  }

  goToResumeBuilder() {
    this.transferTemplate = this.selectedTemplate;
    this.router.navigate(['/resume-generator', this.transferTemplate]);
    this.resumeBuilder.setTemplate(this.transferTemplate);
  }
}
