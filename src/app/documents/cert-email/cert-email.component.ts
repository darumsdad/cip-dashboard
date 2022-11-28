import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileGenerateService } from 'src/app/services/file-generate.service';

@Component({
  selector: 'app-cert-email',
  templateUrl: './cert-email.component.html',
  styleUrls: ['./cert-email.component.scss']
})
export class CertEmailComponent implements OnInit {
working: boolean = false;


  constructor(private e: FileGenerateService,
    public dialog: MatDialogRef<CertEmailComponent>,
    public fb: FormBuilder,
    public s: FileGenerateService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  
  form: any
  contactList: any
  eventId: any
  


  ngOnInit(): void {

    console.log(this.data)
    this.contactList  = this.data.contactList;
    this.eventId = this.data.eventId

    this.form = this.fb.group({
        eventId: [this.eventId],
        type: ['cert'],
        contact: [''],
        insurance_contact: [''],
        cert_recipients: [''],
        venue_details: [''],
        date: ['']
    })

    this.form.patchValue(this.data.defaults)
  }

  onCreate($event: MouseEvent) {
   this.working = true
   this.s.post(this.form.value).subscribe (
    {
      next: (e) => {
        this.working = false;
        this.dialog.close(e);
      },
      error: (e) => {
        alert(e.message)
        this.working = false;
      }
    }
   )

  }

}
