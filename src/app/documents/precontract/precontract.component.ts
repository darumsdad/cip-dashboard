import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailService } from 'src/app/services/email.service';
import { EventService } from 'src/app/services/event.service';
import { FileGenerateService } from 'src/app/services/file-generate.service';
import { VenueService } from 'src/app/services/venue.service';

@Component({
  selector: 'app-precontract',
  templateUrl: './precontract.component.html',
  styleUrls: ['./precontract.component.scss']
})
export class PrecontractComponent implements OnInit {

  contacts: FormControl<any>;
  subject: FormControl;
  contactList: any = [];
  form: FormGroup;
  contact_types: any = ['bride', 'bride_mom', 'bride_dad', 'groom', 'groom_mom', 'groom_dad', 'planner'];
  precontract: any;
  venue: any;
  to: FormControl;
  link: any;
  preview: any;
  loading: any = false;
  editor: FormControl;
  bride_first: any;
  groom_first: any;

  @Input()
  eventId: any

  raw_html: string;
  date_str: any;

  constructor(
    private rootFormGroup: FormGroupDirective,
    public venueService: VenueService,
    public generatorService: FileGenerateService,
    private sanitizer: DomSanitizer,
    private eventService: EventService,
    private emailService: EmailService
  ) { }

  ngOnInit(): void {

    this.subject = new FormControl("Pre Contract survey from Creative Image Productions");
    
    this.contacts = new FormControl();
    this.editor = new FormControl;
    this.to = new FormControl;
    
     
    this.form = this.rootFormGroup.control.get('data') as FormGroup;

    this.precontract = this.form.get('precontract')
     
    this.bride_first = this.form.get('bride_first_name')
    this.groom_first = this.form.get('groom_first_name')

    this.precontract?.value?.emails?.forEach(
      email => email.status.sort((a, b) => (a.ts_epoch > b.ts_epoch) ? 1 : -1)
    )

    let venueId = this.form.get('venueId').value

    if (venueId) {
      this.venueService.get(venueId).subscribe({
        next: (venue) => {
          this.venue = venue
        },
        error: (error) => {
          alert(error.message)
        }

      })
    }

    this.contacts.valueChanges.subscribe(
      {
        next: (values) => {
          this.to.patchValue(values?.map(x => x.email).join(","))
        }
      }

    )

    this.contact_types.forEach(e => {
      let email_tag = e + '_email'
      let first_name_tag = e + '_first_name'
      let last_name_tag = e + '_last_name'

      if (this.form.get(email_tag).value && this.form.get(first_name_tag).value && this.form.get(last_name_tag).value) {
        this.contactList.push({
          type: e,
          name: this.form.get(first_name_tag).value + ' ' + this.form.get(last_name_tag).value,
          email: this.form.get(email_tag).value
        })
      }
    })

   
  }

  onCreate() {

    this.loading = true;
    
    let payload = {
      contacts: this.contacts.value,
      eventId: this.eventId,
      venue: this.venue,
      bride: this.bride_first.value,
      groom: this.groom_first.value,
      type: 'precontract'
    }

    this.generatorService.post(payload).subscribe(
      {
        next: (result) => {
          
          this.raw_html = atob(result.html)

          this.editor.patchValue(this.raw_html);
          this.loading = false;
        },
        error: (error) => {
          alert(error.message)
          this.loading = false;
        }
      }
    )

  }

  onCreatePreview() {
    this.preview = this.sanitizer.bypassSecurityTrustHtml(this.editor.value)
  }

  onSend(stepper: MatStepper) {

    this.loading = true;

    let payload = {
      to: this.to.value,
      subject: this.subject.value,
      encoded_html: btoa(this.editor.value),
      key: 'precontract:' + this.eventId
    }

    this.emailService.post(payload).subscribe(
      {
        next: (email) => {
          let precontract = this.precontract?.value;
          if (!precontract) {
            precontract = {
              emails: []
            }
          }

          if (!precontract.emails) {
            precontract.emails = [];
          }
          precontract.emails.push(email);

          this.eventService.save(this.eventId, {
            type: 'precontract',
            data: precontract
          }).subscribe(
            {

              next: (precontract) => {
                console.log(precontract)
                console.log(this.precontract)
                this.precontract.patchValue(precontract);
                this.contacts.reset();
                stepper.reset()
                this.loading = false;
              },

              error: (error) => {
                alert(error.mesage)
                this.loading = false;
              }
            }
          )
        },

        error: (error) => {
          alert(error.message)
          this.loading = false;
        }
      }
    )
  }


  formatTo(to: any) {
    return to.map(x => x.email).join(',')
  }

  getStatus(email: any) {
    let status = email.status
    if (status) {
      let last = status[status.length - 1]
      return last.event;
    }
    return "";
  }

  getHtml(email: any) {
    return this.sanitizer.bypassSecurityTrustHtml(atob(email.encoded_html))
  }

  overallStatus()
  {
      let emails = this.precontract?.value?.emails 
      if (!emails)
      {
        return 'email not yet sent'
      }
      else{
        let last = emails[emails.length - 1]
        let status = last.status;
        let last_status = status[status.length - 1].event
        return 'email sent: status ' + last_status 
      }
  }
  
  
 
 

}
