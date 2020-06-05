import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { StockService, VaccBroadHeadingDataService, VaccineSubclassInitService, DateUtils } from '@tod/svs-common-lib';
import * as moment from 'moment';
@Component({
  selector: 'uea-transffer-out-in',
  templateUrl: './transffer-out-in.component.html',
  styleUrls: ['../stock.common.scss']
})
export class TransfferOutInComponent implements OnInit {
  form: FormGroup;
  vacTypeList = [];
  vacSubClassOptions = [];
  // 疫苗小类名称
  vacSubClassData = [];
  userInfo: any;
  listOfData = [];
  loading = false;

  constructor(
    private stockService: StockService,
    private user: UserService,
    private fb: FormBuilder,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private msg: NzMessageService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }
  ngOnInit() {
    // 拉取疫苗大类的数据
    this.vacTypeList = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    // 拉取疫苗小类的数据
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();

    this.form = this.fb.group({
      beginTime: [null],
      endTime: [null],
      batchCode: [null]
    });
  }

  // 查询
  toSearch() {
    if (this.loading) return;
    // 判断时间的有效性
    if (this.form.get('beginTime').value || this.form.get('endTime').value) {
      if (
        !this.form.get('beginTime').value ||
        !this.form.get('endTime').value
      ) {
        this.msg.warning('请正确填写日期范围');
        return;
      } else {
        let start = this.form.get('beginTime').value.format('YYYY-MM-DD');
        let end = this.form.get('endTime').value.format('YYYY-MM-DD');
        if (moment(end).isBefore(start)) {
          this.msg.warning('你输入的起始时间晚于截止时间');
          return;
        }
      }
    }
    const params = {
      povCode: this.userInfo.pov, // 接种单位编码
      batchCode: this.form.value.batchCode,
      // stockBy: '1000',
      stockTimeStart: DateUtils.getFormatDateTime(this.form.value.beginTime),
      stockTimeEnd: DateUtils.getFormatDateTime(this.form.value.endTime)
    };
    console.log('参数', params);
    this.loading = true;
    this.stockService.stockAllot(params, res => {
      console.log('平级调拨出入库====', res);
      this.loading = false;
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
    this.form.get('vacSubClassCode').setValue(null);
    this.vacSubClassData.forEach(vac => {
      if (vac.value.substring(0, 2) === ev) {
        this.vacSubClassOptions.push(vac);
      }
    });
  }
  // 重置
  reset() {
    this.form.reset();
    this.loading = false;
    this.listOfData = [];
  }
}
