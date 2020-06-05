import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { VaccinatePlatformService } from '../vaccinate-platform-new/vaccinate-platform.service';

@Component({
  selector: 'mds-department-prompt',
  template: `
    <nb-card [ngStyle]="{'width': '400px', 'height': '300px'}">
    <nb-card-header>{{ title }}</nb-card-header>
    <nb-card-body [ngStyle]="{'text-align': 'center'}">
      <nb-select placeholder="选择接种科室" [(selected)]="selectedDepartmentCode"
          [ngStyle]="{'position': 'relative', 'width': '200px', 'top': '30%'}">
        <nb-option *ngFor="let department of departmentOption" [value]="department.departmentCode">
          {{ department.departmentName }}
        </nb-option>
      </nb-select>
    </nb-card-body>
    <nb-card-footer [ngStyle]="{'text-align': 'center'}">
      <button nbButton (click)="close()">关闭</button>
    </nb-card-footer>
  </nb-card>
  `,
})
export class DialogDepartmentComponent {

  title: string = '请选择接种科室！';
  // 接种科室选项
  departmentOption = [];
  selectedDepartmentCode: string = '';

  constructor(protected dialogRef: NbDialogRef<DialogDepartmentComponent>,
              private platformSvc: VaccinatePlatformService) {
  }

  close() {
    this.platformSvc.setVaccinateDep(this.selectedDepartmentCode);
    this.dialogRef.close(this.selectedDepartmentCode);
  }
}
