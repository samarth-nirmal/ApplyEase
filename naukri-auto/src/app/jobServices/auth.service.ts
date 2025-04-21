import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode }  from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<any>(null);

  userId : number | undefined;

  constructor(private http: HttpClient, private router: Router) {}

  handleCredentialResponse(response: any) {
    this.http.post<any>('http://localhost:5076/api/auth/google-login', { token: response.credential })
      .subscribe(res => {
        localStorage.setItem('authToken', res.token);
        this.authState.next(res);
        if(this.getUserRole() === 'User') this.router.navigate(['/dashboard']);
        else this.router.navigate(['/admin']);
      });

  }

  loginNormal(email: string, password: string) {
    return this.http.post<any>('http://localhost:5076/api/auth/login', { email, password })
  }  

  register(email: string, password: string, name: string) {
    return this.http.post<any>('http://localhost:5076/api/auth/register', { email, password, name });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);

      const expiryTime = decoded.exp * 1000;

      if (expiryTime < Date.now()) {

        this.logout();
        return false;
      }
      return true;
      
    } catch (error) {
      this.logout();
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserId() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      return payload.sub || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || 'User'; 
  }

  setAuthState(user: any) {
    this.authState.next(user);
  }

  // getUserId() {
  //     const userId = Number(localStorage.getItem('userId'));
  //     return userId;
  // }
  
  

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    this.authState.next(null);
    this.router.navigate(['/login']); // Redirect to login
  }
}
