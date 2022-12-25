import { Component, OnInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { EventDetailService } from 'src/app/services/event-detail.service';
 

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  viewProviders: [MatExpansionPanel]
})
export class DocumentsComponent implements OnInit {

  
  precontract_jotform: any;
  prewedding_jotform: any;

  constructor(private eds: EventDetailService) { }

  ngOnInit(): void {
    this.precontract_jotform = this.eds.form.value.data.precontract_jotform
    this.prewedding_jotform = this.eds.form.value.data.prewedding_jotform
    
  }

    

}
