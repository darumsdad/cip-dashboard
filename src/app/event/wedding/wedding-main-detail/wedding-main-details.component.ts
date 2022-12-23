import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
 

import {Clipboard} from '@angular/cdk/clipboard';
import { EventService } from 'src/app/services/event.service';
import { EventDetailService } from 'src/app/services/event-detail.service';


@Component({
  selector: 'app-event-details',
  templateUrl: './wedding-main-details.component.html',
  styleUrls: ['./wedding-main-details.component.scss']
})
export class WeddingMainDetailsComponent implements OnInit {
  
  e: any;

  @Input()
  eventId: any
 
  constructor(
    public fb: FormBuilder, 
    public s: EventService,
    public eventDetailService: EventDetailService,
    private route: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard,
    private rootFormGroup: FormGroupDirective,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
    ) { }

  
  form: FormGroup;

  ngOnInit(): void {

    this.eventDetailService.register(
      this.start.bind(this),
      this.stop.bind(this),
      this.load.bind(this))  
    
    this.form = this.eventDetailService.form.get('data')



    console.log(this.form)
  }

  loading: boolean = false;
  start()
  {
    console.log("starting")
    this.loading = true
  }
  stop()
  {
    console.log("stoping")
    this.loading = false
  }
  load()
  {
    console.log(this.form)
    console.log("refresh called")
    this.zone.run(() => {
            console.log('enabled time travel');
    });
    this.cdr.detectChanges();
  }
 
  onFocusOutEvent(event: any){
  
     
    let input  = event.target.value
  

    if (input.length === 10)
    {
        if (!isNaN(input) )
        {
          this.form.get(event.target.name).patchValue(
             "(" + input.substr(0,3) + ") " + input.substr(3,3) + "-" + input.substr(6) )
        }  
    }
 }

 foo()
 {
  this.eventDetailService.refresh()

 }

 
 
  onChangeStatus(event: any) {
    console.log(event);
    this.form.get('data').get('status_update_date').patchValue(new Date().toISOString())
  }

  onVenueSelected(event: any) {
    console.log(event);
    this.form.get('data').get('venueId').patchValue(event);
    this.form.markAsTouched();
  }

}
