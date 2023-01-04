import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class VenueService {

   

  private _venues = new BehaviorSubject([])

  get venues() {
    return this._venues.asObservable()
  }

  load(callback: Function) {
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

  delete(id: any, callback: Function) {

    this.es.allForVenue(id).subscribe(
      (next) => {
        if (next != undefined && next.length > 0)
        {
          alert("Venue is attached to " + next.length + " events - it can not be deleted")
          callback()
        }
        else
        {
          this.http.delete(`${this.baseUrl}/${id}`).subscribe({
            next: (next) => {
              let current = this._venues.value;
              current = current.filter( item => item.id !== id)
              this._venues.next(current)
              callback()
            },
            error: (error) => {
              alert(error.message)
              callback()
            }
            
          })
        }
      },
      (error) => {
        alert(error.message)
        callback()
      }
    )

   
  }

  private _delete(id: any): Observable<any> {

    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  baseUrl = environment.baseUrl + '/venues';

  constructor(private http: HttpClient,
    private es: EventService) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  saveVideo(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/video`, data);
  }

  get(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  


  delete_video_from_venue(id: any, data: any) {
     const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
    };

    console.log(options)
    return this.http.delete(`${this.baseUrl}/${id}/video`,options);
  }


}
