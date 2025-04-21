import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { AuthService } from '../jobServices/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    google.accounts.id.initialize({
      client_id: '1079721870613-8s9r3idpedu0gdgl5umfaa0rhf4bimqg.apps.googleusercontent.com',
      callback: (response: any) => this.authService.handleCredentialResponse(response)
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
      this.authService.loginNormal(this.user.email, this.user.password).subscribe({
        next: (res) => {
          localStorage.setItem('authToken', res.token);
          this.authService.setAuthState(res);

          if (this.authService.getUserRole() === 'User') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/admin']);
          }
        },
        error: (err) => {
          this.loginError = err.error || 'Login failed';
        }
      });
    }
  }

  onRegister(registerForm: NgForm) {
    if (registerForm.valid) {
      this.authService.register(this.newUser.name, this.newUser.email, this.newUser.password).subscribe({
        next: (res) => {
          localStorage.setItem('authToken', res.token);
          this.authService.setAuthState(res);

          if (this.authService.getUserRole() === 'User') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/admin']);
          }
        },
        error: (err) => {
          this.loginError = err.error || 'Registration failed';
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
