import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CIPPagesComponent } from './cip-pages.component';
import { NotFoundComponent } from '../pages/miscellaneous/not-found/not-found.component';
import { ECommerceComponent } from '../pages/e-commerce/e-commerce.component';
import { EventsDashboardComponent } from './events/events.component';



const routes: Routes = [{
  path: '',
  component: CIPPagesComponent,
  children: [
    {
      path: 'dashboard',
      component: EventsDashboardComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CIPPagesRoutingModule {
}
