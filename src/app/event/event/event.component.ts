import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
 

export function phoneValidation(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {

      const value = control.value;
      console.log(value)
      if (!value) {
          return null;
      }

      let valid = 
      
      value.length == 14 &&
      value.charAt(0) === '('  &&

      Number.isInteger(parseInt(value.charAt(1))) &&
      Number.isInteger(parseInt(value.charAt(2))) &&
      Number.isInteger(parseInt(value.charAt(3))) &&

      value.charAt(4) === ')'  &&
      value.charAt(5) === ' '  &&

      Number.isInteger(parseInt(value.charAt(6))) &&
      Number.isInteger(parseInt(value.charAt(7))) &&
      Number.isInteger(parseInt(value.charAt(8))) &&

      value.charAt(9) === '-'  &&

      Number.isInteger(parseInt(value.charAt(10))) &&
      Number.isInteger(parseInt(value.charAt(11))) &&
      Number.isInteger(parseInt(value.charAt(12))) &&
      Number.isInteger(parseInt(value.charAt(13))) 

      console.log(valid)
      
      return !valid ? {invalidPhone:true} : null
 
  }
}

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  eventId: any;
  venueId: any;

  form: FormGroup;
  data: FormGroup;

  constructor(public route: ActivatedRoute,
    public fb: FormBuilder, public s: EventService,
    private router: Router
    ) { 

      this.data = this.fb.group({
      
        status: [''],
        event_type: [''],
        description: [''],
        date: [''],
        start: [''],
        end: [''],
        status_update_date: [''],
  
        bride_name: [''],
        bride_phone: ['',[phoneValidation()]]
          ,
       
        bride_phone_text: new FormControl(''),
        bride_email: new FormControl('', Validators.email),
        bride_social: new FormControl(''),
  
        bride_mom_name: [''],
        bride_mom_phone: ['',[phoneValidation()]],
        bride_mom_email: new FormControl('', Validators.email),
  
        bride_dad_name: [''],
        bride_dad_phone: ['',[phoneValidation()]],
        bride_dad_email: new FormControl('', Validators.email),
  
        groom_name: [''],
        groom_phone: ['',[phoneValidation()]],
        groom_email: new FormControl('', Validators.email),
        groom_phone_text: new FormControl(''),
        groom_social: new FormControl(''),
  
        groom_mom_name: [''],
        groom_mom_phone: ['',[phoneValidation()]],
        groom_mom_email: new FormControl('', Validators.email),
  
        groom_dad_name: [''],
        groom_dad_phone: ['',[phoneValidation()]],
        groom_dad_email: new FormControl('', Validators.email),
  
        planner_name: [''],
        planner_phone: ['',[phoneValidation()]],
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

        last_submission_id: new FormControl()
  
      })

      this.form = this.fb.group({
        id: [''],
        data: this.data
      })
  

    }

   

  ngOnInit(): void {

    console.log("init1")

    this.eventId = this.route.snapshot.params['id'];

       

    this.form.markAsPristine()
   
    if (this.eventId)
    {
      this.s.get(this.eventId).subscribe((e: any) => {
        console.log(e)
        this.form.get('data')?.patchValue(e.data);
        this.venueId = e.data.venueId

        console.log(e.data.emails)
        
      })
    }

  
  }

  onSave(event: any) {


    console.log(this.form.invalid)
    console.log(this.form.get('data').get('bride_phone'))

    let phone_invalid = false;

    ['bride_phone','bride_mom_phone','bride_dad_phone','groom_phone','groom_mom_phone','groom_dad_phone','planner_phone'].forEach( x => {
      console.log(x)
      console.log(this.form.get('data').get(x).invalid)
      phone_invalid ||= this.form.get('data').get(x).invalid
      console.log(phone_invalid)
    })

    if (this.form.invalid || phone_invalid)
    {
      console.log("no save")
      console.log("no save")
      return;
    }
      
    
    console.log(this.form.value)

    
    // if (this.form.get('data').get('bride_phone').value) 
    //   this.form.get('data').get('bride_phone').patchValue((this.form.get('data').get('bride_phone').value).number)
    // if (this.form.get('data').get('bride_mom_phone').value) this.form.get('data').get('bride_mom_phone').patchValue((this.form.get('data').get('bride_mom_phone').value).number)
    // if (this.form.get('data').get('bride_dad_phone').value) this.form.get('data').get('bride_dad_phone').patchValue((this.form.get('data').get('bride_dad_phone').value).number)

    // if (this.form.get('data').get('groom_phone').value) this.form.get('data').get('groom_phone').patchValue((this.form.get('data').get('groom_phone').value).number)
    // if (this.form.get('data').get('groom_mom_phone').value) this.form.get('data').get('groom_mom_phone').patchValue((this.form.get('data').get('groom_mom_phone').value).number)
    // if (this.form.get('data').get('groom_dad_phone').value) this.form.get('data').get('groom_dad_phone').patchValue((this.form.get('data').get('groom_dad_phone').value).number)

    // if (this.form.get('data').get('planner_phone').value) this.form.get('data').get('planner_phone').patchValue((this.form.get('data').get('planner_phone').value).number)

    console.log(this.form.value)

    if (this.eventId)
    {
      this.s.update(this.eventId,this.form.value).subscribe(result => {
        this.form.markAsUntouched()
        this.router.navigate(['detail',this.eventId])
      })
    }
    else
    {
      this.s.create(this.form.value).subscribe(result => {
        console.log(result)
        this.form.markAsUntouched()
        this.eventId = result.id
        this.router.navigate(['detail', this.eventId])
      })
    }
  }

}
