import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketGeneratorComponent } from './components/ticketgenerator/ticketgenerator.component';
import { TicketComponent } from './ticket.component';

const routes: Routes = [
  {
    path: '',
    component: TicketComponent,
    children: [
      { path: 'ticketgenerator', component: TicketGeneratorComponent },
      { path: '', redirectTo: 'ticketgenerator', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
