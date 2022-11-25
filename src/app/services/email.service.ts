import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  baseUrl = environment.baseUrl + '/email';

  constructor(private http: HttpClient) { }

  post(id: any,data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}`, data);
  }

  

}
