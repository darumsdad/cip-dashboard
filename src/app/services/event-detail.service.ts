import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';


import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { phoneValidation } from 'src/app/event/utils';

@Injectable({
  providedIn: 'root'
})

export class EventDetailService {
  
  private _form: any;
  private insurance_contact: any = "cert@dicksteininsurance.com"
  eventId: any;
  
  get form() {
    return this._form
  }

  constructor(private http: HttpClient,private fb: FormBuilder) { 
    
    this._form = this.fb.group({
      id: [''],
      data: this.fb.group({

        status: [''],
        event_type: [''],
        description: [''],
        date: [''],
        start: [''],
        end: [''],
        status_update_date: [''],

        bride_first_name: [''],
        bride_last_name: [''],
        bride_phone: ['', [phoneValidation()]],
        bride_phone_text: new FormControl(''),
        bride_email: new FormControl('', Validators.email),
        bride_social: new FormControl(''),

        bride_mom_first_name: [''],
        bride_mom_last_name: [''],
        bride_mom_phone: ['', [phoneValidation()]],
        bride_mom_email: new FormControl('', Validators.email),

        bride_dad_first_name: [''],
        bride_dad_last_name: [''],
        bride_dad_phone: ['', [phoneValidation()]],
        bride_dad_email: new FormControl('', Validators.email),

        groom_first_name: [''],
        groom_last_name: [''],
        groom_phone: ['', [phoneValidation()]],
        groom_email: new FormControl('', Validators.email),
        groom_phone_text: new FormControl(''),
        groom_social: new FormControl(''),

        groom_mom_first_name: [''],
        groom_mom_last_name: [''],
        groom_mom_phone: ['', [phoneValidation()]],
        groom_mom_email: new FormControl('', Validators.email),

        groom_dad_first_name: [''],
        groom_dad_last_name: [''],
        groom_dad_phone: ['', [phoneValidation()]],
        groom_dad_email: new FormControl('', Validators.email),

        planner_first_name: [''],
        planner_last_name: [''],
        planner_phone: ['', [phoneValidation()]],
        planner_email: new FormControl('', Validators.email),
        other_contact: [''],

        jotform_venue: [''],
        jotform_venue_name: [''],
        jotform_venue_phone: [''],

        venueId: [''],
        other_location: [''],
        webhook_last_error: [''],

        teaser: [''],
        highlights: [''],
        full: [''],
        quote: [''],
        deposit: [''],
        hours: [''],
        count: [''],
        effective_date: [''],
        insurance_contact: [this.insurance_contact],
        include_photographer: [false],
        precontract: [],
        precontract_jotform: [''],
        proposal: [],
        last_submission_id: new FormControl()

      })
    })

    Object.keys(this.form.controls).forEach(key => {
      this._form.controls[key].valueChanges.subscribe(value => {
        this._form.controls[key].setValue(value, { onlySelf: true, emitEvent: false, emitModelToViewChange: true });
      }, error => {}, () => { });
    });
   
  }

  private baseUrl = environment.baseUrl + '/events';
  private venueUrl = environment.baseUrl + '/venues';

  private start: Array<Function> = []
  private stop: Array<Function> = []
  private _refresh: Array<Function> = []

  register(start: Function, stop: Function, refresh: Function)
  {
    this.start.push(start)
    this.stop.push(stop)
    this._refresh.push(refresh)
  }

  load(id: any)
  {
    this._form.reset();
    
    this.eventId = id;
    this.start.forEach(x => x.apply)
    this.get(id).subscribe({

      next: (event: any) => {
        console.log(event)
        console.log(this._form)
        
        this._form.get('data').patchValue(event.data);
        this.stop.forEach(x => x())
        this._refresh.forEach(x => x())

      }, error: (error) => {
        alert(error.message)
        this.stop.forEach(x => x())
      }
    })
    
  }

  refresh()
  {
    this._refresh.forEach(x => x())
  }

  save(callback: Function)
  {
    console.log("Saving")
    this.start.forEach(x => x())
    this.update(this.eventId, this._form.value).subscribe({
      next: (event) => {
        console.log("done")
        this.stop.forEach(x => x())
        this.form.markAsUntouched()
        callback()
      },
      error: (error) => {
        this.stop.forEach(x => x())
        alert(error.message)
        
      }
    })
  }

  private get(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  private update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  private delete(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
 

