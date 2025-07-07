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
  templateList : string[] = ['Resume Template 1.jpeg', 'Resume Template 2.jpeg', 'Resume Template 3.jpeg'];

  selectedTemplate: string = '';
  transferTemplate: string = '';

  selectTemplate(template: string): void {
    this.selectedTemplate = template;
  }

  goToResumeBuilder() {
    this.resumeBuilder.setTemplate(this.selectedTemplate);
    this.transferTemplate = this.selectedTemplate.replace(/\.jpeg$/, '');
    this.router.navigate(['/resume-generator', this.transferTemplate]);
  }
}
