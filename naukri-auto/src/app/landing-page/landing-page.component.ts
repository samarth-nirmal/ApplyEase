import { Component } from '@angular/core';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

  featureList: { logo: string; heading: string; text: string; hover?: boolean }[] = [
    {
      logo: 'work',
      heading: 'Auto Job Applier',
      text: 'Automatically apply to multiple jobs with a single click',
      hover: false
    },
    {
      logo: 'mark_as_unread',
      heading: 'Cover Letter Generator',
      text: 'Generate personalized cover letters for each job application',
      hover: false
    },
    {
      logo: 'description',
      heading: 'AI Resume Builder',
      text: 'Create a professional resume in minutes',
      hover: false
    },
    {
      logo: 'alternate_email',
      heading: 'Auto Cold Email Sender',
      text: 'Automatically send cold emails to potential employers',
      hover: false
    }
  ]

}
