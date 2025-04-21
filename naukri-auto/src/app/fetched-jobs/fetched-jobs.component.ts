import { ChangeDetectorRef, Component } from '@angular/core';
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
  jobApplyProgress : boolean = false;
  factInterval: any;
  currentFact: string = '';
  successMessage: string = '';


  jobFacts: string[] = [
    "Sit back and Relax, we will auto apply to all jobs for you...",
    "The IT sector in India contributes nearly 8% to the country's GDP.",
    "Data science and AI-related jobs have seen a 40% increase in hiring in India.",
    "Sit back and Relax, we will auto apply to all jobs for you...",
    "India is the world's second-largest producer of engineers every year.",
    "Sit back and Relax, we will auto apply to all jobs for you...",
    "Freelancing in India is expected to reach $20–30 billion by 2025.",
    "Sit back and Relax, we will auto apply to all jobs for you...",
    "The demand for cybersecurity jobs in India has increased by 200% since 2020.",
    "Bangalore is known as the 'Silicon Valley of India' due to its tech startup boom.",
    "Sit back and Relax, we will auto apply to all jobs for you...",
    "Remote jobs in India have increased by over 120% post-pandemic.",
    "Over 60% of recruiters use AI-powered tools to shortlist candidates in India.",
    "Sit back and Relax, we will auto apply to all jobs for you...",
    "Cloud computing and DevOps roles are among the highest-paying tech jobs in India.",
    "Sit back and Relax, we will auto apply to all jobs for you...",
    "Product-based companies offer salaries 2x higher than service-based firms in India.",
    "Sit back and Relax, we will auto apply to all jobs for you..."
    
  ];

  constructor(private jobService: JobService, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.jobService.getJobList(this.userId).subscribe((data) => {
      this.allJobs = data;
      console.log("Fetched Jobs:", this.allJobs);
      this.filterJobs(); // ✅ Apply filter initially
    });
  }

  errorMessage: string = '';

  applyRelavent() {
    this.successMessage = '';
    this.jobApplyProgress = true;
    this.startJobFacts();
    this.errorMessage = ''; // Clear previous error message
    this.jobService.autoApplyJobs(this.userId, true).subscribe({
      next: (data) => {
        console.log(data);

        this.jobService.getJobList(this.userId).subscribe((data) => {
          this.allJobs = data;
          console.log("Fetched Jobs:", this.allJobs);
          this.filterJobs();
        });
        
        this.successMessage = 'Successfully Applied to All Relavent the jobs'
        this.jobApplyProgress = false;
      },
      error: (err) => {
        console.error("Error applying relevant jobs:", err.error);
        if(err.error == "No jobs available for auto-apply.") {
          this.errorMessage = err.error;
          this.jobApplyProgress = false;
        } else {
          this.errorMessage = 'Something went wrong, please try again later.';
          this.jobApplyProgress = false;
        }
      }
    });
  }

  applyAll() {
    this.successMessage = '';
    this.jobApplyProgress = true;
    this.startJobFacts();
    this.errorMessage = ''; // Clear previous error message
    this.jobService.autoApplyJobs(this.userId, false).subscribe({
      next: (data) => {
        console.log(data);
        this.jobApplyProgress = false;
        this.jobService.getJobList(this.userId).subscribe((data) => {
          this.allJobs = data;
          console.log("Fetched Jobs:", this.allJobs);
          this.filterJobs();
        });

        this.successMessage = 'Successfully Applied to All the jobs'
        this.jobApplyProgress = false;
      },
      error: (err) => {
        console.error("Error applying all jobs:", err.error);
        if(err.error == "No jobs available for auto-apply.") {
          this.errorMessage = err.error;
          this.jobApplyProgress = false;
        } else {
          this.errorMessage = 'Something went wrong, please try again later.';
          this.jobApplyProgress = false;
        }
      }
    });
  }

  startJobFacts() {
    this.updateRandomFact();
    this.factInterval = setInterval(() => {
      this.updateRandomFact();
    }, 3000); // Change fact every 3 seconds
  }

  updateRandomFact() {
    const randomIndex = Math.floor(Math.random() * this.jobFacts.length);
    this.currentFact = this.jobFacts[randomIndex];
    this.cdr.detectChanges();
  }

  filterJobs() {
    if (this.selectedFilter === 'mostRelevant') {
      this.jobList = this.allJobs.filter(job => job.matchScore >= 80);
    } else {
      this.jobList = [...this.allJobs];
    }
  }

  successfullyAppliedFilter() {
    if(this.selectedFilter === 'successApply') {
      this.jobList = this.allJobs.filter(job => job.isApplied === 'Applied');
    } else {
      this.jobList = [...this.allJobs];
    }
  }

  NotAppliedFilter() {
    if(this.selectedFilter === 'NotApply') {
      this.jobList = this.allJobs.filter(job => job.isApplied === null);
    } else {
      this.jobList = [...this.allJobs];
    }
  }
}
