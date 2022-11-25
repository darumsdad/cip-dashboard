import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EmailService } from 'src/app/services/email.service';
import { EventService } from 'src/app/services/event.service';
import { EmailSendComponent } from '../email-send/email-send.component';



@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  form: FormGroup;
  contact_types: any = ['bride','bride_mom','bride_dad','groom','groom_mom','groom_dad','planner'];
  contactList: any = [];

  @Input()
  eventId: any

  @Input()
  emails: any
  sending: any = undefined;

  constructor(public dialog: MatDialog,
    private rootFormGroup: FormGroupDirective,
    private emailService: EmailService,
    private eventService: EventService) { }

  displayedColumns: string[] = ['type', 'link', 'to','status','actions'];
  dataSource = new MatTableDataSource<any>();

  ngOnInit(): void {

    this.form = this.rootFormGroup.control.get('data') as FormGroup;

    this.contact_types.forEach(e => {
      let email_tag = e + '_email'
      let name_tag = e + '_name'

      if (this.form.get(email_tag).value && this.form.get(name_tag).value)
      {
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
    console.log(this.sending)
    this.eventService.get(this.eventId).subscribe({
      next: (e) => {
        console.log(e.data.emails);
        this.dataSource.data = e.data.emails;
      },
      error: (e) => { }
    });
  }

  send(event: any)
  {
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
      
      this.dataSource.data.push(result)
      this.dataSource.data = this.dataSource.data.slice();
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
      this.dataSource.data.push(result)
      this.dataSource.data = this.dataSource.data.slice();
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
      this.dataSource.data.push(result)
      this.dataSource.data = this.dataSource.data.slice();
    });
  }

}
