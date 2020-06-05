import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PlanStatusPipe, PlanTypePipe} from './plan-config.service';


@NgModule({
  declarations: [
    PlanStatusPipe,
    PlanTypePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PlanStatusPipe,
    PlanTypePipe
  ],
  providers: [

  ]
})
export class PlanServiceModule { }
