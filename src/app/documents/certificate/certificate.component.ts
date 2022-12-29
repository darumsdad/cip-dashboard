import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';

import { EmailService } from 'src/app/services/email.service';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { EventService } from 'src/app/services/event.service';
import { FileGenerateService } from 'src/app/services/file-generate.service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {

  contacts: FormControl<any>;
  subject: FormControl;
  recipients: FormControl;
  contactList: any = [];
  form: FormGroup;
  certificate: any;

  to: FormControl;
  venue: any;

  preview: any;
  loading: any = false;
  editor: FormControl;
  
  
  raw_html: string;
  client: FormControl<any>;


  constructor(
    public generatorService: FileGenerateService,
    private sanitizer: DomSanitizer,
    private eventService: EventService,
    private eventDetailService: EventDetailService,
    private emailService: EmailService
  ) { }

  @ViewChild('first') first: MatExpansionPanel;

  ngOnInit(): void {

    console.log("her")
    this.subject = new FormControl("COI Request for Creative Image Productions");
    
    this.contacts = new FormControl();
    this.recipients = new FormControl();
    this.editor = new FormControl;
    this.to = new FormControl(this.eventDetailService.coi_agent)
    this.client = new FormControl;

    this.form = this.eventDetailService.form.get('data') as FormGroup;
    this.venue = this.eventDetailService.venue

    this.certificate = this.form.value.certificate ? this.form.value.certificate : { emails: [] }
    
    this.certificate.emails?.forEach(
      email => email.status.sort((a, b) => (a.ts_epoch > b.ts_epoch) ? 1 : -1)
    )

     this.contactList = this.eventDetailService.contactList
  }

  onCreate() {

    this.loading = true;
    
    let payload = {
      client: this.client.value,
      eventId: this.eventDetailService.eventId,
      venue: this.eventDetailService.venue,
      date: this.form.value.date,
      recipients: this.recipients.value,
      type: 'certificate'
    }

    

    let logic : Function = (e) =>  {
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

    this.eventDetailService.save(
       logic.bind(this)
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
      key: 'certificate:' + this.eventDetailService.eventId
    }

    this.emailService.post(payload).subscribe(
      {
        next: (email) => {
          
          this.certificate.emails.push(email);

          this.eventService.save(this.eventDetailService.eventId, {
            type: 'certificate',
            data: this.certificate
          }).subscribe(
            {

              next: (certificate) => {
                
                this.certificate = certificate;
                this.contacts.reset();
                stepper.reset()
                this.first.close()
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

  disableCreate(): boolean {
    
    let ret =
         this.client.value  &&
         this.form.value.date &&
         this.recipients.value &&
         this.venue
         
    return !ret;
  }

  getHtml(email: any) {
    return this.sanitizer.bypassSecurityTrustHtml(atob(email.encoded_html))
  }


}
