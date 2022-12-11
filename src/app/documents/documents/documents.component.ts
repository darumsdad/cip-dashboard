import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EmailService } from 'src/app/services/email.service';
import { EventService } from 'src/app/services/event.service';
import { VenueService } from 'src/app/services/venue.service';
import { CertEmailComponent } from '../cert-email/cert-email.component';
import { EmailSendComponent } from '../email-send/email-send.component';



@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
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

  constructor(public dialog: MatDialog,
    private rootFormGroup: FormGroupDirective,
    private emailService: EmailService,
    private eventService: EventService,
    private venueservice: VenueService) { }

  displayedColumns: string[] = ['type', 'link', 'to', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();

  ngOnInit(): void {

    this.form = this.rootFormGroup.control.get('data') as FormGroup;

   

  

    this.contact_types.forEach(e => {
      let email_tag = e + '_email'
      let name_tag = e + '_name'

      if (this.form.get(email_tag).value && this.form.get(name_tag).value) {
        this.contactList.push({
          type: e,
          name: this.form.get(name_tag).value,
          email: this.form.get(email_tag).value
        })
      }
    })
    console.log(this.emails)

    this.load();

  }

  private load() {

    this.loading = true
    this.eventService.get(this.eventId).subscribe({
      next: (e) => {
        console.log(e.data.emails);
        this.dataSource.data = e.data.emails;

        let venueId = this.form.get('venueId').value;
        this.venueservice.get(venueId).subscribe(
          {
            next: (venue) => {
              this.venue = venue;
              this.loading = false
            },
            error: (e) => {
              alert(e.message)
              this.loading = false
            }
          }
        )
        
      },
      error: (e) => {
        this.loading = false
      }
    });
  }

  send(event: any) {
    this.sending = event.inputFile.fileUrl;
    this.emailService.post(this.eventId,
      event
    ).subscribe(
      {
        next: (result) => {
          this.load()
          this.sending = undefined;
        },
        error: (e) => {
          alert(e.message)
          this.sending = undefined;
        }


      }

    )
  }

  openJotForm(event: any): void {
    const dialogRef = this.dialog.open(EmailSendComponent, {
      width: '650px',
      data: {
        contactList: this.contactList,
        eventId: this.eventId,
        type: "pre_contract"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if (result)
      {
        this.dataSource.data.push(result)
        this.dataSource.data = this.dataSource.data.slice();
      }
      
    });
  }

  openContract(event: any): void {
    const dialogRef = this.dialog.open(EmailSendComponent, {
      width: '650px',
      data: {
        contactList: this.contactList,
        eventId: this.eventId,
        type: "contract"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if (result)
      {
        this.dataSource.data.push(result)
        this.dataSource.data = this.dataSource.data.slice();
      }
      
    });
  }

  openCert(event: any): void {
    
    let venue_detials =  this.venue.name 
    + ' ' + this.venue.address
    + ' ' + this.venue.city
    + ' ' + this.venue.state
    + ' ' + this.venue.zip

    const dialogRef = this.dialog.open(CertEmailComponent, {
      width: '700px',
      data: {
        contactList: this.contactList,
        eventId: this.eventId,
        type: "cert",
        defaults: {
          insurance_contact: this.form.get('insurance_contact').value,
          venue_details: venue_detials,
          date: this.form.get('date').value
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.dataSource.data.push(result)
        this.dataSource.data = this.dataSource.data.slice();
      }

    });
  }

  openProposal(event: any): void {
    const dialogRef = this.dialog.open(EmailSendComponent, {
      width: '650px',
      data: {
        contactList: this.contactList,
        eventId: this.eventId,
        type: "proposal"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if (result)
      {
        this.dataSource.data.push(result)
        this.dataSource.data = this.dataSource.data.slice();
      }
      
    });
  }

}
