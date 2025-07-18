import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../jobServices/job.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../jobServices/auth.service';
import { Router } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { ResumeService } from '../jobServices/resume.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-job-inputs',
  templateUrl: './job-inputs.component.html',
  styleUrls: ['./job-inputs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobInputsComponent {
  jobForm: FormGroup;
  userProfileForm: FormGroup;
  userId : number = this.AuthService.getUserId(); 
  naukriLoggedInStatus: boolean | undefined;
  profileCompleteStatus: boolean | undefined;
  isFormSubmitted : boolean = false;
  selectedFileName: string | null = null;
  showProgressBar : boolean = false;
  errorGenerated : boolean = false;
  uploadSuccess: boolean = false;
  errorMessage: string | null = null;
  jobFetchProgress : boolean = false;
  factInterval: any;
  currentFact: string = '';


  profileFields = [
  { label: 'Full Name', name: 'fullName', placeholder: 'Full Name', type: 'text' },
  { label: 'Phone Number', name: 'phoneNumber', placeholder: 'Phone Number', type: 'text' },
  { label: 'Total Experience', name: 'totalExperience', placeholder: 'Total Experience', type: 'number' },
  { label: 'Current Job Title', name: 'currentJobTitle', placeholder: 'Current Job Title', type: 'text' },
  { label: 'Current Company', name: 'currentCompany', placeholder: 'Current Company', type: 'text' },
  { label: 'Industry', name: 'industry', placeholder: 'Industry', type: 'text' },
  { label: 'Primary Skills', name: 'primarySkills', placeholder: 'Primary Skills', type: 'text' },
  { label: 'Secondary Skills', name: 'secondarySkills', placeholder: 'Secondary Skills', type: 'text' },
  { label: 'Certifications', name: 'certifications', placeholder: 'Certifications', type: 'text' },
  { label: 'Highest Qualification', name: 'highestQualification', placeholder: 'Highest Qualification', type: 'text' },
  { label: 'Specialization', name: 'specialization', placeholder: 'Specialization', type: 'text' },
  { label: 'Graduation Year', name: 'graduationYear', placeholder: 'Graduation Year', type: 'number' },
  { label: 'GitHub URL', name: 'gitHubUrl', placeholder: 'GitHub URL', type: 'text' },
  { label: 'LinkedIn URL', name: 'linkedInUrl', placeholder: 'LinkedIn URL', type: 'text' },
  { label: 'Preferred Job Role', name: 'preferredJobRole', placeholder: 'Preferred Job Role', type: 'text' },
  { label: 'Projects', name: 'projects', placeholder: 'Projects', type: 'text' },
  { label: 'Preferred Location', name: 'preferredLocation', placeholder: 'Preferred Location', type: 'text' },
  { label: 'Current CTC', name: 'currentSalary', placeholder: 'Current CTC', type: 'text' },
  { label: 'Expected Salary', name: 'expectedSalary', placeholder: 'Expected Salary', type: 'text' },
  { label: '10th Percentage', name: 'XPercentage', placeholder: '10th Percentage', type: 'text' },
  { label: '12th Percentage', name: 'XIIPercentage', placeholder: '12th Percentage', type: 'text' },
];

noticePeriodOptions = [
  'Immediate', '15 Days or less', '1 Month', '45 Days', '2 Months',
  '3 Months', 'More than 3 Months', 'Serving Notice Period'
];

jobRoles = [
  'Software Engineer', 'Data Scientist', 'DevOps Engineer', 'Frontend Developer',
  'Backend Developer', 'Full Stack Developer', 'QA Engineer', 'UI/UX Designer',
  'Product Manager', 'Business Analyst'
];

experiences = ['Fresher', '1 Year', '2 Years', '3 Years', '4+ Years', '5 Years', '6 Years'];
locations = ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh'];

  jobFacts: string[] = [
    "Finding the best jobs for you...",
    "The IT sector in India contributes nearly 8% to the country's GDP.",
    "Finding the best jobs for you...",
    "Data science and AI-related jobs have seen a 40% increase in hiring in India.",
    "India is the world's second-largest producer of engineers every year.",
    "Finding the best jobs for you...",
    "Freelancing in India is expected to reach $20–30 billion by 2025.",
    "The demand for cybersecurity jobs in India has increased by 200% since 2020.",
    "Finding the best jobs for you...",
    "Bangalore is known as the 'Silicon Valley of India' due to its tech startup boom.",
    "Finding the best jobs for you...",
    "Remote jobs in India have increased by over 120% post-pandemic.",
    "Over 60% of recruiters use AI-powered tools to shortlist candidates in India.",
    "Finding the best jobs for you...",
    "Cloud computing and DevOps roles are among the highest-paying tech jobs in India.",
    "Finding the best jobs for you...",
    "Product-based companies offer salaries 2x higher than service-based firms in India.",
    "Finding the best jobs for you...",
  ];

  constructor(
    private fb: FormBuilder,
    private router : Router,
    public jobService: JobService,
    private AuthService: AuthService,
    private ResumeService : ResumeService,
    private cdr: ChangeDetectorRef,
    private toast : HotToastService
  ) {
    this.jobForm = this.fb.group({
      userId: [this.AuthService.getUserId(), Validators.required],
      jobRole: ['', Validators.required],
      experience: ['', Validators.required],
      location: ['', Validators.required],
      noOfJobs: ['', Validators.required]
    });

    this.userProfileForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      totalExperience: ['', Validators.required],
      currentJobTitle: ['', Validators.required],
      currentCompany: ['', Validators.required],
      industry: ['', Validators.required],
      primarySkills: ['', Validators.required],
      secondarySkills: [''],
      certifications: [''],
      highestQualification: ['', Validators.required],
      specialization: [''],
      graduationYear: ['', Validators.required],
      gitHubUrl: [''],
      linkedInUrl: [''],
      preferredJobRole: ['', Validators.required],
      projects : ['', Validators.required],
      preferredLocation: ['', Validators.required],
      noticePeriod: ['', Validators.required],
      currentSalary: ['', Validators.required],
      expectedSalary: ['', Validators.required],
      willingToRelocate: ['', Validators.required],
      XPercentage: ['', Validators.required],
      XIIPercentage: ['', Validators.required],
      BirthDate: ['', Validators.required],
      userId: [this.AuthService.getUserId(), Validators.required],
      userProfileSummary: ['']
    });
  }
  readonly panelOpenState = signal(false);

  ngOnInit() {
    // this.startJobFacts(); 
    this.jobService
    .checkUserStatus(this.AuthService.getUserId())
    .subscribe((data) => {
      this.naukriLoggedInStatus = data.isNaukriLoggedIn;
      this.profileCompleteStatus = data.isProfileComplete;
    });
    this.cdr.detectChanges();
    console.log(this.AuthService.getUserId())
  }

  

  submitForm() {
    this.jobFetchProgress = true;
    this.startJobFacts(); 
    this.jobService.searchJobs(this.jobForm.value).subscribe((data) => {
      if (Array.isArray(data) && data.length === 0) {
        this.stopJobFacts();
        this.cdr.detectChanges();
        this.toast.error("No Jobs Found", {
          position: 'top-center'
        });
        this.jobFetchProgress = false;
      } else {
        console.log('Jobs found:', data);
        this.toast.success("Jobs Fetched Successfully", {
          position: 'top-center'
        });
        this.jobFetchProgress = false;
        this.stopJobFacts()
        this.router.navigate(['fetched-jobs'])
      }
    }, (error) => {
      this.stopJobFacts();
      this.toast.error("No Jobs Found", {
        position: 'top-center'
      });
      this.jobFetchProgress = false;
      this.cdr.detectChanges();
    });
  }


  startJobFacts() {
    this.updateRandomFact();
    this.factInterval = setInterval(() => {
      this.updateRandomFact();
    }, 3000); // Change fact every 3 seconds
  }

  stopJobFacts() {
    if (this.factInterval) {
      clearInterval(this.factInterval);
      this.factInterval = null;
    }
  }

  
  updateRandomFact() {
    const randomIndex = Math.floor(Math.random() * this.jobFacts.length);
    this.currentFact = this.jobFacts[randomIndex];
    console.log(this.currentFact)
    this.cdr.detectChanges();
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
    fileInput.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    console.log("uploading...")

    if (file) {
      this.showProgressBar = true;
      this.selectedFileName = file.name;
      this.uploadSuccess = false;
      this.errorMessage = null;
      this.cdr.detectChanges();

      this.ResumeService.uploadResume(file).subscribe({
        next: (res) => {
          console.log(res)
          this.uploadSuccess = true;
          console.log('Upload Success:', res);
          this.toast.success("Resume Uploaded", {
            position: 'top-center'
          });

          this.userProfileForm.patchValue({
            fullName: res.extractedData.full_name || '',
            phoneNumber: res.extractedData.phone_number || '',
            totalExperience: res.extractedData.total_experience || '',
            currentJobTitle: res.extractedData.current_job_title || '',
            currentCompany: res.extractedData.current_company || '',
            industry: res.extractedData.industry || '',
            primarySkills: res.extractedData.primary_skills || '',
            secondarySkills: res.extractedData.secondary_skills || '',
            certifications: res.extractedData.certifications || '',
            highestQualification: res.extractedData.highest_qualification || '',
            specialization: res.extractedData.specialization || '',
            graduationYear: res.extractedData.graduation_year || '',
            gitHubUrl: res.extractedData.Github_URL === 'Not Mentioned' ? '' : res.extractedData.Github_URL,
            linkedInUrl: res.extractedData.linkedin_URL === 'Not Mentioned' ? '' : res.extractedData.linkedin_URL,
            preferredJobRole: res.extractedData.preferredJobRole || '',
            projects: res.extractedData.projects || '',
            preferredLocation: res.extractedData.preferedLocation || '',
            XPercentage: res.extractedData.XPercentage  === 'Not Mentioned' ? '' : res.extractedData.XPercentage,
            XIIPercentage: res.extractedData.XIIPercentage  === 'Not Mentioned' ? '' : res.extractedData.XIIPercentage,
            userId: this.AuthService.getUserId()
            
            });
          this.showProgressBar = false;
        },
        error: (error) => {
          this.selectedFileName = null;
          this.toast.error("Resume Upload Failed, try again", {
            position: 'top-center'
          });
          this.errorMessage = 'Failed to upload resume. Please try again.';
          this.showProgressBar = false;
          this.cdr.detectChanges();
        }
        
      });
  }
}

  submitProfileForm() {
    console.log(this.userProfileForm.value);
    const formData = this.userProfileForm.value;
    this.jobService.submitUserProfile(this.userProfileForm.value).subscribe((data) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.toast.success("Profile Updated", {
        position: 'top-center'
      });
    })
    this.jobService.show();

    setTimeout(() => {
      window.location.reload();
      this.jobService.hide();
    }, 5000);
  }



  loginToNaukri() {
    console.log(this.userId)
    this.jobService.naukriLogin(this.userId).subscribe((data) => {
      console.log(data);
      window.location.reload();
      this.toast.success("Logged in to Naukri", {
        position: 'top-center'
      });
    })
  }
}
