import { PaymentComponent } from './payment/payment.component';

import { Routes } from '@angular/router';


export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'homepage',
    pathMatch: 'full',
  }, {
    path: '',
    component: PaymentComponent},
  {
    path: '**',
    redirectTo: 'homepage'
  }
]
