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
import { Projects, Resume } from '../Models/resume';
import { CreateResumeService } from '../jobServices/create-resume.service';
import { AuthService } from '../jobServices/auth.service';
import { ActivatedRoute } from '@angular/router';


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

achievements: string[] = [
  'Received Employee of the Month Award',
  'Completed AWS Cloud Practitioner Certification',
  'Improved application performance by 40%',
  'Led a team to successfully deliver a project ahead of deadline',
  'Recognized for outstanding customer support',
  'Won 1st place in internal hackathon',
  'Promoted within 1 year of joining',
  'Automated repetitive tasks saving 10+ hours per week',
  'Decreased bug count by 60% through rigorous testing',
  'Completed Microsoft Azure Fundamentals Certification',
  'Trained and onboarded 5+ new team members',
  'Built a tool adopted by multiple teams internally',
  'Published a technical blog with 5K+ views',
  'Created CI/CD pipeline improving deployment time',
  'Achieved 100% test coverage on critical modules',
  'Presented at internal/external tech conferences',
  'Resolved a critical production issue within 1 hour',
  'Earned client appreciation for timely delivery',
  'Built a scalable system used by 1M+ users',
  'Mentored juniors and helped improve team productivity'
];


skillsEditorHtml: string = '';
certfEditorHtml: string = '';
achivementEditorHtml: string = '';
addedCertificate: Set<string> = new Set();
addedSkills: Set<string> = new Set();
addedAchivement: Set<string> = new Set();
templateName: number = 0;

addSkillToEditor(skill: string): void {
  if (this.addedSkills.has(skill)) return;

  this.addedSkills.add(skill);

  if (!this.skillsEditorHtml.includes('<ul>')) {
    this.skillsEditorHtml = `<ul><li>${skill}</li></ul>`;
  } else {
    this.skillsEditorHtml = this.skillsEditorHtml.replace(
      '</ul>',
      `<li>${skill}</li></ul>`
    );
  }
}

addCertfToEditor(skill: string) : void {
  if (this.addedCertificate.has(skill)) return;

  this.addedCertificate.add(skill);

  if (!this.certfEditorHtml.includes('<ul>')) {
    this.certfEditorHtml = `<ul><li>${skill}</li></ul>`;
  } else {
    // Insert new <li> before </ul>
    this.certfEditorHtml = this.certfEditorHtml.replace(
      '</ul>',
      `<li>${skill}</li></ul>`
    );
  }
}

addAchivemnetsToEditor(achivement : string) : void {
  if(this.addedAchivement.has(achivement)) return;

  this.addedAchivement.add(achivement);

  if (!this.achivementEditorHtml.includes('<ul>')) {
    this.achivementEditorHtml = `<ul><li>${achivement}</li></ul>`;
  } else {
    this.achivementEditorHtml = this.achivementEditorHtml.replace(
      '</ul>',
      `<li>${achivement}</li></ul>`
    );
  }
}


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


popularCertifications: string[] = [
  // Cloud
  'Microsoft Certified: Azure Fundamentals (AZ-900)',
  'Microsoft Certified: Azure Administrator Associate',
  'AWS Certified Cloud Practitioner',
  'AWS Certified Solutions Architect – Associate',
  'Google Associate Cloud Engineer',

  // Software Development
  'Microsoft Certified: DevOps Engineer Expert',
  'Certified Kubernetes Administrator (CKA)',
  'Red Hat Certified Engineer (RHCE)',
  'GitHub Actions Certification',
  'HashiCorp Certified: Terraform Associate',

  // Programming & Web
  'Meta Front-End Developer Professional Certificate',
  'Meta Back-End Developer Professional Certificate',
  'FreeCodeCamp Certifications (Responsive Web Design, JS Algorithms)',
  'Coursera IBM Full Stack Cloud Developer',
  'Oracle Certified Java Programmer (OCPJP)',

  // Cybersecurity
  'Certified Ethical Hacker (CEH)',
  'CompTIA Security+',
  'Certified Information Systems Security Professional (CISSP)',
  'Cisco Certified CyberOps Associate',

  // Data Science & Analytics
  'Google Data Analytics Professional Certificate',
  'Microsoft Certified: Data Analyst Associate',
  'IBM Data Science Professional Certificate',
  'Tableau Desktop Specialist',
  'AWS Certified Data Analytics – Specialty',

  // Project Management
  'Certified Scrum Master (CSM)',
  'PMI Agile Certified Practitioner (PMI-ACP)',
  'Project Management Professional (PMP)',
  'PRINCE2 Foundation',
  'Google Project Management Certificate',

  // Business / Misc
  'HubSpot Content Marketing Certification',
  'Salesforce Administrator Certification',
  'TOGAF 9 Certification',
  'Six Sigma Yellow Belt',
  'ITIL Foundation Certification'
];


extractAndStoreSkills(): void {
  this.resume.skills = this.resume.skills + this.skillsEditorHtml

  this.skillsEditorHtml = '';

  this.nextStep(); // move to next section
}


extractAndStoreCertifications(): void {
  this.resume.certifications = this.resume.certifications + this.certfEditorHtml

  this.certfEditorHtml = '';
  console.log(this.resume.certifications)

  this.nextStep(); // move to next section
}

extractAndStoreAchievements(): void {
  this.resume.achievements = this.resume.achievements + this.achivementEditorHtml

  this.achivementEditorHtml = '';

  console.log(this.resume)

  this.createResumeService.createResume(this.resume).subscribe({
    next: (response) => {
      console.log('Resume created successfully:', response);
    },
    error: (error) => {
      console.error('Error creating resume:', error);
    }
  });

  this.nextStep(); // move to next section
}


  resume : Resume = {
    firstName: '',
    lastName: '',
    city: '',
    country: '',
    pincode: '',
    phoneNumber: '',
    email: '',
    jobs: [] as Jobs[],
    education: [] as Education[],
    projects: [] as Projects[],
    skills: '',
    certifications: '',
    achievements : '',
    resumetemplateId : this.ar.snapshot.params['template'],
    userId : this.authService.getUserId()
  };

currentSkills: string = '';

  education : Education = {
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
    description: '',
    currentlyWorking: false,
  };

  currentProject: Projects = {
    projectName: '',
    projectDescription: '',
    technologiesUsed: '',
  };

steps = [
  { label: 'Basic Info', icon: 'face' },
  { label: 'Experience', icon: 'computer' },
  { label: 'Education', icon: 'book_ribbon' },
  { label: 'Projects', icon: 'adb' },
  { label: 'Skills', icon: 'psychology' },
  { label: 'Certifications', icon: 'redeem' },
  { label: 'Achivements', icon: 'flag' },
];

visitedSteps: number[] = [];
  currentStep = 0;

  constructor(
    private resumeBuilder: ResumeBuilderServiceService,
    private dialog: MatDialog,
    private createResumeService: CreateResumeService,
    private authService : AuthService,
    private ar : ActivatedRoute
  ) {}
  @ViewChild('experienceConfirm') experienceConfirm!: TemplateRef<any>;
  @ViewChild('jobDescription') jobDescription!: TemplateRef<any>;
  @ViewChild('projectDescription') projectDescription!: TemplateRef<any>;
  @ViewChild('educationDialog') educationDialog!: TemplateRef<any>;
  @ViewChild('projectConfirmation') projectConfirmation!: TemplateRef<any>;
  // @ViewChild('projectDialog') projectDialog!: TemplateRef<any>;

  ngOnInit() {
    const savedStep = localStorage.getItem('resumeStep');
    this.currentStep = savedStep ? parseInt(savedStep, 10) : 0;

    this.templateName = this.resumeBuilder.getTemplate() ?? 0;
    console.log("templatee: " + this.ar.snapshot.params['template']);
  }

  ngOnDestroy() {
    localStorage.removeItem('resumeStep');
  }

  onSave() {
    localStorage.removeItem('resumeStep');
    this.currentStep = 0;
  }


  nextStep() {

    if (!this.visitedSteps.includes(this.currentStep)) {
      this.visitedSteps.push(this.currentStep);
    }
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
        description: '',
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
        description: '',
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
    this.dialog.open(this.experienceConfirm, {
      panelClass: 'custom-dialog',
    });
  }

    includeProjectDescription() {
    const jobToAdd = {
      ...this.currentProject,
      projectDescription: this.currentProject.projectDescription || '',
    };
    console.log("ProjecttoAdd:", jobToAdd);
    if (!this.resume.projects) {
      this.resume.projects = [];
    }
    this.resume.projects.push(jobToAdd);
        this.currentProject = {
      projectName: '',
      projectDescription: '',
      technologiesUsed: '',
    };
    this.dialog.closeAll();
    this.dialog.open(this.projectConfirmation, {
      panelClass: 'custom-dialog',
    });

    console.log('Projects:', this.resume.projects);
  }

  openEducationDialog() {
    this.resume.education.push({
      ...this.education
    });
    this.education = {
      schoolName: '',
      schoolLocation: '',
      fieldOfStudy: '',
      qualification: '',
      graduationYear: '',
      percentageOrCgpa: 0,
      country: '',
    };
    this.dialog.open(this.educationDialog, {
      panelClass: 'custom-dialog',
    });

  }

  openProjectsDialogue() {
    // if (!this.resume.projects) {
    //   this.resume.projects = [];
    // }
    // this.resume.projects.push({
    //   ...this.currentProject
    // });
    // this.currentProject = {
    //   projectName: '',
    //   projectDescription: '',
    //   technologiesUsed: '',
    // };
    this.dialog.open(this.projectDescription, {
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
