import { Component, Input, OnInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

@Component({
    templateUrl: './venue.table.render.component.html',
  
})
export class VenueTableRenderComponent implements ViewCell, OnInit {

  renderValue: string;

  @Input() value: any;
  @Input() rowData: any;
   

  ngOnInit() {
    
  }

}