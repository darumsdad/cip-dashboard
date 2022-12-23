import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  loading: boolean = false;
  form: FormGroup;
  
  insurance_contact: any = "cert@dicksteininsurance.com"

  constructor(public route: ActivatedRoute,
    public fb: FormBuilder, public s: EventService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.eventId = this.route.snapshot.params['id'];

    if (!this.eventId)
      alert("No eventId passed in - error")

    this.form = this.fb.group({
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
        insurance_contact: [''],
        include_photographer: [false],
        precontract: [],
        precontract_jotform: [''],
        proposal: [],
        last_submission_id: new FormControl()

      })
    })

   this.load();

  }

  load()
  {
    this.loading = true;

    this.s.get(this.eventId).subscribe({

      next: (e: any) => {
        console.log(e)
        this.form.get('data')?.patchValue(e.data);
        this.form.get('data').get('insurance_contact').patchValue(this.insurance_contact)
        this.loading = false;

      }, error: (error) => {
        alert(error.message)
        this.loading = false;
      }
    })

  }

  onWeddingSave() {

    console.log("calling onsave")
    this.loading = true;
    this.s.update(this.eventId, this.form.value).subscribe({
      next: (result) => {
        this.loading = false;
        this.form.markAsUntouched()
        this.router.navigate(['wedding', this.eventId])
      },
      error: (error) => {
        this.loading = false;
        alert(error.message)
      }
    })
  }
}
