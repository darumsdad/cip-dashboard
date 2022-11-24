import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venue } from '../models/venue';
import { environment } from 'src/environments/environment';
 


@Injectable({
  providedIn: 'root'
})
export class VenueService {

  baseUrl = environment.baseUrl + '/venues';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Venue[]> {
    return this.http.get<Venue[]>(this.baseUrl);
  }

  get(id: any): Observable<Venue> {
    return this.http.get<Venue>(`${this.baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }


}
