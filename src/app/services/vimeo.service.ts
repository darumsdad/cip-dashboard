import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VimeoService {

  baseUrl = environment.baseUrl + '/vimeo';

  constructor(private http: HttpClient) { }

  put(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  get(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  searchVideo(predicates: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/search`,predicates);
  }

  

}
