import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobInputsComponent } from './job-inputs/job-inputs.component';
import { LoginComponent } from './login/login.component';
import { SecureComponent } from './secure/secure.component';
import { AuthGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './guards/admin.guard';
import { LoadingComponent } from './loading/loading.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FetchedJobsComponent } from './fetched-jobs/fetched-jobs.component';

const routes: Routes = [

  { path: 'job-inputs', component : JobInputsComponent, canActivate: [AuthGuard] }, 
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'loading', component: LoadingComponent },
  { path : 'user-profile/:id', component : UserProfileComponent, canActivate: [AuthGuard] },
  { path : 'fetched-jobs', component : FetchedJobsComponent, canActivate : [AuthGuard] }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}
