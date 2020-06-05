import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiAdminDailyManagementService, VacProductNamePipe} from '@tod/svs-common-lib';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'uea-update-price-manage',
  templateUrl: './update-price-manage.component.html',
  styleUrls: ['../../admin.common.scss']
})
export class UpdatePriceManageComponent implements OnInit {
  data: any;
  vacSubClassData: any;
  // 登录人员
  userInfo: any;
  form: FormGroup;

  constructor(
    private ref: NbDialogRef<UpdatePriceManageComponent>,
    private fb: FormBuilder,
    private adminSvc: ApiAdminDailyManagementService,
    private msg: NzMessageService
  ) {
  }

  ngOnInit() {
    console.log(this.data.vaccProductCode);
    this.form = this.fb.group({
      vacProductCode: [this.data.vaccineProductName ? this.data.vaccineProductName : null],
      batchNo: [this.data ? this.data.prodBatchNumber : null],
      purchasePrice: [this.data ? this.data.purchasePrice : null],
      povVaccPrice: [this.data ? this.data.povVaccPrice : null, [Validators.min(0)]]
    });
  }

  onClose() {
    this.ref.close();
  }

  // 保存
  submitInfo() {
    if (this.form.get('povVaccPrice').value === null) {
      this.msg.warning('请输入修改的价格');
      return;
    }
    let params = {
      lastModifyBy: this.userInfo.userCode,
      povVaccPrice: this.form.get('povVaccPrice').value,
      povVaccPriceSerial: this.data.povVaccPriceSerial,
      id: this.data.id
    };
    console.log(params);
    this.adminSvc.updatePovPrice(params, resp => {
      console.log(resp);
      if (resp.code === 0) {
        this.msg.info('修改成功');
        this.ref.close();
      }
    });
  }
}
