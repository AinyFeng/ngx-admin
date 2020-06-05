import { SystemAnnouncementService } from '@tod/svs-common-lib';
import { NgModule } from '@angular/core';
import { mdsDashboardOptions } from './modules-dashboard';

import { UeaDashboardModule } from '../@uea/components/dashboard/ueadashboard.module';
import { ModulesRoutingModule } from './modules-routing.module';
import { ModulesComponent } from './modules.component';
import { UeaModule } from '../@uea/uea.module';
import { NoticeComponent } from './components/notice/notice.component';

const MDS_API_SERVICES = [
  // XXX
  SystemAnnouncementService

];

// 数据初始化services
const MDS_COMMON_SERVICES = [

];

@NgModule({
  imports: [UeaModule, ModulesRoutingModule,
    UeaDashboardModule.forRoot(mdsDashboardOptions),
  ],
  declarations: [ModulesComponent, NoticeComponent],
  providers: [...MDS_COMMON_SERVICES, ...MDS_API_SERVICES]
})
export class ModulesModule {
}
