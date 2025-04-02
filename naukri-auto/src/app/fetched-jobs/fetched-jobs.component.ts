import { Component } from '@angular/core';
import { JobService } from '../jobServices/job.service';
import { AuthService } from '../jobServices/auth.service';

@Component({
  selector: 'app-fetched-jobs',
  templateUrl: './fetched-jobs.component.html',
  styleUrl: './fetched-jobs.component.css'
})
export class FetchedJobsComponent {
  userId: number = this.authService.getUserId();
  allJobs: any[] = [];
  jobList: any[] = [];
  selectedFilter: string = '';

  constructor(private jobService: JobService, private authService: AuthService) {}

  ngOnInit() {
    this.jobService.getJobList(this.userId).subscribe((data) => {
      this.allJobs = data;
      console.log("Fetched Jobs:", this.allJobs);
      this.filterJobs(); // ✅ Apply filter initially
    });
  }

  errorMessage: string = '';

  applyRelavent() {
    this.errorMessage = ''; // Clear previous error message
    this.jobService.autoApplyJobs(this.userId, true).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.error("Error applying relevant jobs:", err);
        this.errorMessage = "Failed to apply relevant jobs. Please try again later.";
      }
    });
  }

  applyAll() {
    this.errorMessage = ''; // Clear previous error message
    this.jobService.autoApplyJobs(this.userId, false).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.error("Error applying all jobs:", err);
        this.errorMessage = "Failed to apply all jobs. Please try again later.";
      }
    });
  }

  filterJobs() {
    if (this.selectedFilter === 'mostRelevant') {
      this.jobList = this.allJobs.filter(job => job.matchScore >= 80);
    } else {
      this.jobList = [...this.allJobs];
    }
  }
}
