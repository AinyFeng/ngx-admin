import { ExamineComponent } from './componnets/examine/examine.component';
import { StudentComponent } from './componnets/student/student.component';
import { SchoolComponent } from './componnets/school/school.component';
import { VaccExamineComponent } from './vaccexamine.component';
import { NgModule } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';

import { DicDataService, AdministrativeDivisionService, PovInfoService, VaccExamineApi } from '@tod/svs-common-lib';
import { UeaModule } from '../../@uea/uea.module';
import { VaccExamineRoutingModule } from './vaccexamine-routing.module';
import { NzIconModule } from 'ng-zorro-antd';
import { SelectSchoolComponent } from './componnets/select-school/select-school.component';
import { VEStudentsTableComponent } from './componnets/vestudentstable/vestudentstable.component';
import { VEClassesTableComponent } from './componnets/veclassestable/veclassestable.component';
import { VEExamineTableComponent } from './componnets/veexaminetable/veexaminetable.component';
import { ExamineReportComponent } from './componnets/report/examinereport.component';
import { VEReportTableComponent } from './componnets/vereportstable/vereporttable.component';
import { ExcelService } from '@tod/svs-common-lib';

const MDS_API_SERVICES = [
  // XXX
  VaccExamineApi

];

// 数据初始化services
const MDS_COMMON_SERVICES = [
  DicDataService,
  PovInfoService,
  AdministrativeDivisionService,
  ExcelService
];

@NgModule({
  imports: [
    UeaModule,
    VaccExamineRoutingModule,
    NzIconModule,
    NzButtonModule
  ],
  declarations: [
    VaccExamineComponent, SchoolComponent, StudentComponent, ExamineComponent, ExamineReportComponent,
    SelectSchoolComponent, VEClassesTableComponent, VEStudentsTableComponent,
    VEExamineTableComponent, VEReportTableComponent
  ],
  providers: [
    ...MDS_COMMON_SERVICES,
    ...MDS_API_SERVICES
  ]
})
export class VaccExamineModule {
}
