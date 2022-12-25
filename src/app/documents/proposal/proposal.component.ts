import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatStepper, MatStepperIntl } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailService } from 'src/app/services/email.service';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { EventService } from 'src/app/services/event.service';
import { FileGenerateService } from 'src/app/services/file-generate.service';
import { VenueService } from 'src/app/services/venue.service';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']

})
export class ProposalComponent implements OnInit {

  contacts: FormControl<any>;
  subject: FormControl;
  
  form: FormGroup;
  proposal: any;
   
  to: FormControl;
   
  venue: any;
   
   
  link: any;
  preview: any;
  loading: any = false;
  editor: FormControl;

  @Input()
  eventId: any
  trustedHtml: any;
  raw_html: string;
  date_str: any;
  contactList: any = [];

  constructor(
   
    public venueService: VenueService,
    public generatorService: FileGenerateService,
    private sanitizer: DomSanitizer,
    private eventService: EventService,
    private eventDetailService: EventDetailService,
    private emailService: EmailService
  ) { }


  ngOnInit(): void {

    this.subject = new FormControl("Proposal from Creative Image Productions");
    this.contacts = new FormControl();
    this.editor = new FormControl;
    this.to = new FormControl;

    this.form = this.eventDetailService.form.get('data') as FormGroup;
    this.venue = this.eventDetailService.venue

    this.proposal = (this.form.value.proposal) ? this.form.value.proposal : { emails: [] }

    this.proposal?.emails?.forEach(
      email => email.status.sort((a, b) => (a.ts_epoch > b.ts_epoch) ? 1 : -1)
    )

    this.contactList = this.eventDetailService.contactList
    console.log(this.contactList)
    
    this.contacts.valueChanges.subscribe(
      {
        next: (values) => {
          this.to.patchValue(values?.map(x => x.email).join(","))
        }
      }

    )
  }

  onCreate() {

    this.loading = true;

    let payload = {
      bride: this.form.value.bride_first_name,
      groom: this.form.value.groom_first_name,
      quote: this.form.value.quote,
      hours: this.form.value.hours,
      staff: this.form.value.count,
      date: this.form.value.date,
      venue: this.venue,
      highlights: this.form.value.highlights,
      teaser: this.form.value.teaser,
      full: this.form.value.full,
      contacts: this.contacts.value,
      include_photographer: this.form.value.nclude_photographer,
      eventId: this.eventId,
      type: 'proposal'
    }

    let logic : Function = (e) =>  {
      this.generatorService.post(payload).subscribe(
        {
          next: (result) => {
            console.log(result)
            this.raw_html = atob(result.html)
  
            this.editor.patchValue(this.raw_html);
            this.loading = false;
          },
          error: (error) => {
            alert(error.message)
            this.loading = false;
          }
        }
      )}

    this.eventDetailService.save(
       logic.bind(this)
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

  onSend(stepper: MatStepper) {

    this.loading = true;

    let payload = {
      to: this.to.value,
      subject: this.subject.value,
      encoded_html: btoa(this.editor.value),
      key: 'proposal:' + this.eventId
    }

    this.emailService.post(payload).subscribe(
      {
        next: (email) => {
          
          this.proposal.emails.push(email);

          this.eventService.save(this.eventId, {
            type: 'proposal',
            data: this.proposal
          }).subscribe(
            {

              next: (proposal) => {
                this.proposal = proposal;
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

 
  disableCreate(): boolean {
    
    let ret =
         this.form.value.bride_first_name  &&
         this.form.value.groom_first_name &&
         this.form.value.quote &&
         this.form.value.hours &&
         this.form.value.date &&
         this.venue  &&
        (this.form.value.highlights || this.form.value.teaser || this.form.value.full)
    return !ret;
  }

  onCreatePreview() {
    this.preview = this.sanitizer.bypassSecurityTrustHtml(this.editor.value)
  }


  overallStatus()
  {
      let emails = this.proposal?.value?.emails 
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