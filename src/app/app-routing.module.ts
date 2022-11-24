import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './event/event-list/event-list.component';
import { EventComponent } from './event/event/event.component';

const routes: Route[] = [{
  path: 'events', component: EventListComponent,
},
{ path: 'detail/:id', component: EventComponent },
{ path: 'detail', component: EventComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
