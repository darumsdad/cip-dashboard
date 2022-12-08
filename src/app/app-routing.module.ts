import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { VideoDetailsComponent } from './documents/video-details/video-details.component';
import { EventListComponent } from './event/event-list/event-list.component';
import { EventComponent } from './event/event/event.component';
import { VenueDetailComponent } from './venue/venue-detail/venue-detail.component';
import { VenueListComponent } from './venue/venue-list/venue-list.component';

const routes: Route[] = [{
  path: 'events', component: EventListComponent,
},
{ path: 'detail/:id', component: EventComponent },
{ path: 'detail', component: EventComponent },
{ path: 'video/:id', component: VideoDetailsComponent },
{ path: 'venues/:id', component: VenueDetailComponent },
{ path: 'venues', component: VenueListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
