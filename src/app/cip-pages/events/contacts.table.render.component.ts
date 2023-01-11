import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { NbPopoverDirective } from '@nebular/theme';

import { ViewCell } from 'ng2-smart-table';

@Component({
    templateUrl: './contacts.table.render.component.html',
    styleUrls: ['./contacts.table.render.component.scss'],
})
export class ContactsTableRenderComponent implements ViewCell, OnInit {

  renderValue: string;

  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;
  @ViewChild('bridet', { read: TemplateRef }) bride_template: TemplateRef<any>;
  @ViewChild('groomt', { read: TemplateRef }) groom_template: TemplateRef<any>;
  

  @Input() value: any;
  @Input() rowData: any;
  bride: any;
  groom: any;

  ngOnInit() {
    
    this.bride = this.value[0];
    
    this.groom = this.value[1];
  }

}