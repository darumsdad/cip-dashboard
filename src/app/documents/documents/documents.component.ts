import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import { EmailService } from 'src/app/services/email.service';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { EventService } from 'src/app/services/event.service';
import { VenueService } from 'src/app/services/venue.service';
import { CertEmailComponent } from '../cert-email/cert-email.component';
 

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  viewProviders: [MatExpansionPanel]
})
export class DocumentsComponent implements OnInit {

  @Input()
  eventId: any
  precontract_jotform: any;

  constructor(private eds: EventDetailService) { }

  ngOnInit(): void {
    this.precontract_jotform = this.eds.form.value.data.precontract_jotform
    console.log(this.precontract_jotform)
  }

    

}
