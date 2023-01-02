import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';


import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contact } from '../model/models';


@Injectable({
  providedIn: 'root'
})

export class EventDetailService {
 
  
  private _form: any;
  coi_agent: any = "cert@dicksteininsurance.com"
  eventId: any;
  venue: any;
  contact_types: any = ['bride', 'bride_mom', 'bride_dad', 'groom', 'groom_mom', 'groom_dad', 'planner'];
  contactList: any = [];

  get form() {
    return this._form
  }

  constructor(private http: HttpClient,private fb: FormBuilder) { 
    
    this._form = this.fb.group({
      id: [''],
      data: this.fb.group({

        status: [''],
        event_type: [''],
        description: new FormControl(),
        date: [''],
        start: [''],
        end: [''],
        status_update_date: [''],

        bride_first_name: [''],
        bride_last_name: [''],
        bride_phone: [''],
        bride_phone_text: [''],
        bride_email: ['', [Validators.email]],
        bride_social: [''],

        bride_mom_first_name: [''],
        bride_mom_last_name: [''],
        bride_mom_phone: [''],
        bride_mom_email: ['', [Validators.email]],
        

        bride_dad_first_name: [''],
        bride_dad_last_name: [''],
        bride_dad_phone: [''],
        bride_dad_email: ['', [Validators.email]],
        

        groom_first_name: [''],
        groom_last_name: [''],
        groom_phone: [''],
        groom_email: ['', [Validators.email]],
        
        groom_phone_text: [''],
        groom_social: [''],

        groom_mom_first_name: [''],
        groom_mom_last_name: [''],
        groom_mom_phone: [''],
        groom_mom_email: ['', [Validators.email]],

        groom_dad_first_name: [''],
        groom_dad_last_name: [''],
        groom_dad_phone: [''],
        groom_dad_email: ['', [Validators.email]],

        planner_first_name: [''],
        planner_last_name: [''],
        planner_phone: [''],
        planner_email: ['', [Validators.email]],
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
        
        include_photographer: [false],
        precontract: [],
        precontract_jotform: [''],
        prewedding_jotform: [''],
        prewedding: [],
        proposal: [],
        contract: [],
        callsheet: [],
        certificate: [],
        videos: [],
        videographers: [],
        assistants: [],

        
        mailing_address: [],
        mailing_city: [],
        mailing_state: [],
        mailing_zip: [],

        video_start: [],
        bride_prep: [],
        groom_prep: [],
        schedule: [],
        payment: [],
        guests: [],
        song: [],
        photo_name: [],
        photo_phone: [],
        hair: [],
        makeup: [],
        caterer: [],
        band: [],
        florist: [],
        lighting: [],
        referred_by: [],
        other_vendor: [],
        special_option: [],
        special_ceremony: [],
        reception_option: [],
       
        dislike: [],
        aware: [],

        files: []

      })
    })

    Object.keys(this.form.get('data').controls).forEach(key => {
      this._form.get('data').controls[key].valueChanges.subscribe(value => {
        
        if (key.endsWith('_email') || key.endsWith('_name'))
          this.prepareContacts()
        this._form.get('data').controls[key].setValue(value, 
          { onlySelf: true, emitEvent: false, emitModelToViewChange: true }
        );
      }, error => {}, () => { });
    });

    
   
  }

  private baseUrl = environment.baseUrl + '/events';
  private venueUrl = environment.baseUrl + '/venues';

  private start: Array<Function> = []
  private stop: Array<Function> = []
  
  register(start: Function, stop: Function)
  {
    this.start.push(start)
    this.stop.push(stop)
  }

  prepareContacts()
  {
  
    this.contactList = []
    this.contact_types.forEach(e => {

      let data = this._form.get('data')
  
      let email_tag = e + '_email'
      let first_name_tag = e + '_first_name'
      let last_name_tag = e + '_last_name'

      if (data.get(email_tag).value && 
          data.get(first_name_tag).value && 
          data.get(last_name_tag).value) {
        this.contactList.push({
          type: e,
          name: data.get(first_name_tag).value + ' ' + data.get(last_name_tag).value,
          email: data.get(email_tag).value
        })
      }
    })
  }

  load(id: any)
  {
    this._form.reset();

    this.eventId = id;
    this.start.forEach(x => x.apply)
    this.get(id).subscribe({

      next: (event: any) => {
        console.log(event)
        this._form.get('data').patchValue(event.data);

        this.prepareContacts()

        let venueId = event.data.venueId;
        if (venueId)
        {
          this.getVenue(venueId).subscribe(
            {
              next: (venue) => {
                this.venue = venue;
                console.log(venue)
                this.stop.forEach(x => x())
              },
              error: (error) => {
                alert(error.message)
                this.stop.forEach(x => x())
              }
            }
          )
        }
        else
        {
          this.venue = undefined
          this.stop.forEach(x => x())
        }

      }, error: (error) => {
        alert(error.message)
        this.stop.forEach(x => x())
      }
    })

    console.log(this._form.value)
    
  }

  applyVenue(venue: any) {
    this.venue = venue;
    this._form.get('data').get('venueId').patchValue(venue.id)
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

  public planners() : Observable<Contact> {
    return this.http.get<any>(`${this.baseUrl}/planners`);
  }

  private get(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  private getVenue(id: any): Observable<any> {
    return this.http.get<any>(`${this.venueUrl}/${id}`);
  }

  private update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  

}
 

