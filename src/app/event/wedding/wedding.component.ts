import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { EventService } from 'src/app/services/event.service';
import { phoneValidation } from '../utils';

@Component({
  selector: 'app-event',
  templateUrl: './wedding.component.html',
  styleUrls: ['./wedding.component.scss']
})
export class WeddingComponent implements OnInit {

  eventId: any;
  venueId: any;
  
  form: FormGroup;
  
  insurance_contact: any = "cert@dicksteininsurance.com"

  constructor(public route: ActivatedRoute,
    private eds: EventDetailService,
    private cdr: ChangeDetectorRef
  ) { }

  loading: boolean = false;

  ngOnInit(): void {

    this.eventId = this.route.snapshot.params['id'];
    if (!this.eventId)
      alert("No eventId passed in - error")

    this.eds.register(
      (() => { this.loading = true }).bind(this),
      (() => { this.loading = false }).bind(this))
    
    this.form = this.eds.form;
    this.eds.load(this.eventId);
  }

  save() {
    this.eds.save( (e) => {})
  }
}
