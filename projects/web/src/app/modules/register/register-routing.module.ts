import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register.component';
import { RegisterFrameComponent } from './register.frame.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterFrameComponent,
    children: [
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
