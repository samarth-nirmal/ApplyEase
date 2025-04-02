import { Component, OnInit } from '@angular/core';
import { AuthService } from '../jobServices/auth.service';


declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}
  hidePassword = true;

  ngOnInit() {
    google.accounts.id.initialize({
      client_id: '1079721870613-8s9r3idpedu0gdgl5umfaa0rhf4bimqg.apps.googleusercontent.com',
      callback: (response: any) => this.authService.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleSignIn'),
      { theme: 'outline', size: 'large' }
    );
  }
}

//1079721870613-8s9r3idpedu0gdgl5umfaa0rhf4bimqg.apps.googleusercontent.com - Client ID
//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 - Client secret