import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  
  baseUrl = environment.baseUrl + '/files';

  constructor(private http: HttpClient) { }

  // post(id: any,data: any): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/${id}`, data);
  // }

  post(id: any, data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}`, data);
  }

 

  
  delete(fileName: any) {
    return this.http.put<any>(`${this.baseUrl}`, 
      {
       fileName: fileName
      }
    );
  }


}
