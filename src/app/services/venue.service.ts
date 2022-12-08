import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Venue } from '../models/venue';
import { environment } from 'src/environments/environment';
 


@Injectable({
  providedIn: 'root'
})
export class VenueService {

  private _venues = new BehaviorSubject([])

  get venues() {
    return this._venues.asObservable()
  }

  updateThings(callback: Function) {
    this.getAll().subscribe({
      next: (e) => {
        console.log(e)
        this._venues.next(e)
        callback();
      },
      error: (e) => {
        alert(e.message)
        callback();
      }
    })
     
  }


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
