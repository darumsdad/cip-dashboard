import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailService } from 'src/app/services/email.service';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { EventService } from 'src/app/services/event.service';
import { FileGenerateService } from 'src/app/services/file-generate.service';

@Component({
  selector: 'app-prewedding',
  templateUrl: './prewedding.component.html',
  styleUrls: ['./prewedding.component.scss']
})
export class PreweddingComponent implements OnInit {

  contacts: FormControl<any>;
  subject: FormControl;
  contactList: any = [];
  form: FormGroup;
  prewedding: any;

  to: FormControl;

  preview: any;
  loading: any = false;
  editor: FormControl;
  

  raw_html: string;


  constructor(
    public generatorService: FileGenerateService,
    private sanitizer: DomSanitizer,
    private eventService: EventService,
    private eventDetailService: EventDetailService,
    private emailService: EmailService
  ) { }

  @ViewChild('first') first: MatExpansionPanel;

  ngOnInit(): void {

    this.subject = new FormControl("Pre Contract survey from Creative Image Productions");
    
    this.contacts = new FormControl();
    this.editor = new FormControl;
    this.to = new FormControl;

    this.form = this.eventDetailService.form.get('data') as FormGroup;

    this.prewedding = this.form.value.prewedding ? this.form.value.prewedding : { emails: [] }
    
    this.prewedding.emails?.forEach(
      email => email.status.sort((a, b) => (a.ts_epoch > b.ts_epoch) ? 1 : -1)
    )

    this.contacts.valueChanges.subscribe(
      {
        next: (values) => {
          this.to.patchValue(values?.map(x => x.email).join(","))
        }
      }
    )

     this.contactList = this.eventDetailService.contactList
  }

  onCreate() {

    this.loading = true;
    
    let payload = {
      contacts: this.contacts.value,
      eventId: this.eventDetailService.eventId,
      venue: this.eventDetailService.venue,
      bride: this.form.value.bride_first_name,
      groom: this.form.value.groom_first_name,
      type: 'prewedding'
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
      key: 'prewedding:' + this.eventDetailService.eventId
    }

    this.emailService.post(payload).subscribe(
      {
        next: (email) => {

          console.log("sending")
          
          this.prewedding.emails.push(email);

          this.eventService.save(this.eventDetailService.eventId, {
            type: 'prewedding',
            data: this.prewedding
          }).subscribe(
            {

              next: (prewedding) => {
                
                this.prewedding = prewedding;
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
         this.form.value.bride_first_name  &&
         this.form.value.groom_first_name 
    return !ret;
  }

  getHtml(email: any) {
    return this.sanitizer.bypassSecurityTrustHtml(atob(email.encoded_html))
  }


  

}
