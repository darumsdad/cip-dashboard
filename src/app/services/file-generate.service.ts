import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileGenerateService {

  baseUrl = environment.baseUrl + '/generate';

  constructor(private http: HttpClient) { }

  post(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data);
  }

  // post_proposal(data: any): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/proposal`, data);
  // }

}
