import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UeaDashboardComponent } from './../../@uea/components/dashboard/ueadashboard.component';
import { AccountBindingInfoComponent } from './components/account-binding-info/account-binding-info.component';
import { DeleteMessageComponent } from './components/delete-message/delete-message.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { OperateRecordComponent } from './components/operate-record/operate-record.component';
// import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { SendMessageComponent } from './components/send-message/send-message.component';
import { PortalComponent } from './portal.component';
import { PersonalInfoComponent } from '../../@uea/components/personal-info/personal-info.component';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      { path: 'dashboard', component: UeaDashboardComponent },
      { path: 'accountBindingInfo', component: AccountBindingInfoComponent },
      { path: 'personalInfo', component: PersonalInfoComponent },
      { path: 'operateRecord', component: OperateRecordComponent },
      { path: 'messageList', component: MessageListComponent },
      { path: 'sendMessage', component: SendMessageComponent },
      { path: 'deleteMessage', component: DeleteMessageComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
