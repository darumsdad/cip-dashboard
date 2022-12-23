import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import { EmailService } from 'src/app/services/email.service';
import { EventService } from 'src/app/services/event.service';
import { VenueService } from 'src/app/services/venue.service';
import { CertEmailComponent } from '../cert-email/cert-email.component';
import { EmailSendComponent } from '../email-send/email-send.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  viewProviders: [MatExpansionPanel]
})
export class DocumentsComponent implements OnInit {

  form: FormGroup;
  contact_types: any = ['bride', 'bride_mom', 'bride_dad', 'groom', 'groom_mom', 'groom_dad', 'planner'];
  contactList: any = [];

  @Input()
  eventId: any

  @Input()
  emails: any

  sending: any = undefined;

  loading: any = false;
  venue: any;

  @Input()
  save_callback: Function;

  @Input()
  reload_callback: Function;

  constructor(public dialog: MatDialog,
    private rootFormGroup: FormGroupDirective,
    private emailService: EmailService,
    private eventService: EventService,
    private venueservice: VenueService) { }

  displayedColumns: string[] = ['type', 'to', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();

  ngOnInit(): void {

    
    this.form = this.rootFormGroup.control.get('data') as FormGroup;

    // this.contact_types.forEach(e => {
    //   let email_tag = e + '_email'
    //   let first_name_tag = e + '_first_name'
    //   let last_name_tag = e + '_last_name'

    //   if (this.form.get(email_tag).value && this.form.get(first_name_tag).value && this.form.get(last_name_tag).value) {
    //     this.contactList.push({
    //       type: e,
    //       name: this.form.get(first_name_tag).value + ' ' + this.form.get(last_name_tag).value,
    //       email: this.form.get(email_tag).value
    //     })
    //   }
    // })
    // console.log(this.emails)

    // this.load(this.form);

  }

  // can_send_proposal() {
  //   return this.form.get('venueId').value &&
  //     this.form.get('bride_first_name').value &&
  //     this.form.get('bride_last_name').value &&
  //     this.form.get('quote').value &&
  //     this.form.get('hours').value &&
  //     this.form.get('count').value &&
  //     this.form.get('date').value &&
  //     (this.form.get('teaser').value || this.form.get('highlights').value || this.form.get('full').value) &&
  //     this.form.get('groom_first_name').value
  //   this.form.get('groom_last_name').value
  // }

  // can_send_contract() {
  //   return this.form.get('venueId').value &&
  //     this.form.get('bride_name').value &&
  //     this.form.get('quote').value &&
  //     this.form.get('hours').value &&
  //     this.form.get('count').value &&
  //     this.form.get('date').value &&
  //     (this.form.get('teaser').value || this.form.get('highlights').value || this.form.get('full').value) &&
  //     this.form.get('groom_name').value
  // }

  // can_send_cert() {
  //   return this.form.get('venueId').value &&
  //     this.form.get('date').value
  // }

  private load(form: any) {


    // console.log("Reloading ")
    
    // let documents = []
    // let pre_proposal = form.get('pre_proposal').value;
    // console.log(pre_proposal)
    // if (pre_proposal) {
    //   documents.push({
    //     encoded_html: pre_proposal.encoded_html,
    //     subject: pre_proposal.subject,
    //     type: 'Pre Proposal',
    //     inputFile: {
    //       fileUrl: ''
    //     },
    //     contact: pre_proposal.contact,
    //     updates: pre_proposal.updates,
    //     sending: false
    //   })
    // }

    // console.log(documents)

    // this.dataSource.data = documents

    // this.loading = true
    // this.eventService.get(this.eventId).subscribe({
    //   next: (e) => {
    //     console.log(e.data.emails);
    //     this.dataSource.data = e.data.emails;

    //     let venueId = this.form.get('venueId').value;
    //     this.venueservice.get(venueId).subscribe(
    //       {
    //         next: (venue) => {
    //           this.venue = venue;
    //           this.loading = false
    //         },
    //         error: (e) => {
    //           alert(e.message)
    //           this.loading = false
    //         }
    //       }
    //     )

    //   },
    //   error: (e) => {
    //     this.loading = false
    //   }
    // });
  }


  // String encoded_html = (String) payload.get("encoded_html");
  // String from = "cip.emgutierrez@gmail.com";
  // Map contact = (Map) payload.get("contact");
  // String to = (String) contact.get("email");
  // String subject = (String) payload.get("subject");
  // String key = (String) payload.get("key");
  // String eventId = (String) payload.get("eventId");
  
  send(event: any) {

    // event.sending = true;
    
    // let payload = {
    //     encoded_html: event.encoded_html,
    //     contact: event.contact,
    //     subject: event.subject,
    //     key: this.eventId + ':' + event.type,
    //     eventId: this.eventId
    // }

    // this.emailService.post(payload).subscribe(
    //   {
    //     next: (result) => {
    //       event.sending = false;
    //     },
    //     error: (e) => {
    //       alert(e.message)
    //       event.sending = false;
    //     }
    //   }
    // )
  }

  edit(document: any) {
    // if (document.type === 'Pre Proposal')
    //   this.preProposal({
    //     contactList: this.contactList,
    //     eventId: this.eventId,
    //     type: "pre_proposal",
    //     form: this.form,
    //     save_callback: this.save_callback
    //   });

  }

  preProposal(data: any): void {

   
  }

  openPreProposal(event: any): void {

    // this.preProposal({
    //   contactList: this.contactList,
    //   eventId: this.eventId,
    //   type: "pre_proposal",
    //   form: this.form,
    //   save_callback: this.save_callback
    // });


  }

  onSave() {
    // this.save_callback()
  }

  openContract(event: any): void {
    // const dialogRef = this.dialog.open(EmailSendComponent, {
    //   width: '650px',
    //   data: {
    //     contactList: this.contactList,
    //     eventId: this.eventId,
    //     type: "contract"
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);

    //   if (result) {
    //     this.dataSource.data.push(result)
    //     this.dataSource.data = this.dataSource.data.slice();
    //   }

    // });
  }

  openCert(event: any): void {

    // let venue_detials = this.venue.name
    //   + ' ' + this.venue.address
    //   + ' ' + this.venue.city
    //   + ' ' + this.venue.state
    //   + ' ' + this.venue.zip

    // const dialogRef = this.dialog.open(CertEmailComponent, {
    //   width: '700px',
    //   data: {
    //     contactList: this.contactList,
    //     eventId: this.eventId,
    //     type: "cert",
    //     defaults: {
    //       insurance_contact: this.form.get('insurance_contact').value,
    //       venue_details: venue_detials,
    //       date: this.form.get('date').value
    //     }
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     console.log(result);
    //     this.dataSource.data.push(result)
    //     this.dataSource.data = this.dataSource.data.slice();
    //   }

    // });
  }

  openProposal(event: any): void {
    // const dialogRef = this.dialog.open(EmailSendComponent, {
    //   width: '650px',
    //   data: {
    //     contactList: this.contactList,
    //     eventId: this.eventId,
    //     type: "proposal"
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);

    //   if (result) {
    //     this.dataSource.data.push(result)
    //     this.dataSource.data = this.dataSource.data.slice();
    //   }

    // });
  }

}
