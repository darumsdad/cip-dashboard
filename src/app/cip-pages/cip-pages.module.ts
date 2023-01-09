import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from '../pages/dashboard/dashboard.module';
import { ECommerceModule } from '../pages/e-commerce/e-commerce.module';
import { MiscellaneousModule } from '../pages/miscellaneous/miscellaneous.module';


import { CIPPagesRoutingModule } from './cip-pages-routing.module';
import { CIPPagesComponent } from './cip-pages.component';
import { EventsDashboardModule } from './events/events.module';



@NgModule({
  imports: [
    CIPPagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    MiscellaneousModule,
    EventsDashboardModule
    
  ],
  declarations: [
    CIPPagesComponent
  ],
  
})
export class CIPPagesModule {
}
