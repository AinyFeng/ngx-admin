import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'uea-select-seed-dialog',
  templateUrl: './select-seed-dialog.component.html',
  styleUrls: ['./select-seed-dialog.component.scss']
})
export class SelectSeedDialogComponent implements OnInit {


  @Input()
  orderConditions: any;
  /**
   * 加载状态
   */
  loading = false;

  listOfData: any = [
    {
      code: '1',
      vaccine: '卡介苗1',
      company: '上海生物',
      number: '201803023',
      validity: '2020-03-29',
      dose: '0.25mg',
      dosage: '冻干',
      inventory: '15',
      availableInventory: '1',
      select: '1',
    }, {
      code: '2',
      vaccine: '卡介苗2',
      company: '上海生物',
      number: '201803023',
      validity: '2020-03-29',
      dose: '0.25mg',
      dosage: '冻干',
      inventory: '15',
      availableInventory: '2',
      select: '2',
    }, {
      code: '3',
      vaccine: '卡介苗3',
      company: '上海生物',
      number: '201803023',
      validity: '2020-03-29',
      dose: '0.25mg',
      dosage: '冻干',
      inventory: '15',
      availableInventory: '3',
      select: '12',
    },
  ];

  constructor(
    // private ref: NbDialogRef<SelectSeedDialogComponent>,
    // private fb: FormBuilder,
    private modal: NzModalRef
  ) {
  }

  ngOnInit() {
  }

  select(data, selectType) {
    console.log('参数', data, selectType);
    console.log('参数2', this.orderConditions);
    this.modal.destroy({data: data, selectType});
  }


  // 关闭弹窗
  // onClose() {
  //   this.ref.close();
  // }
}
