import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbCalendarMonthPickerComponent,
  NbCalendarKitModule,
  NbLayoutColumnComponent,
  NbLayoutModule,
  NbSidebarModule,
  NbButtonGroupModule,
  NbAlertModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxEchartsModule } from 'ngx-echarts';



import { ThemeModule } from '../../@theme/theme.module';
import { ContactsTableRenderComponent } from './contacts.table.render.component';

import { EventsDashboardComponent } from './events.component';


@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbCalendarKitModule,
    NbIconModule,
    NbLayoutModule,
    NbSidebarModule,
    NbButtonModule,
    NbButtonGroupModule,
    NbAlertModule
    
   
  ],
  declarations: [
    EventsDashboardComponent,
    ContactsTableRenderComponent
    
    
  ],
})
export class EventsDashboardModule { }
