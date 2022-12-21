import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './event/event-list/event-list.component';
import { WeddingComponent } from './event/wedding/wedding.component';
import { VenueDetailComponent } from './venue/venue-detail/venue-detail.component';
import { VenueListComponent } from './venue/venue-list/venue-list.component';

const routes: Route[] = [{
  path: 'events', component: EventListComponent,
},
{ path: 'wedding/:id', component: WeddingComponent },
{ path: 'venues/:id', component: VenueDetailComponent },
{ path: 'venues', component: VenueListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
