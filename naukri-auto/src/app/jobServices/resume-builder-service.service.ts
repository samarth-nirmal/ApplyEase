import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumeBuilderServiceService {

  constructor() { }

  private selectedTemplate: number = 0

  setTemplate(template: number): void {
    this.selectedTemplate = template;
  }

  getTemplate(): number | null {
    return this.selectedTemplate;
  }
}
