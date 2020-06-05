import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// 导入 NB 组件库
import { ChargeRoutingModule } from './charge-routing.module';
import { ChargeComponent } from './charge/charge.component';
import { UeaModule } from '../../@uea/uea.module';
import { ChargeFrameComponent } from './charge.frame.component';

@NgModule({
  declarations: [ChargeComponent, ChargeFrameComponent],
  imports: [CommonModule, UeaModule, ChargeRoutingModule]
})
export class ChargeModule { }
