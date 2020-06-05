import { VaccExamineComponent } from './vaccexamine.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolComponent } from './componnets/school/school.component';
import { ExamineComponent } from './componnets/examine/examine.component';
import { StudentComponent } from './componnets/student/student.component';
import { ExamineReportComponent } from './componnets/report/examinereport.component';

const routes: Routes = [
  {
    path: '',
    component: VaccExamineComponent,
    children: [
      { path: 'student', component: StudentComponent },
      { path: 'school', component: SchoolComponent },
      { path: 'examine', component: ExamineComponent },
      { path: 'report', component: ExamineReportComponent },
      { path: '', redirectTo: 'student', pathMatch: 'full' }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaccExamineRoutingModule { }
