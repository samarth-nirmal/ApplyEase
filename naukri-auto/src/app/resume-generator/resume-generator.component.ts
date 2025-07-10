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
import { Education } from '../Models/education';


@Component({
  selector: 'app-resume-generator',
  templateUrl: './resume-generator.component.html',
  styleUrl: './resume-generator.component.css',
})
export class ResumeGeneratorComponent {

  skillOptions: string[] = [
  'Angular Developer',
  'React Developer',
  'Node.js',
  'TypeScript',
  'JavaScript',
  'HTML5',
  'CSS3',
  'REST APIs',
  'MongoDB',
  'SQL',
  'Git & GitHub',
  'Unit Testing',
  'Jasmine',
  'Agile Methodologies',
  'Responsive Design',
  'Webpack',
  'RxJS',
  'Bootstrap',
  'Tailwind CSS',
  'Figma'
];


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
      'customClasses',
      'link',
      'unlink',
      'insertHorizontalRule',
      'removeFormat',
    ],
    [
      'undo',
      'redo',
      'justifyLeft',
      'justifyCenter',
      'justifyRight',
      'justifyFull',
      'indent',
      'outdent',
      'insertOrderedList', // hides numbered list
    ]
  ]
};

skillsEditorHtml: string = '<ul><li>&nbsp;</li></ul>';

extractAndStoreSkills(): void {
  const parser = new DOMParser();
  const doc = parser.parseFromString(this.skillsEditorHtml, 'text/html');
  const listItems = doc.querySelectorAll('li');

  const extractedSkills = Array.from(listItems)
    .map(li => li.textContent?.trim() || '')
    .filter(skill => skill.length > 0);
  this.resume.skills = [...extractedSkills];
  this.nextStep();
  console.log(this.resume)
}


  resume = {
    firstName: '',
    lastName: '',
    city: '',
    country: '',
    pincode: '',
    phoneNumber: '',
    email: '',
    jobs: [] as Jobs[],
    education: [] as Education[],
    skills: [] as any[]
  };

  education = {
    schoolName: '',
    schoolLocation: '',
    fieldOfStudy: '',
    qualification: '',
    graduationYear: '',
    percentageOrCgpa: 0,
    country: '',
  }

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
    { label: 'Education' },
    { label: 'Skills' },
    { label: 'Summary' },
    { label: 'Languages' },
    { label: 'Certifications' },
    { label: 'Achievements' },
  ];

  
  currentStep = 0;

  constructor(
    private resumeBuilder: ResumeBuilderServiceService,
    private dialog: MatDialog
  ) {}
  @ViewChild('experienceConfirm') experienceConfirm!: TemplateRef<any>;
  @ViewChild('jobDescription') jobDescription!: TemplateRef<any>;
  @ViewChild('educationDialog') educationDialog!: TemplateRef<any>;

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
    if (this.currentStep === 1) {
      this.currentJob = {
        jobTitle: '',
        companyName: '',
        startDate: '',
        endDate: '',
        city: '',
        country: '',
        description: '<ul><li>&nbsp;</li></ul>',
        currentlyWorking: false,
      };
    } else if (this.currentStep === 2) {
      this.education = {
        schoolName: '',
        schoolLocation: '',
        fieldOfStudy: '',
        qualification: '',
        graduationYear: '',
        percentageOrCgpa: 0,
        country: '',
      };
    }
    this.dialog.closeAll();
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      localStorage.setItem('resumeStep', this.currentStep.toString());
    }

    if (this.currentStep === 1) {
      this.currentJob = {
        jobTitle: '',
        companyName: '',
        startDate: '',
        endDate: '',
        city: '',
        country: '',
        description: '<ul><li>&nbsp;</li></ul>',
        currentlyWorking: false,
      };
    } else if (this.currentStep === 2) {
      this.education = {
        schoolName: '',
        schoolLocation: '',
        fieldOfStudy: '',
        qualification: '',
        graduationYear: '',
        percentageOrCgpa: 0,
        country: '',
      };
    }
    this.dialog.closeAll();
  }

  submitResume() {
    console.log('Final Resume:', this.resume);
  }

  addJobDescription() {
    this.dialog.open(this.jobDescription, {
      panelClass: 'custom-dialog',
    });
  }

  includeJobDescription() {
    const jobToAdd = {
      ...this.currentJob,
      endDate: this.currentJob.currentlyWorking
        ? 'PRESENT'
        : this.currentJob.endDate,
    };
    this.resume.jobs.push(jobToAdd);
    console.log(this.resume);
    this.dialog.closeAll();
    this.dialog.open(this.experienceConfirm, {
      panelClass: 'custom-dialog',
    });
  }

  openEducationDialog() {
    this.resume.education.push({
      ...this.education
    });
    this.dialog.open(this.educationDialog, {
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
      description: '<ul><li>&nbsp;</li></ul>',
      currentlyWorking: false,
    };
    this.dialog.closeAll();
  }

  addAnotherEducation() {
    this.education = {
      schoolName: '',
      schoolLocation: '',
      fieldOfStudy: '',
      qualification: '',
      graduationYear: '',
      percentageOrCgpa: 0,
      country: '',
    };
    this.dialog.closeAll();
  }
}
