import { Component, Input, OnInit } from '@angular/core';
import { FileGenerateService } from 'src/app/services/file-generate.service';

@Component({
  selector: 'app-call-sheet',
  templateUrl: './call-sheet.component.html',
  styleUrls: ['./call-sheet.component.scss']
})
export class CallSheetComponent implements OnInit {

  
  dataModel: any;

  constructor(public s: FileGenerateService) { }

  @Input()
  eventId: any

  ngOnInit(): void {
  }

  populate($event: any) {
    this.s.call_sheet({
      eventId: this.eventId,
      type: 'call_sheet'
    }).subscribe(
      {
        next: (html) => {
          
          let decode = atob(html.html)
          console.log(decode)
          this.dataModel = decode

        },
        error: (error) => {
          alert(error.mesage)
        }
      }
    )
  }

}
