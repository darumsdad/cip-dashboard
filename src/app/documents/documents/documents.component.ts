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
  }

    

}
