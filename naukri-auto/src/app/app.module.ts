import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JobInputsComponent } from './job-inputs/job-inputs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.service';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SecureComponent } from './secure/secure.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatCardModule } from '@angular/material/card';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingComponent } from './loading/loading.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatChipsModule } from '@angular/material/chips';
import { FetchedJobsComponent } from './fetched-jobs/fetched-jobs.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { CreateCoverletterComponent } from './create-coverletter/create-coverletter.component';
import { ResumeGeneratorComponent } from './resume-generator/resume-generator.component';
import { CreateResumeOptionsComponent } from './create-resume-options/create-resume-options.component';
import { ExperienceNoteComponent } from './experience-note/experience-note.component';
import { SelectTemplateComponent } from './select-template/select-template.component';
import { ResumePreviewComponent } from './resume-preview/resume-preview.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    AppComponent,
    JobInputsComponent,
    LoginComponent,
    NavbarComponent,
    SecureComponent,
    DashboardComponent,
    AdminDashboardComponent,
    LoadingComponent,
    UserProfileComponent,
    FetchedJobsComponent,
    CreateCoverletterComponent,
    ResumeGeneratorComponent,
    CreateResumeOptionsComponent,
    ExperienceNoteComponent,
    SelectTemplateComponent,
    ResumePreviewComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    NgbModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatProgressBarModule,
    MatChipsModule,
    MatPaginatorModule,
    FormsModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatTooltipModule,
    AngularEditorModule,
    MatTabsModule
  ],
  providers: [
    provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync(),
    provideHotToastConfig({
      position: 'bottom-center'
    })
  ],
  bootstrap: [AppComponent],
})


export class AppModule {}
