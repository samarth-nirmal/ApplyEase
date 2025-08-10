import { Component, Input } from '@angular/core';
import { Education, Jobs, Projects, Resume } from '../Models/resume';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-resume-template2',
  templateUrl: './resume-template2.component.html',
  styleUrl: './resume-template2.component.css'
})
export class ResumeTemplate2Component {
    @Input() resume!: Resume;
    @Input() currentJob!: Jobs;
    @Input() education!: Education;
    @Input() currentSkill!: string;
    @Input() currentCertifications! : string;
    @Input() currentAchivements!: string;
    @Input() currentProjects!: Projects;
  
    
  
    ngOnInit() {
      console.log(this.currentJob);
    }
  
    constructor(private sanitizer: DomSanitizer) {}
  
    getSanatizedHtmlAchivementsAndCertifications(html : string) : SafeHtml {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
  
    getSanitizedHtmlJob(html: string): SafeHtml {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
  
    getSanatizedHtmlProjects(html: string): SafeHtml {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
  
    getSanitizedHtmlSkills(html: string): SafeHtml {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const listItems = doc.querySelectorAll('li');
  
      // Convert <li> items to comma-separated string
      const commaSeparatedSkills = Array.from(listItems)
        .map((li) => li.textContent?.trim())
        .filter((text) => !!text)
        .join(', ');
  
      // Sanitize and return
      return this.sanitizer.bypassSecurityTrustHtml(commaSeparatedSkills);
    }
  
    get hasCurrentJob(): boolean {
      return !!(
        this.currentJob?.companyName ||
        this.currentJob?.jobTitle ||
        this.currentJob?.description
      );
    }
  
    get hasCurrentProject(): boolean {
      return !!(
        this.currentProjects?.projectName ||
        this.currentProjects?.technologiesUsed ||
        this.currentProjects?.projectDescription
      );
    }
  
    get hasCurrentSkill(): boolean {
      return !!this.currentSkill;
    }
  
    get hasCurrentAchivements(): boolean {
      return !!this.currentAchivements;
    }
  
    get hasCurrentCertf(): boolean {
      return !!this.currentCertifications;
    }
  
    get hasCurrentEducation(): boolean {
      return !!(
        this.education?.schoolName ||
        this.education?.qualification ||
        this.education?.graduationYear ||
        this.education?.schoolLocation ||
        this.education?.fieldOfStudy ||
        this.education?.country
      );
    }
}
