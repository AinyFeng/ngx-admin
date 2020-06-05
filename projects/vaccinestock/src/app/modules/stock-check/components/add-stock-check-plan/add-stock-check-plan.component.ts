import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from '@tod/ngx-webstorage';
import {
  DateUtils,
  LOCAL_STORAGE,
  PovStaffInitService,
  VacStockCheckPlanApiService
} from '@tod/svs-common-lib';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'add-stock-check-plan',
  templateUrl: './add-stock-check-plan.component.html',
  styleUrls: ['./add-stock-check-plan.component.scss']
})

export class AddStockCheckPlanComponent implements OnInit {

  addPlanForm: FormGroup;
  /**
   * 已选库存信息
   */
  @Input()
  selectedData = [];

  povInfo: any;
  /**
   * 职员表选择项
   */
  povStaffOptions = [];

  today = new Date();

  constructor(private fb: FormBuilder,
              private localSt: LocalStorageService,
              private povStaffInitSvc: PovStaffInitService,
              private vacStockPlanApiSvc: VacStockCheckPlanApiService,
              private msg: NzMessageService,
              private modalRef: NzModalRef<AddStockCheckPlanComponent>,
              private modalSvc: NzModalService
  ) {
    this.povInfo = this.localSt.retrieve(LOCAL_STORAGE.VACC_POV);
  }

  ngOnInit(): void {
    this.povStaffOptions = this.povStaffInitSvc.getPovStaffData().filter(staff => staff.hasOwnProperty('number') && staff.number);
    console.log(this.povStaffOptions);
    this.addPlanForm = this.fb.group({
      storeCode: [null, [Validators.required]], // 当前登录用户所在 POV 或市疾控的单位编码
      storeName: [], // 当前登录用户所在POV或市疾控的单位名称
      checkDate: [null, [Validators.required]], // 盘点日期
      checkUser: [null, [Validators.required]], // 盘点人员
      checkName: [null, [Validators.required]], // 盘点名称
      memo: [], // 备注
      stockCheckPlanDetailInparam: [], // 盘点疫苗明细
    });
    console.log(this.povInfo);
    if (this.povInfo) {
      this.addPlanForm.get('storeName').patchValue(this.povInfo.name);
      this.addPlanForm.get('storeCode').patchValue(this.povInfo.povCode);
    }
  }

  submit() {
    for (const i in this.addPlanForm.controls) {
      if (this.addPlanForm.controls[i]) {
        this.addPlanForm.controls[i].markAsDirty();
        this.addPlanForm.controls[i].updateValueAndValidity();
      }
    }
    console.log(this.addPlanForm);
    if (this.addPlanForm.invalid) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: '表单填写不完整，请检查',
        nzMaskClosable: true
      });
      return;
    }
    const stockCheckPlanDetailInparam = [];
    this.selectedData.forEach(s => {
      stockCheckPlanDetailInparam.push({
        storeCode: this.addPlanForm.get('storeCode').value,
        batchSerialCode: s['batchNo'],
        orignPrice: s['orignPrice'],
        inventorySerialCode: s['inventorySerialCode']
      });
    });
    const addPlanParam = this.addPlanForm.value;
    addPlanParam['checkDate'] = DateUtils.getFormatDateTime(addPlanParam['checkDate']);
    addPlanParam['stockCheckPlanDetailInparam'] = stockCheckPlanDetailInparam;
    console.log(addPlanParam);
    this.vacStockPlanApiSvc.addStockCheckPlan(addPlanParam, res => {
      console.log(res);
      if (res.code === 0) {
        this.msg.success('盘点计划添加成功');
        this.modalRef.close();
      }
    });
  }

  close() {
    this.modalRef.close();
  }

  filterDate = (d: Date) => {
    return d < this.today;
  }
}
