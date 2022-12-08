import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialExampleModule } from './material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {HttpClientModule} from '@angular/common/http';
import { EventComponent } from './event/event/event.component';
import { EventStatusComponent } from './event/event-status/event-status.component';
import { EventListComponent } from './event/event-list/event-list.component';
import { EventDetailsComponent } from './event/event-detail/event-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { VenueSelectComponent } from './venue/venue-select/venue-select.component';
import { VenueAddComponent } from './venue/venue-add/venue-add.component';
import { DocumentsComponent } from './documents/documents/documents.component';
import { EmailSendComponent } from './documents/email-send/email-send.component';
import { JotFormComponent } from './documents/jot-form/jot-form.component';
import { VenueListComponent } from './venue/venue-list/venue-list.component';
import { VenueDetailComponent } from './venue/venue-detail/venue-detail.component';
import { CertEmailComponent } from './documents/cert-email/cert-email.component';
import { VideoDetailsComponent } from './documents/video-details/video-details.component';








@NgModule({
  declarations: [
    AppComponent,
    EventComponent,
    EventStatusComponent,
    EventListComponent,
    EventDetailsComponent,
    VenueSelectComponent,
    VenueAddComponent,
    DocumentsComponent,
    EmailSendComponent,
    JotFormComponent,
    VenueListComponent,
    VenueDetailComponent,
    
    CertEmailComponent,
    VideoDetailsComponent
    
  ],
    imports: [
    NgxMaterialTimepickerModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
