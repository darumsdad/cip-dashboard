import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailService } from 'src/app/services/email.service';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { EventService } from 'src/app/services/event.service';
import { FileGenerateService } from 'src/app/services/file-generate.service';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-callsheet',
  templateUrl: './callsheet.component.html',
  styleUrls: ['./callsheet.component.scss']
})
export class CallsheetComponent implements OnInit {


  form: FormGroup;
  precontract: any;

  preview: any;
  loading: any = false;
  editor: FormControl;
  
  callsheet: any


  raw_html: string;


  constructor(
    public generatorService: FileGenerateService,
    private sanitizer: DomSanitizer,
    private fileService: FileService,
    private eds: EventDetailService,
    private es: EventService,

  ) { }

  @ViewChild('first') first: MatExpansionPanel;

  ngOnInit(): void {

    this.editor = new FormControl;
    
    this.form = this.eds.form.get('data') as FormGroup;

    this.callsheet = this.form.value.callsheet;
    console.log("init")
    console.log(this.callsheet)

  }

  canEdit(): any {
    return this.callsheet
  }

  onEdit() {

    this.loading = true;

    
    this.raw_html = atob(this.callsheet.callsheet_html)
    this.editor.patchValue(this.raw_html);
    this.loading = false;

    

  }
    

  onCreate() {

    this.loading = true;

    let payload = {
      data: this.form.value,
      venue: this.eds.venue,
      eventId: this.eds.eventId,
      type: 'callsheet',
      template_html: this.callsheet?.template_html
    }

    let logic: Function = (e) => {
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

    this.eds.save(
      logic.bind(this)
    )

  }

  onCreatePreview() {
    this.preview = this.sanitizer.bypassSecurityTrustHtml(this.editor.value)
  }

  onSend(stepper: MatStepper) {

    this.loading = true;

    let filePayload = {
      encoded_data: btoa(this.editor.value),
      fileName: "callsheet.pdf",
      convert_to_pdf: true
    }

    this.fileService.post(this.eds.eventId, filePayload).subscribe(
      {
        next: (event) => {

          let file_detail = event;

          let file_details = {
            fileName: file_detail.fileName,
            fileUrl: file_detail.fileUrl,
            type: 'Callsheet',
            description: 'callsheet create on : ' + new Date().toISOString(),
          }

          let files = this.form.value.files;
          if (!files) {
            files = {
              files: [file_details]
            }
          }
          else {

            files.files = files.files.filter(x => x.fileName !== file_details.fileName)
            files.files.push(file_details)
          }

          let save_payload = {
            type: 'files',
            data: files
          }

          this.es.save(this.eds.eventId, save_payload).subscribe(
            {
              next: (files) => {
                this.form.get('files').patchValue(files)

                let save_payload = {
                  type: 'callsheet',
                  data: {
                    callsheet_html: btoa(this.editor.value)
                  }
                }

                this.es.save(this.eds.eventId, save_payload).subscribe(
                  {
                    next: (callsheet) => {
                      stepper.reset()
                      this.callsheet = callsheet;
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
                alert(error.message)
                this.loading = false;
              }
            }
          )

        },
        error: (error) => {
          alert(error.message)
          this.loading = false;
        }
      });

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

  disableCreate(): boolean {

    let ret =
      this.form.value.bride_first_name &&
      this.form.value.groom_first_name
    return !ret;
  }

  getHtml(email: any) {
    return this.sanitizer.bypassSecurityTrustHtml(atob(email.encoded_html))
  }

  overallStatus() {
   if (this.callsheet)
   {
    return {
      class: "blue",
      text: "callsheet created"
    }

   }

   return {
    class: "red",
    text: "callsheet not created"
  }
  }





}

