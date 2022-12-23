import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatStepper, MatStepperIntl } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailService } from 'src/app/services/email.service';
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
  bride_first: any;
  groom_first: any;
  to: FormControl;
  date: any;
  venue: any;
  quote: any;
  hours: any;
  count: any;
  include_photographer: any;
  highlights: any;
  teaser: any;
  full: any;
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
    private rootFormGroup: FormGroupDirective,
    public venueService: VenueService,
    public generatorService: FileGenerateService,
    private sanitizer: DomSanitizer,
    private eventService: EventService,
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
      bride: this.bride_first.value,
      groom: this.groom_first.value,
      quote: this.quote.value,
      hours: this.hours.value,
      staff: this.count.value,
      date: this.date.value,
      venue: this.venue,
      highlights: this.highlights.value,
      teaser: this.teaser.value,
      full: this.full.value,
      contacts: this.contacts.value,
      include_photographer: this.include_photographer.value,
      eventId: this.eventId,
      type: 'proposal'
    }

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
    )

  }

  canCreate(): boolean {


    let ret =
      //   

      this.bride_first.value === ""
      || this.groom_first.value === ""
      || this.quote.value === ""
      || this.hours.value === ""
      || this.count.value === ""
      || this.date.value === ""
      || !this.venue

      && (this.highlights.value || this.teaser.value || this.full.value)

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

    this.form = this.rootFormGroup.control.get('data') as FormGroup;

    this.proposal = this.form.get('proposal')


    this.proposal.value?.emails?.forEach(
      email => email.status.sort((a, b) => (a.ts_epoch > b.ts_epoch) ? 1 : -1)
    )


    this.bride_first = this.form.get('bride_first_name')
    this.groom_first = this.form.get('groom_first_name')
    this.quote = this.form.get('quote')
    this.hours = this.form.get('hours')
    this.count = this.form.get('count')

    this.date = this.form.get('date')
    this.include_photographer = this.form.get('include_photographer')

    this.highlights = this.form.get('highlights')
    this.teaser = this.form.get('teaser')
    this.full = this.form.get('full')




    if (this.date.value instanceof Date) {
      this.date_str = this.date.value.toISOString().split('T')[0]
    } else if (this.date.value) {
      this.date_str = this.date.value.split('T')[0]
    } else {

      this.date_str = "";

    }


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