import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
 

import {Clipboard} from '@angular/cdk/clipboard';
import { EventService } from 'src/app/services/event.service';


@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  
  e: any;

  @Input()
  eventId: any
 
  constructor(
    public fb: FormBuilder, 
    public s: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private clipboard: Clipboard,
    private rootFormGroup: FormGroupDirective
    ) { }

  
  form: FormGroup;

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get('data') as FormGroup;
  }
 
  onFocusOutEvent(event: any){
  
    console.log(event);
    let input  = event.target.value
    console.log(input);

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
