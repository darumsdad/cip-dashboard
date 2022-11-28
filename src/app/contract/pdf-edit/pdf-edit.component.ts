import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ViewSDKClient } from 'src/app/services/view-sdk.service';

@Component({
  selector: 'app-pdf-edit',
  templateUrl: './pdf-edit.component.html',
  styleUrls: ['./pdf-edit.component.scss']
})
export class PdfEditComponent implements AfterViewInit  {

  constructor(private viewSDKClient: ViewSDKClient) { }
  

    ngAfterViewInit() {
        this.viewSDKClient.ready().then(() => {
            /* Invoke file preview */
            /* By default the embed mode will be Full Window */
            this.viewSDKClient.previewFile('pdf-div', {});
        });
    }
}
