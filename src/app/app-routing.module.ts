import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { PdfEditComponent } from './contract/pdf-edit/pdf-edit.component';
import { EventListComponent } from './event/event-list/event-list.component';
import { EventComponent } from './event/event/event.component';
import { VenueDetailComponent } from './venue/venue-detail/venue-detail.component';
import { VenueListComponent } from './venue/venue-list/venue-list.component';

const routes: Route[] = [{
  path: 'events', component: EventListComponent,
},
{ path: 'detail/:id', component: EventComponent },
{ path: 'detail', component: EventComponent },
{ path: 'venues/:id', component: VenueDetailComponent },
{ path: 'venues', component: VenueListComponent },
{ path: 'pdf', component: PdfEditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
