import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeBuilderServiceService {

  constructor(private http: HttpClient) { }

  private selectedTemplate: number = 0

  setTemplate(template: number): void {
    this.selectedTemplate = template;
  }

  getTemplate(): number {
    return this.selectedTemplate;
  }

  getUserResumes(userId: number) : Observable<any> {
    return this.http.get<any>(`http://localhost:5076/CreateResume/get-resume/${userId}`);
  }
}
