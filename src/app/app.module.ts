import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialExampleModule } from './material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {HttpClientModule} from '@angular/common/http';
import { WeddingComponent } from './event/wedding/wedding.component';
import { WeddingStatusComponent } from './event/wedding/wedding-status/wedding-status.component';
import { EventListComponent } from './event/event-list/event-list.component';
import { FormatNames, WeddingMainDetailsComponent } from './event/wedding/wedding-main-detail/wedding-main-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { VenueSelectComponent } from './venue/venue-select/venue-select.component';
import { VenueAddComponent } from './venue/venue-add/venue-add.component';
import { DocumentsComponent } from './documents/documents/documents.component';

import { VenueListComponent } from './venue/venue-list/venue-list.component';
import { VenueDetailComponent } from './venue/venue-detail/venue-detail.component';
 

import { VideoListComponent } from './documents/video-list/video-list.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { EditorModule } from '@tinymce/tinymce-angular';

 
import { ProposalComponent } from './documents/proposal/proposal.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { PrecontractComponent } from './documents/precontract/precontract.component';
import { PrecontractJotformSubmissionComponent } from './documents/precontract-jotform-submission/precontract-jotform-submission.component';
import { ContractComponent } from './documents/contract/contract.component';
import { PreweddingComponent } from './documents/prewedding/prewedding.component';
import { WeddingAllDetailsComponent } from './event/wedding/wedding-all-details/wedding-all-details.component';
import { PreweddingJotformSubmissionComponent } from './documents/prewedding-jotform-submission/prewedding-jotform-submission.component';
import { FilesComponent } from './documents/files/files.component';
//import { ContenteditableValueAccessor } from './contenteditable.directive';
import { ngfModule, ngf } from "angular-file";
import { CallsheetComponent } from './documents/callsheet/callsheet.component';
import { CertificateComponent } from './documents/certificate/certificate.component';
import { CallsheetEditComponent } from './wedding/callsheet-edit/callsheet-edit.component'
import { EmailStatusPipe , EmailOverallStatusPipe} from './event/utils';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { SearchComponent } from './video/search/search.component';










@NgModule({
  declarations: [
    AppComponent,
    EmailStatusPipe,EmailOverallStatusPipe,FormatNames,
    //ContenteditableValueAccessor,
    WeddingComponent,
    WeddingStatusComponent,
    EventListComponent,
    WeddingMainDetailsComponent,
    VenueSelectComponent,
    VenueAddComponent,
    DocumentsComponent,
    VenueDetailComponent,
 
    
    VideoListComponent,
    VenueListComponent,
    ProposalComponent,
    PrecontractComponent,
    PrecontractJotformSubmissionComponent,
    ContractComponent,
    PreweddingComponent,
    WeddingAllDetailsComponent,
   
    PreweddingJotformSubmissionComponent,
    
    FilesComponent,
         CallsheetComponent,
         CertificateComponent,
         CallsheetEditComponent,
         SearchComponent,
    
    
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
    NgbModule,
    ngfModule,
    GooglePlaceModule,
    EditorModule,
   
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
