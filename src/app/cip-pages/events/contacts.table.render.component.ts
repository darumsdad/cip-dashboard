import { Component, Input, OnInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

@Component({
    templateUrl: './contacts.table.render.component.html',
  
})
export class ContactsTableRenderComponent implements ViewCell, OnInit {

  renderValue: string;

  @Input() value: any;
  @Input() rowData: any;
  bride: any;
  groom: any;

  ngOnInit() {
    console.log(this.value)
    this.bride = this.value[0];
    
    this.groom = this.value[1];
  }

}