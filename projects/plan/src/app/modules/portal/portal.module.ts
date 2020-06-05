import { NgModule } from '@angular/core';
import { UeaDashboardModule } from '../../@uea/components/dashboard/ueadashboard.module';
import { UeaAuthShareModule } from '@tod/uea-auth-lib';
// import { SharedModule } from '@tod/svs-common-lib';
import { AccountBindingInfoComponent } from './components/account-binding-info/account-binding-info.component';
import { BindingEmailComponent } from './components/binding-email/binding-email.component';
import { ChangeEmailComponent } from './components/change-email/change-email.component';
import { ChangePhoneComponent } from './components/change-phone/change-phone.component';
import { DeleteMessageComponent } from './components/delete-message/delete-message.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { OperateRecordComponent } from './components/operate-record/operate-record.component';
import { PasswordDialogComponent } from './components/password-dialog/password-dialog.component';
// import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { PhoneDialogComponent } from './components/phone-dialog/phone-dialog.component';
import { SendMessageComponent } from './components/send-message/send-message.component';
import { mdsPortalDashboardOptions } from './portal-dashboard';
import { PortalRoutingModule } from './portal-routing.module';
import { PortalComponent } from './portal.component';
import { UeaModule } from '../../@uea/uea.module';

// 引入入口文件
const COMPONENTS = [
  BindingEmailComponent,
  PhoneDialogComponent,
  PasswordDialogComponent,
  ChangeEmailComponent,
  ChangePhoneComponent,
  AccountBindingInfoComponent,
  PortalComponent,
  OperateRecordComponent,
  MessageListComponent,
  SendMessageComponent,
  DeleteMessageComponent
];

@NgModule({
  imports: [
    UeaModule,
    PortalRoutingModule,
    UeaDashboardModule.forRoot(mdsPortalDashboardOptions),
    UeaAuthShareModule
  ],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
  exports: [...COMPONENTS, UeaModule, PortalRoutingModule]
})
export class PortalModule { }
