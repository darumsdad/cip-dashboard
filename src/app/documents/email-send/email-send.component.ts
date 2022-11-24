import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as e from 'express';
import { EmailService } from 'src/app/services/email.service';
import { JotFormLinkService } from 'src/app/services/jot-form-link.service';

@Component({
  selector: 'app-email-send',
  templateUrl: './email-send.component.html',
  styleUrls: ['./email-send.component.scss']
})
export class EmailSendComponent implements OnInit {
  ref: any;
  form: FormGroup;
  emailList: any;
  html: any;
  origLink: any;
  type: any;

  constructor(public s: JotFormLinkService,
    
    private e: EmailService,
    public dialog: MatDialogRef<EmailSendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  dataModel: any
  email_address: any
  
  eventId: any

  //emailList: any [] = [];

  ngOnInit(): void {
    this.dataModel = new FormControl();
    this.email_address = new FormControl(Validators.required);
    
    console.log(this.data)
    this.eventId = this.data.eventId;
    this.emailList = this.data.emailList;
    this.type = this.data.type;

    this.s.get(this.eventId).subscribe(e => {
      this.origLink = e.link
      let value = atob(e.templateHtml);
      this.dataModel.patchValue(value)
    })
  }

  onSend($event)
  {
    console.log(this.email_address);
    console.log(this.email_address.value)

    if (this.type === 'pre')
    {
      this.e.post({
        to: this.email_address.value.email,
        name: this.email_address.value.name,
        type: "Pre Contract",
        link: this.origLink,
        id: this.eventId
      }).subscribe( { next: (e) => {
        console.log(e);
        this.dialog.close(e);
  
      }, error: (e) => {
        console.log(e)
        alert(e.message)
  
      }})
    }

    if (this.type === 'proposal')
    {
      this.e.post_proposal({
        to: this.email_address.value.email,
        name: this.email_address.value.name,
        type: "Proposal",
        id: this.eventId
      }).subscribe( { next: (e) => {
        console.log(e);
        this.dialog.close(e);
  
      }, error: (e) => {
        console.log(e)
        alert(e.message)
  
      }})
    }

    
  }

 

}
