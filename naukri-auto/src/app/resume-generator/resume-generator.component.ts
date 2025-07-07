import {
  Component,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ResumeBuilderServiceService } from '../jobServices/resume-builder-service.service';
import { MatDialog } from '@angular/material/dialog';
import { count } from 'console';
import { Jobs } from '../Models/jobs';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-resume-generator',
  templateUrl: './resume-generator.component.html',
  styleUrl: './resume-generator.component.css',
})
export class ResumeGeneratorComponent {

editorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: '400px',
  minHeight: '0',
  maxHeight: 'auto',
  width: '100%',
  minWidth: '0',
  translate: 'yes',
  defaultParagraphSeparator: 'p',
  toolbarHiddenButtons: [
    [
      'strikeThrough',
      'subscript',
      'superscript',
      'insertImage',
      'insertVideo',
      'toggleEditorMode',
      'heading',
      'fontName',
      'fontSize',
      'textColor',
      'backgroundColor',
    ],
    [
      'undo',
      'redo',
      'justifyFull',
      'indent',
      'outdent',
    ]
  ]
};
  
  resume = {
    firstName: '',
    lastName: '',
    city: '',
    country: '',
    pincode: '',
    phoneNumber: '',
    email: '',
    jobs: [] as Jobs[],
  };

  currentJob: Jobs = {
    jobTitle: '',
    companyName: '',
    startDate: '',
    endDate: '',
    city: '',
    country: '',
    description: '<ul><li>&nbsp;</li></ul>',
    currentlyWorking: false,
  };

  steps = [
    { label: 'Contact Info' },
    { label: 'Experience' },
    { label: 'Projects' },
    { label: 'Education' },
    { label: 'Skills' },
  ];

  currentStep = 0;

  constructor(
    private resumeBuilder: ResumeBuilderServiceService,
    private dialog: MatDialog
  ) {}
  @ViewChild('experienceConfirm') experienceConfirm!: TemplateRef<any>;
  @ViewChild('jobDescription') jobDescription!: TemplateRef<any>;

  ngOnInit() {
    const savedStep = localStorage.getItem('resumeStep');
    this.currentStep = savedStep ? parseInt(savedStep, 10) : 0;
  }

  ngOnDestroy() {
    localStorage.removeItem('resumeStep');
  }

  onSave() {
    localStorage.removeItem('resumeStep');
    this.currentStep = 0;
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      localStorage.setItem('resumeStep', this.currentStep.toString());
    }
    this.dialog.closeAll();
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      localStorage.setItem('resumeStep', this.currentStep.toString());
    }
    this.dialog.closeAll();
  }

  submitResume() {
    console.log('Final Resume:', this.resume);
  }

  onJobContinue() {
    const jobToAdd = {
      ...this.currentJob,
      endDate: this.currentJob.currentlyWorking
        ? 'PRESENT'
        : this.currentJob.endDate,
    };
    this.resume.jobs.push(jobToAdd);
    console.log(this.resume)
    this.dialog.open(this.experienceConfirm, {
      panelClass: 'custom-dialog',
    });
  }

  addJobDescription() {
    this.dialog.open(this.jobDescription, {
      panelClass: 'custom-dialog',
    });
  }

  addAnotherJob() {
    this.currentJob = {
      jobTitle: '',
      companyName: '',
      startDate: '',
      endDate: '',
      city: '',
      country: '',
      description: '',
      currentlyWorking: false,
    };
    this.dialog.closeAll();
  }
}
