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
 
 
  constructor(public eventDetailService: EventDetailService) { }

  
  form: FormGroup;

  ngOnInit(): void {
    this.eventDetailService.register(
      (() => { this.loading = true }).bind(this),
      (() => { this.loading = false }).bind(this))
      this.form = this.eventDetailService.form.get('data')
  }

  loading: boolean = false;
  
 
  formatPhone(event: any){
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
