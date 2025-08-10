import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resume } from '../Models/resume';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateResumeService {

  constructor(private http : HttpClient) { }

  createResume(resume : Resume) : Observable<Resume> {
    return this.http.post<Resume>('http://localhost:5076/CreateResume', resume);
  }
} 
