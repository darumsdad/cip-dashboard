import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileGenerateService } from 'src/app/services/file-generate.service';
import { JotFormLinkService } from 'src/app/services/jot-form-link.service';

@Component({
  selector: 'app-email-send',
  templateUrl: './email-send.component.html',
  styleUrls: ['./email-send.component.scss']
})
export class EmailSendComponent implements OnInit {
  
  ref: any;
  form: FormGroup;
  contactList: any;
  html: any;
  origLink: any;
  type: any;

  constructor(public s: JotFormLinkService,
    
    private e: FileGenerateService,
    public dialog: MatDialogRef<EmailSendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  dataModel: any
  contact: any
  
  eventId: any

  working: boolean = false

  ngOnInit(): void {
    this.dataModel = new FormControl();
    this.contact = new FormControl(Validators.required);
    
    console.log(this.data)
    this.eventId = this.data.eventId;
    this.contactList = this.data.contactList;
    this.type = this.data.type;

   
  }

  onCreate(event: any)
  {
      this.working = true;

      console.log(this.contact.value);
      this.e.post(
        {
        
        contact: this.contact.value,
        type: this.type,
        eventId: this.eventId
      }).subscribe( { next: (e) => {
        console.log(e);
        this.working = false;
        this.dialog.close(e);
      }, error: (e) => {
        console.log(e)
        this.working = false
        alert(e.message)
  
      }})
     
 

  }
 

 

}
