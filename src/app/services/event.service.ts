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

  updateThings(callback: Function) {
    this.all().subscribe({
      next: (events) => {
        console.log(events)
        this.allVenues().subscribe(
          {
            next: (venues) => {
              //console.log(venues)
              let events_with_venue = events.map(event => {
                //console.log(event.data.venueId)
                if (event.data.venueId) {
                  let found = venues.find(x => x.id === parseInt(event.data.venueId))
                  event.venue = found;
                  console.log(event)
                  return event;
                }
               
              });
              console.log(events_with_venue)
              console.log('setting')
              this._events.next(events_with_venue)
              console.log('callback')
              callback();
            },
            error: (error) => {
              alert(error.mesage)
              callback();
            }
          }
        )


      }, error: (e) => {
        alert(e.message)
        callback();
      }
    })

  }

  baseUrl = environment.baseUrl + '/events';
  venueUrl = environment.baseUrl + '/venues';
  webhookUrl = environment.baseUrl + '/webhook';

  constructor(private http: HttpClient) { }

  all(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  allVenues(): Observable<any> {
    return this.http.get<any>(`${this.venueUrl}`);
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
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
