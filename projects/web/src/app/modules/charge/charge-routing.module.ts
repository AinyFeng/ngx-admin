import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChargeComponent } from './charge/charge.component';
import { ChargeFrameComponent } from './charge.frame.component';

const routes: Routes = [
  {
    path: '',
    component: ChargeFrameComponent,
    children: [
      { path: 'charge', component: ChargeComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeRoutingModule { }
