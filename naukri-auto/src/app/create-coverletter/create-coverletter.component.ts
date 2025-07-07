import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../jobServices/auth.service';
import { CoverletterServiceService } from '../jobServices/coverletter-service.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-create-coverletter',
  templateUrl: './create-coverletter.component.html',
  styleUrl: './create-coverletter.component.css'
})
export class CreateCoverletterComponent {
  
  coverLetterForm: FormGroup;
  userId : number | undefined;
  constructor(private fb: FormBuilder, private authService : AuthService, private coverService : CoverletterServiceService, private toast: HotToastService) {

      this.coverLetterForm = this.fb.group({
        userId: [this.authService.getUserId(), Validators.required],
        jobTitle: [''],
        companyName: [''],
        jobDescription: ['', [Validators.required, Validators.minLength(10)]],
      });

  }

  companyName: string = '';
  jobTitle: string = '';
  jobDescription: string = '';
  isSubmitted : boolean = false;
  submittedText: string | undefined;

  ngOnInit() {
    this.userId = this.authService.getUserId();

  }
  
  onSubmit() {
    this.isSubmitted = true; // Start loading
    this.coverService.coverletterSubmit(this.coverLetterForm.value).subscribe({
      next: (data) => {
        console.log(data);
        this.submittedText = data || 'No response'; // adjust "text" if your API returns a different field
        this.toast.success("Generated Successfully")
      },
      error: (err) => {
        console.error(err);
        this.isSubmitted = false;
        this.toast.error("Failed to generate cover letter");
      },
      complete: () => {
        this.isSubmitted = false; // Stop loading
      }
    });
  }

  copyText() {
    if (!this.submittedText) return;
  
    navigator.clipboard.writeText(this.submittedText)
      .then(() => {
        console.log('Copied!');
        // Optional: add a snackbar or toast
      })
      .catch(err => {
        console.error('Copy failed', err);
      });
  }

  
}
