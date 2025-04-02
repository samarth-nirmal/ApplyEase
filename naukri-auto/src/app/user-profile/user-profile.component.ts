import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../jobServices/auth.service';
import { JobService } from '../jobServices/job.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  userId : number | undefined
  user : any;
  primarySkills : any[] = [];
  secondarySkills : any[] = [];
  projects : any[] = []
  
  constructor(private authService : AuthService, private jobService : JobService) {}
  
  parseProjects(text: string) {
    const regex = /([\w\s-]+)\s\((.*?)\)/g;
    const projects = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      projects.push({ name: match[1].trim(), details: match[2].trim().split(',') });
    }

    return projects;
  }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.jobService.getUserProfile(this.userId).subscribe((data) => {
      this.user = data;
      this.primarySkills = data.primarySkills.split(',');
      this.secondarySkills = data.secondarySkills.split(',');
      this.projects = this.parseProjects(data.projects);
      console.log(this.projects)
    })
  }
}
