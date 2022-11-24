import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 

import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {


  private _events = new BehaviorSubject([])

  get events() {
    return this._events.asObservable()
  }

  updateThings() {
    this.all().subscribe(e => {
      console.log(e)
      this._events.next(e)
    })
     
  }

  private getRandom() {
    return Math.floor(Math.random() * 100)
  }

  
  baseUrl = environment.baseUrl + '/events';
  webhookUrl = environment.baseUrl + '/webhook';

  constructor(private http: HttpClient) { }

  all(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  get(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  submission(id: any, info: any): Observable<any> {
    return this.http.put(`${this.webhookUrl}/${id}`, info);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`,data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}