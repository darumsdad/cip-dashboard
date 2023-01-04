import { Component, Input, OnInit, ViewChild, ɵpublishDefaultGlobalUtils } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { EmailService } from 'src/app/services/email.service';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { EventService } from 'src/app/services/event.service';
import { FileGenerateService } from 'src/app/services/file-generate.service';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
 

  subject: FormControl<string>;
  contacts: FormControl<any>;
  editor: FormControl<any>;
  email_editor: FormControl<any>;
  to: FormControl<any>;
  form: FormGroup<any>;
  governing_state: FormControl<any>;

  contract: any;
  client: FormControl;
  contactList: any;
  loading: boolean;
  raw_html: string;
  
  preview: any;
  email_preview: any;

  eventId: any;
  venue: any;

  @ViewChild('first') first: MatExpansionPanel;

  constructor(
    public generatorService: FileGenerateService,
    private sanitizer: DomSanitizer,
    private eventService: EventService,
    private fileService: FileService,
    private eventDetailService: EventDetailService,
    private emailService: EmailService
  ) { }

  ngOnInit(): void {

    this.form = this.eventDetailService.form.get('data') as FormGroup;
    this.eventId = this.eventDetailService.eventId
    this.subject = new FormControl("Wedding Contract from Creative Image Productions");
    
    this.contacts = new FormControl();
    this.editor = new FormControl;
    this.email_editor = new FormControl;
    this.to = new FormControl;
    this.client = new FormControl;

    
    this.venue = this.eventDetailService.venue
    let state;
    if (this.venue?.state == 'NY') 
      state = "New York"
    if (this.venue?.state == 'NJ') 
      state = "New Jersey"
    if (this.venue?.state == 'CT') 
      state = "Connecticut"
      


    this.governing_state = new FormControl(state)
    

    this.contract = this.form.value.contract ? this.form.value.contract : { emails: [] }
    
    this.contract.emails?.forEach(
      email => email.status.sort((a, b) => (a.ts_epoch > b.ts_epoch) ? 1 : -1)
    )

    this.client.valueChanges.subscribe(
      {
        next: (value) => {

          let values = [];
          values.push(value)
          this.contacts.patchValue(values);
        }
      }
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
      
      eventId: this.eventId,
      venue: this.eventDetailService.venue.name,
      staff: this.form.value.count,
      venueState: this.eventDetailService.venue.state,
      venueCity: this.eventDetailService.venue.city,
      effective_date: new Date(this.form.value.effective_date).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: '2-digit'}), 
      client: this.client.value.name,
      date: new Date(this.form.value.date).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: '2-digit'}), 
      hours: this.form.value.hours,
      quote: this.form.value.quote,
      deposit: this.form.value.deposit,
      state: this.governing_state.value,
      type: 'contract'
    }

    let f = () => {
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

    this.eventDetailService.save(f.bind(this));

  }

  onCreateEmail() {

    this.loading = true;
    const client_first_name = this.client.value.name.split(' ')[0];
    
    let payload = {
      client: client_first_name,
      type: 'contract_email'
    }

    let f = () => {
      this.generatorService.post(payload).subscribe(
      {
        next: (result) => {
          this.raw_html = atob(result.html)
          this.email_editor.patchValue(this.raw_html);
          this.loading = false;
        },
        error: (error) => {
          alert(error.message)
          this.loading = false;
        }
      }
     )
    }

    this.eventDetailService.save(f.bind(this));

  }

  disableCreate(): boolean {

    let ret =
         this.form.value.effective_date  &&
         this.client.value &&
         this.form.value.date &&
         this.form.value.hours &&
         this.form.value.quote &&
         this.form.value.deposit &&
         this.governing_state.value &&
         this.venue 
    return !ret;
  }

  onCreatePreview() {
    this.preview = this.sanitizer.bypassSecurityTrustHtml(this.editor.value)
  }

  onEmailCreatePreview() {
    this.email_preview = this.sanitizer.bypassSecurityTrustHtml(this.email_editor.value)
  }

  onSend(stepper: MatStepper) {

    this.loading = true;

    let payload = {
      to: this.to.value,
      subject: this.subject.value,
      encoded_html: btoa(this.editor.value),
      encoded_body_html: btoa(this.email_editor.value),
      key: 'contract:' + this.eventId
    }

    this.emailService.post(payload).subscribe(
      {
        next: (email) => {
          
          this.contract.emails.push(email);
          let encoded_pdf = email.encoded_pdf

          this.eventService.save(this.eventId, {
            type: 'contract',
            data: this.contract
          }).subscribe(
            {

              next: (contract) => {

                let filePayload = {
                  encoded_data: encoded_pdf,
                  fileName: "original_contract.pdf"
                }

                this.fileService.post(this.eventId,filePayload).subscribe(
                  {
                    next: (file_detail) => {

                      let file_details = {
                        fileName: file_detail.fileName,
                        fileUrl: file_detail.fileUrl,
                        type: 'Unexecuted Contract',
                        description: 'Unexecuted Contract created: ' + new Date().toISOString(),
                      }

                      let files = this.form.value.files;
                      if (!files)
                      {
                        files = {
                          files: [file_details]
                        }
                      }
                      else{
                        files.files = files.files.filter(x => x.fileName !== file_details.fileName)
                        files.files.push(file_details)
                      }
          

                      let save_payload = {
                        type: 'files',
                        data:  files
                      }

                      this.eventService.save(this.eventId,save_payload).subscribe(
                        {
                          next: (files) => {
                            this.form.get('files').patchValue(files)
                            
                            this.first.close()
                            this.contract = contract;
                            this.contacts.reset();
                            stepper.reset()
                            this.loading = false;

                          },
          
                          error: (error) => {
                            alert(error.message)
                            this.loading = false;
                          }
                        }
                      )


                    
                    
                    },
                    error: (error) => {
                      alert(error.mesage)
                      this.loading = false;
                    }

                  }
                )
                
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






 
}
