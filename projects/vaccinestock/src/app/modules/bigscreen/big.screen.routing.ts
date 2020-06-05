import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../../@uea/components/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { BigScreenFrame } from './big.screen.frame.component';
import { VaccinationTraceComponent } from './components/vaccination-trace/vaccination-trace.component';
import { VaccinationDisplayComponent } from './components/vaccination-display/vaccination-display.component';

/**
 * routes 编写这个routes 是有加载顺序的，path: '**' 要放在最后面
 */
const routes: Routes = [
  {
    path: '',
    component: BigScreenFrame,
    children: [
      {
        path: 'vaccinationtrace',
        component: VaccinationTraceComponent
      },
      {
        path: 'vaccinationdisplay',
        component: VaccinationDisplayComponent
      },
      { path: '', redirectTo: 'vaccinationtrace', pathMatch: 'full' },
      { path: '**', component: NotFoundComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BigScreenRouting { }
