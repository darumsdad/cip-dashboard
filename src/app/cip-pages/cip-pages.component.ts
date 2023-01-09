import { Component } from '@angular/core';

import { MENU_ITEMS } from './cip-pages-menu';

@Component({
  selector: 'ngx-cip-pages',
  styleUrls: ['cip-pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class CIPPagesComponent {

  menu = MENU_ITEMS;
}
