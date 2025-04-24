import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http : HttpClient) { }

  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  show() {
    this.loading.next(true);
    
  }

  hide() {
    this.loading.next(false);
  }

  searchJobs(jobData : any) : Observable<any> {
    return this.http.post<any>('http://localhost:5076/api/getjobs', jobData);
  }

  getJobList(id : number) : Observable<any> {
    return this.http.get<any>(`http://localhost:5076/api/get-job-list?userId=${id}`);
  }

  autoApplyJobs(id : number, onlyRelavent : boolean) : Observable<any> {
    return this.http.get<any>(`http://localhost:5076/api/auto-apply?userId=${id}&onlyRelevant=${onlyRelavent}`)
  }

  naukriLogin(id : number) : Observable<any> {
    return this.http.get<any>(`http://localhost:5076/api/login/${id}`);
  }

  checkUserStatus(id : number) : Observable<any> {
    return this.http.get<any>(`http://localhost:5076/api/check-user-status/${id}`);
  }

  submitUserProfile(userProfile : any) : Observable<any> {
    return this.http.post<any>(`http://localhost:5076/api/create-user-profile`, userProfile);
  }

  getUserProfile(id : number) : Observable<any> {
    return this.http.get<any>(`http://localhost:5076/api/get-user-profile?userId=${id}`)
  }

}
