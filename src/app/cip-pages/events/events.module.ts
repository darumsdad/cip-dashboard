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
  NbCalendarModule,
} from '@nebular/theme';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxEchartsModule } from 'ngx-echarts';



import { ThemeModule } from '../../@theme/theme.module';
import { ContactsTableRenderComponent } from './contacts.table.render.component';

import { EventsDashboardComponent } from './events.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


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
    NbAlertModule,
    NbCalendarModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    
    
    

  ],
  declarations: [
    EventsDashboardComponent,
    ContactsTableRenderComponent
    
    
  ],
})
export class EventsDashboardModule { }
