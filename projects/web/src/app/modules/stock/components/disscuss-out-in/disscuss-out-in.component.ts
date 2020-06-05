import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { StockService, VaccBroadHeadingDataService, VaccineSubclassInitService, PovStaffApiService, DateUtils } from '@tod/svs-common-lib';
import * as moment from 'moment';


@Component({
  selector: 'uea-disscuss-out-in',
  templateUrl: './disscuss-out-in.component.html',
  styleUrls: ['../stock.common.scss'],
})
export class DisscussOutInComponent implements OnInit {
  serarchForm: FormGroup;
  inStockForm: FormGroup;
  // 疫苗大类
  vacTypeList = [];
  // 疫苗小类名称
  vacSubClassData = [];
  vacSubClassOptions = [];
  userInfo: any;
  showInStock = false;
  loading = false;
  listOfData = [];
  // 入库人
  stockByList = [];

  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private stockService: StockService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private msg: NzMessageService,
    private povStaffApiSvc: PovStaffApiService,
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
    // 初始化门诊入库操作人
    const params = {
      povCode: this.userInfo.pov,
    };
    this.povStaffApiSvc.queryPovStaff(params, resp => {
      console.log('入库人==', resp);
      if (resp.code === 0) {
        this.stockByList = resp.data;
      }
    });
  }

  ngOnInit() {
    // 拉取疫苗大类的数据
    this.vacTypeList = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    // 拉取疫苗小类的数据
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 查询参数表单
    this.serarchForm = this.fb.group({
      beginTime: [null],
      endTime: [null],
      stockBy: [null],  // 出/入库人
    });
    // 入库表单
    this.inStockForm = this.fb.group({
      vacType: [null],
      vacSubClassCode: [null],
      facilityCode: [null],
      prodBatchCode: [null],
      count: [null],
      memo: [null],
      stockTime: [null],
      stockBy: [null],
    });

  }

  inStock() {
    this.showInStock = true;
  }

  save() {
    this.loading = true;
    // 模拟接口
    setTimeout(() => {
      this.loading = false;
      this.showInStock = false;
    }, 2000);
  }

  toSearch() {
    if (this.loading) return;
    // 判断时间的有效性
    if (this.serarchForm.get('beginTime').value || this.serarchForm.get('endTime').value) {
      if (!this.serarchForm.get('beginTime').value || !this.serarchForm.get('endTime').value) {
        this.msg.warning('请正确填写日期范围');
        return;
      } else {
        let start = this.serarchForm.get('beginTime').value.format('YYYY-MM-DD');
        let end = this.serarchForm.get('endTime').value.format('YYYY-MM-DD');
        if (moment(end).isBefore(start)) {
          this.msg.warning('你输入的起始时间晚于截止时间');
          return;
        }
      }
    }
    // 构建查询参数
    const params = {
      povCode: this.userInfo.pov,
      stockBy: this.serarchForm.value.stockBy,
      stockTimeStart: DateUtils.getFormatDateTime(this.serarchForm.value.beginTime),
      stockTimeEnd: DateUtils.getFormatDateTime(this.serarchForm.value.endTime),
    };
    console.log('查询参数====', params);
    this.loading = true;
    this.stockService.stockDam(params, res => {
      this.loading = false;
      console.log('合议出入库====', res);
      if (res && res.code === 0) {
        this.listOfData = res.data;
      } else {
        this.msg.warning(`${res.msg}`);
      }
    });
  }

  /**
   * 根据疫苗大类选择疫苗小类
   * @param ev
   */
  vaccineBroadHeadingChange(ev) {
    if (!ev) {
      return;
    }
    this.vacSubClassOptions = [];
    this.vacSubClassData.forEach(vac => {
      if (vac.value.substring(0, 2) === ev) {
        this.vacSubClassOptions.push(vac);
      }
    });
  }
  // 重置
  reset() {
    this.loading = false;
    this.listOfData = [];
    this.serarchForm.reset();
  }
}
