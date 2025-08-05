import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../jobServices/auth.service';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  constructor(private router : Router, private authService : AuthService) {}

  ngOnInit() {
     console.log("Landing page loaded");
  }
  ngAfterViewInit(): void {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target); // remove for one-time animation
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-fade]').forEach((el) => {
    observer.observe(el);
  });
}


  isLoggedIn : boolean = this.authService.isAuthenticated();

  featureList: { logo: string; heading: string; text: string; link: string; hover?: boolean }[] = [
    {
      logo: 'work',
      heading: 'Auto Job Applier',
      text: 'Automatically apply to multiple jobs with a single click',
      hover: false,
      link: '/job-inputs'
    },
    {
      logo: 'mark_as_unread',
      heading: 'Cover Letter Generator',
      text: 'Generate personalized cover letters for each job application',
      hover: false,
      link: '/create-coverletter'
    },
    {
      logo: 'description',
      heading: 'AI Resume Builder',
      text: 'Create a professional resume in minutes',
      hover: false,
      link: '/create-resume-options'
    },
    {
      logo: 'alternate_email',
      heading: 'Auto Cold Email Sender',
      text: 'Automatically send cold emails to potential employers',
      hover: false,
      link: '/auto-mailer'
    }
  ]

  pricingList: { pack: string; price: number; feature1: string; feature2: string; feature3: string; feature4: string }[] = [
    {
      pack: 'Basic',
      price: 0,
      feature1: 'Limited job applications',
      feature2: 'Basic resume builder',
      feature3: 'Standard cover letter templates',
      feature4: 'Email support'
    },
    {
      pack: 'Pro',
      price: 25,
      feature1: 'Unlimited job applications',
      feature2: 'Advanced resume builder',
      feature3: 'AI-powered cover letter generator',
      feature4: 'Priority email support'
    },
    {
      pack: 'Premium',
      price: 40,
      feature1: 'All Pro features',
      feature2: 'Auto cold email sender',
      feature3: 'Personalized job recommendations',
      feature4: 'Dedicated account manager'
    }
  ];

  loginPage() {
    this.router.navigate(['/login'])
  }

  goToFeaturePage(link: string) {
    this.router.navigate([link]);
  }


  goToFeatures(sectionId: string) {
      const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  }
}
