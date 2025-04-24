import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { AuthService } from '../jobServices/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { catchError, of } from 'rxjs';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewChecked {
  hideRegisterPassword: any;
  hideConfirmPassword: any;
  hidePassword = true;

  user: any = {
    name: '',
    email: '',
    password: ''
  };

  newUser: any = {
    name: '',
    email: '',
    password: ''
  };

  isRegister: boolean = false;
  loginError: string = '';
  googleRenderedLogin = false;
  googleRenderedRegister = false;
  loading = false;
 
  constructor(private authService: AuthService, private router: Router, private toast: HotToastService) {}

  ngOnInit() {
    google.accounts.id.initialize({
      client_id: '1079721870613-8s9r3idpedu0gdgl5umfaa0rhf4bimqg.apps.googleusercontent.com',
      callback: (response: any) => {
        this.loading = true
        this.authService.handleCredentialResponse(response)
        this.loading = false;
      }
    });
  }

  ngAfterViewChecked() {
    if (!this.isRegister && !this.googleRenderedLogin && document.getElementById('googleSignIn')) {
      this.renderGoogleButton('googleSignIn');
      this.googleRenderedLogin = true;
      this.googleRenderedRegister = false;
    } else if (this.isRegister && !this.googleRenderedRegister && document.getElementById('googleSignInRegister')) {
      this.renderGoogleButton('googleSignInRegister');
      this.googleRenderedRegister = true;
      this.googleRenderedLogin = false;
    }
  }

  renderGoogleButton(elementId: string) {
    google.accounts.id.renderButton(
      document.getElementById(elementId),
      { theme: 'outline', size: 'large' }
    );
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.valid) {
      this.authService.loginNormal(this.user.email, this.user.password).pipe(
        this.toast.observe({
          loading: 'Logging in...',
          success: 'Logged in successfully!',
          error: 'Login failed. Please check your credentials.',
        }),
        catchError((error) => {
          this.loginError = error.error || 'Login failed';
          return of(null); // Return a null observable to continue the stream
        })
      ).subscribe((res) => {
        if (res && res.token) {
          localStorage.setItem('authToken', res.token);
          this.authService.setAuthState(res);
          const userRole = this.authService.getUserRole();
          if (userRole === 'User') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/admin-dashboard']);
          }
        }
      });
    }
  }

  onRegister(registerForm: NgForm) {
    if (registerForm.valid) {
      this.authService.register(this.newUser.email, this.newUser.password, this.newUser.name).pipe(
        this.toast.observe({
          loading: 'Registering...',
          success: 'Registered successfully, Redirecting to login...',
          error: 'Registration failed. Email already exists.',
        }),
        catchError((err) => {
          this.loginError = err.error || 'Registration failed';
          return of(null); // handle stream gracefully
        })
      ).subscribe((res) => {
        console.log(res)
        if(res == 200) {
          this.isRegister = false;
          registerForm.reset();
        }
      });
    }
  }

  toggleForm() {
    this.isRegister = !this.isRegister;
    this.googleRenderedLogin = false;
    this.googleRenderedRegister = false;
  }
}
