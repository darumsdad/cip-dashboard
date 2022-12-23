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
  contactList: any = [];
  form: FormGroup;
  contact_types: any = ['bride', 'bride_mom', 'bride_dad', 'groom', 'groom_mom', 'groom_dad', 'planner'];
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

  constructor(
   
    public venueService: VenueService,
    public generatorService: FileGenerateService,
    private sanitizer: DomSanitizer,
    private eventService: EventService,
    private eventDetailService: EventDetailService,
    private emailService: EmailService
  ) { }

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
          let proposal = this.proposal.value;
          if (!proposal) {
            proposal = {
              emails: []
            }
          }

          if (!proposal.emails) {
            proposal.emails = [];
          }
          proposal.emails.push(email);

          this.eventService.save(this.eventId, {
            type: 'proposal',
            data: proposal
          }).subscribe(
            {

              next: (proposal) => {
                this.proposal.patchValue(proposal);
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

  onCreate() {

    this.loading = true;

    let payload = {
      bride: this.form.get('bride_first').value,
      groom: this.form.get('groom_first').value,
      quote: this.form.get('quote').value,
      hours: this.form.get('hours').value,
      staff: this.form.get('count').value,
      date: this.form.get('date').value,
      venue: this.venue,
      highlights: this.form.get('highlights').value,
      teaser: this.form.get('teaser').value,
      full: this.form.get('full').value,
      contacts: this.contacts.value,
      include_photographer: this.form.get('nclude_photographer').value,
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

  canCreate(): boolean {

 console.log(this.form)
    let ret =
      

         !this.form.get('bride_first')
      || !this.form.get('groom_first')
      || !this.form.get('quote') 
      || !this.form.get('hours')
      || !this.form.get('count')
      || !this.form.get('date')
      || !this.venue 

      && (this.form.get('highlights').value || this.form.get('teaser').value || this.form.get('full').value)

    return ret;

  }

  onCreatePreview() {
    this.preview = this.sanitizer.bypassSecurityTrustHtml(this.editor.value)
  }

  ngOnInit(): void {


    this.subject = new FormControl("Proposal from Creative Image Productions");
    this.contacts = new FormControl();
    this.editor = new FormControl;
    this.to = new FormControl;

    this.form = this.eventDetailService.form.get('data') as FormGroup;

    this.proposal = this.form.get('proposal')


    this.proposal.value?.emails?.forEach(
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

    this.contacts.valueChanges.subscribe(
      {
        next: (values) => {
          this.to.patchValue(values?.map(x => x.email).join(","))
        }
      }

    )

    console.log("form loaded")
    console.log(this.form)

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