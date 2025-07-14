import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobInputsComponent } from './job-inputs/job-inputs.component';
import { LoginComponent } from './login/login.component';
import { SecureComponent } from './secure/secure.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './guards/admin.guard';
import { LoadingComponent } from './loading/loading.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FetchedJobsComponent } from './fetched-jobs/fetched-jobs.component';
import { CreateCoverletterComponent } from './create-coverletter/create-coverletter.component';
import { ResumeGeneratorComponent } from './resume-generator/resume-generator.component';
import { CreateResumeOptionsComponent } from './create-resume-options/create-resume-options.component';
import { ExperienceNoteComponent } from './experience-note/experience-note.component';
import { SelectTemplateComponent } from './select-template/select-template.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [

  { path: '', redirectTo: '/landing-page', pathMatch: 'full' },
  { path: 'public-test', component: LandingPageComponent },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] }, 
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'job-inputs', component: JobInputsComponent, canActivate: [AuthGuard] },
  { path: 'user-profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'fetched-jobs', component: FetchedJobsComponent, canActivate: [AuthGuard] },
  { path: 'create-coverletter', component: CreateCoverletterComponent, canActivate: [AuthGuard] },
  { path: 'resume-generator/:template', component: ResumeGeneratorComponent, canActivate: [AuthGuard] },
  { path: 'create-resume-options', component: CreateResumeOptionsComponent, canActivate: [AuthGuard] },
  { path: 'user-experience', component: ExperienceNoteComponent, canActivate: [AuthGuard] },
  { path: 'select-template', component: SelectTemplateComponent, canActivate: [AuthGuard] },
  { path: 'loading', component: LoadingComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}
