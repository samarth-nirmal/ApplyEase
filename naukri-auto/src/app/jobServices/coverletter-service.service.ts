import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoverletterServiceService {

  constructor(private http: HttpClient, private router: Router, private toast: HotToastService) { }

  coverletterSubmit(coverletterData : any) : Observable<any> {
    return this.http.post<string>('http://localhost:5076/Coverletter', coverletterData, { responseType: 'text' as 'json' })
  }
}
