import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import {
  DicDataService,
  StockService,
  VaccRecordTransformService,
  DateUtils,
  StockCommonService, PovStaffInitService
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-vac-breakage-out',
  templateUrl: './vac-breakage-out.component.html',
  styleUrls: ['../../admin.common.scss'],
  providers: [StockCommonService]
})
export class VacBreakageOutComponent implements OnInit {
  loading = false;
  breakForm: FormGroup;
  // 报损
  breakage: any;
  // 报损类型选项
  breakTypeOptions: any;
  // 用户信息
  userInfo: any;
  /**
   * 当前日期
   */
  currentDate = new Date();
  // 操作人
  staffOption = [];
  staffOptionSelected = [];
  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<VacBreakageOutComponent>,
    private msg: NzMessageService,
    private stockService: StockService,
    private user: UserService,
    private vaccRecordTransformService: VaccRecordTransformService,
    private povStaffDataInit: PovStaffInitService,
    private dicSvc: DicDataService
  ) {
  }

  ngOnInit() {
    // 获取用户数据
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
    });
    // 获取操作人信息
    this.staffOption = this.povStaffDataInit.getPovStaffData();
    /* console.log('staffOption==', this.staffOption);*/
    // 过滤number是null的数据
    this.staffOption.forEach( d => {
      if ( d.number && d.number !== '') {
        this.staffOptionSelected.push(d);
      }
    });
    // 合议项
    this.breakTypeOptions = this.dicSvc.getDicData().breakType;
    // 根据code 获取疫苗产品名称
    this.breakForm = this.fb.group({
      vaccineProductCode: [this.breakage.vaccineProductName, [Validators.required]],
      vaccineSpecification: [this.breakage.vaccineSpecification, [Validators.required]],
      manufacturerCode: [this.vaccRecordTransformService.transformManufacture(this.breakage.manufacturerCode), [Validators.required]],
      price: [this.breakage.price, [Validators.required]],
      prodBatchCode: [this.breakage.prodBatchCode, [Validators.required]],
      count: [this.breakage.count, [Validators.required]],
      departmentCode: [this.breakage.departmentName], // 部门
      countOut: [null, [Validators.required]],
      breakType: ['1', [Validators.required]], // 报损类型
      breakTime: [null, [Validators.required]],  // 损坏时间
      stockBy: [null, [Validators.required]],
      memo: [null],
    });
  }
  // 关闭弹窗
  onClose() {
    this.ref.close();
  }
  // 提交报损入库
  doBreak() {
    const formGroupVal = this.breakForm.controls;
    for (const controlKey in formGroupVal) {
      if (formGroupVal[controlKey]) {
        const formVal: any = formGroupVal[controlKey];
        if (formVal.invalid) {
          this.breakForm.get(controlKey).markAsDirty();
          this.breakForm.get(controlKey).markAsTouched();
        }
      }
    }
  /*  console.log('报损时间=====', this.breakForm.value.breakTime, DateUtils.getFormatDateTime(this.breakForm.value.breakTime));*/
    if (this.breakForm.invalid) {
      this.msg.warning('请正确填报损出库信息！');
      return;
    }
    console.log('需要报损的信息===', this.breakage);
    let breakFrom = JSON.parse(JSON.stringify(this.breakForm.value));
    if (breakFrom.countOut > this.breakage.count || breakFrom.countOut <= 0) {
      this.msg.warning('出库数量填写有误！');
      return;
    }
    const params = {
      povCode: this.userInfo.pov,
      acceptanceSerial: this.breakage.acceptanceSerial, // 添加入库单号
      vaccProductCode: this.breakage.vaccineProductCode,
      departmentCode: this.breakage.departmentCode,
      prodBatchCode: breakFrom.prodBatchCode,
      count: breakFrom.countOut,
      breakType: breakFrom.breakType,
      stockBy: breakFrom.stockBy,
      memo: breakFrom.memo,
      facilityCode: this.breakage.facilityCode,
      breakTime: DateUtils.getFormatDateTime(this.breakForm.value.breakTime),
    };
    console.log('报损==', params);
    this.loading = true;
    this.stockService.breakage(params, res => {
      this.loading = false;
      console.log('报损出库成功resp====', res);
      if (res && res.code === 0) {
        this.msg.info(res.msg);
        this.ref.close(true);
      } else {
        this.msg.warning(`${res.msg}`);
      }
    });
  }

  /**
   * 过滤处理日期
   * @param d
   */
  filterHandleDate = (d: Date) => {
      return d > this.currentDate;
  }
}
