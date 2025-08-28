import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode }  from 'jwt-decode';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<any>(null);

  userId : number | undefined;

  constructor(private http: HttpClient, private router: Router, private toast: HotToastService, private ngZone: NgZone) {}

  handleCredentialResponse(response: any) {
    this.http.post<any>('http://localhost:5076/api/auth/google-login', { token: response.credential }).pipe(
      this.toast.observe({
        loading: 'Logging in with Google...',
        success: 'Logged in successfully!',
        error: 'Google login failed. Please try again.',
      }),
      catchError((error) => {
        // Handle the error and return an observable
        console.error('Login error:', error);
        return of(null);
      })
    ).subscribe((res) => {
      if (res && res.token) {
        localStorage.setItem('authToken', res.token);
        this.authState.next(res);
        const userRole = this.getUserRole();
        this.ngZone.run(() => {
          if (userRole === 'User') {
            this.router.navigate(['/landing-page']);
          } else {
            this.router.navigate(['/admin']);
          }
        });
      }
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

  successToast(message: string) {
    this.toast.success(message, {
      duration: 3000
    });
  }

  failureToast(message: string) {
    this.toast.error(message, {
      duration: 3000
    });
  }

  loadingToast(message: string) {
    this.toast.loading(message, {
      duration: 3000
    });
  }
  
  

  logout() {
    const token = this.getToken();
  
    if (token) {
      this.http.post('http://localhost:5076/api/auth/logout', {}).subscribe({
        next: () => {
          this.toast.success('Logged out successfully!');
        }
      });
    }
  
    localStorage.removeItem('authToken');
    this.authState.next(null);
    this.router.navigate(['/login']);
  }

  simplelogout() {
    this.toast.success('Logged out successfully!');
    localStorage.removeItem('authToken');
    this.authState.next(null);
    // this.router.navigate(['/login']);
  }
}
