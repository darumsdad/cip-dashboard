import { ConstantPool } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmailService } from 'src/app/services/email.service';
import { FileGenerateService } from 'src/app/services/file-generate.service';

@Component({
  selector: 'app-pre-contract-email',
  templateUrl: './pre-contract-email.component.html',
  styleUrls: ['./pre-contract-email.component.scss']
})
export class PreContractEmailComponent implements OnInit {


  contactList: any;
  type: any;

  dataModel: FormControl
  contact: FormControl
  subject: FormControl

  eventId: any
  working: boolean = false
  form: FormGroup<any>;
  defaultValue: any = "Creative Image Productions : Questionair";
  sending: boolean;

  constructor(private e: FileGenerateService,
    public dialog: MatDialogRef<PreContractEmailComponent>,
    public emailService: EmailService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    
    this.form = this.data.form;
    console.log(this.form)

    this.dataModel = new FormControl();
    this.contact = new FormControl(Validators.required);
    this.subject = new FormControl(Validators.required);

    console.log(this.data)

    this.eventId = this.data.eventId;
    this.contactList = this.data.contactList;
    this.type = this.data.type;
    let pre_contract = this.form.get('pre_proposal').value;

    console.log(pre_contract.contact)

    console.log(this.contactList)
    let contact = this.contactList.find(x => x.type === pre_contract.contact.type)

    this.subject.patchValue(pre_contract.subject ? pre_contract.subject : this.defaultValue)
    this.dataModel.patchValue(atob(pre_contract.encoded_html))
    this.contact.patchValue(contact)

  }

  saveModel()
  {
    let encoded = btoa(this.dataModel.value)
   
    let valueToSave = {
     encoded_html: encoded,
     contact: this.contact.value,
     subject: this.subject.value,
     type: 'pre-proposal'
     }
     console.log(valueToSave)
 
     this.form.get('pre_proposal').patchValue(valueToSave)
     this.data.save_callback();

  }
  
  onSave()
  {
    this.saveModel()
    this.dialog.close(this.form);
  }

  onSend() 
  {
     
    this.sending = true;
    this.saveModel();

    let payload = {
        encoded_html: btoa(this.dataModel.value),
        contact: this.contact.value,
        subject: this.subject.value,
        key: this.eventId + ':' + "pre_proposal",
        eventId: this.eventId
    }

    this.emailService.post(payload).subscribe(
      {
        next: (result) => {
          this.sending = false;
          this.dialog.close(result);
        },
        error: (e) => {
          alert(e.message)
          this.sending = false;
          
        }
      }
    )
  }

  

  onCreate(event: any) {
    this.working = true;

    console.log(this.contact.value);
    this.e.post(
      {
        contact: this.contact.value,
        type: this.type,
        eventId: this.eventId
      }).subscribe({
        next: (html) => {
          let decode = atob(html.html)
          console.log(decode);
          this.working = false;
          this.dataModel.patchValue(decode)
          //this.dialog.close(e);
        }, error: (e) => {
          console.log(e)
          this.working = false
          alert(e.message)

        }
      })
  }

}
