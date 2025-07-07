import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumeBuilderServiceService {

  constructor() { }

  private selectedTemplate: string | null = null;

  setTemplate(template: string): void {
    this.selectedTemplate = template;
  }

  getTemplate(): string | null {
    return this.selectedTemplate;
  }
}
