import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { FileGenerateService } from 'src/app/services/file-generate.service';

@Component({
  selector: 'app-call-sheet',
  templateUrl: './call-sheet.component.html',
  styleUrls: ['./call-sheet.component.scss']
})
export class CallSheetComponent implements OnInit {


  dataModel: FormControl = new FormControl();
  loading: any;
  create_working: boolean;
  save_working: boolean;
  inputFile: any

  constructor(public s: FileGenerateService,
    public eventService: EventService) { }

  @Input()
  eventId: any

  ngOnInit(): void {
    this.load()
  }

  load() {
    this.loading = true;
    this.eventService.get(this.eventId).subscribe(
      {
        next: (event) => {
          console.log(event)
          if (event.data.call_sheet[0])
          {
            this.dataModel.patchValue( atob(event.data.call_sheet[0].html) )
            this.inputFile = event.data.call_sheet[0].file
          }

          this.loading = false;
        },
        error: (error) => {
          alert(error.mesage)
          this.loading = false;
        }
      }
    )
  }

  save($event: any) {
    this.save_working = true;
    this.eventService.save_call_sheet(this.eventId, this.dataModel.value).subscribe(
      {
        next: (event) => {
         this.load();
         this.save_working = false;
        },
        error: (error) => {
          alert(error.mesage)
          this.save_working = false;
        }
      }
    )
  }

  populate($event: any) {
    this.create_working = true;
    this.s.call_sheet({
      eventId: this.eventId,
      type: 'call_sheet'
    }).subscribe(
      {
        next: (html) => {

          let decode = atob(html.html)
          console.log(decode)
          this.dataModel.patchValue(decode)
          console.log(this.dataModel.value)
          this.create_working = false;

        },
        error: (error) => {
          alert(error.mesage)
          this.create_working = false;
        }
      }
    )
  }

}
