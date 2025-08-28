import { Component } from '@angular/core';
import { ResumeService } from '../jobServices/resume.service';
import { ResumeBuilderServiceService } from '../jobServices/resume-builder-service.service';
import { AuthService } from '../jobServices/auth.service';

@Component({
  selector: 'app-view-resumes',
  templateUrl: './view-resumes.component.html',
  styleUrl: './view-resumes.component.css'
})
export class ViewResumesComponent {
  constructor(private resumeService : ResumeBuilderServiceService, private authService : AuthService) {}

  templateList: { id: number, name: string }[] = [
    { id: 1, name: 'Resume Template 1.jpeg' },
    { id: 2, name: 'Resume Template 2.jpeg' },
    { id: 3, name: 'Resume Template 3.jpeg' }
  ];

  getTemplateImage(templateId: number): string {
  const template = this.templateList.find(t => t.id === templateId);
  return template ? `${template.name}` : 'Resume Template 1.jpeg';
}

  
  userResumes : any[] = [];

  ngOnInit() {
    this.resumeService.getUserResumes(this.authService.getUserId()).subscribe(resumes => {
      this.userResumes = resumes;
      console.log(this.userResumes);
    });
  }
}
