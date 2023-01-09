import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthService } from '@nebular/auth';


import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  private _events = new BehaviorSubject([])

  get events() {
    return this._events.asObservable()
  }

  delete(id: any, callback: Function) {
    this.http.delete(`${this.baseUrl}/${id}`).subscribe({
      next: (result) => {
        let currentSet = this._events.value;
        let filteredSet = currentSet.filter(x => x.id !== id)
        this._events.next(filteredSet);
        callback()
      },
      error: (error) => {
        alert(error.message)
        callback();
      }
    })
  }

  load() : Observable<any> {
    return this.all().pipe(
      tap((events) => {
        this._events.next(events)
      })
    )
  }

  baseUrl = environment.baseUrl + '/events';

  constructor(private http: HttpClient)  {}
    
 

  all(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  get(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  save(id: any, data: any) {
    return this.http.put<any>(`${this.baseUrl}/${id}/save`, data);
  }

  addVideo(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/video`, data);
  }

  delete_video(id: any, data: any) {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
    };

    return this.http.delete<any>(`${this.baseUrl}/${id}/video`, options);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

}
