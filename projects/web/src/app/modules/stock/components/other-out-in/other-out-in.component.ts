import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@tod/uea-auth-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { StockService, VaccBroadHeadingDataService, VaccineSubclassInitService, DateUtils } from '@tod/svs-common-lib';
import * as moment from 'moment';
@Component({
  selector: 'uea-other-out-in',
  templateUrl: './other-out-in.component.html',
  styleUrls: ['../stock.common.scss']
})
export class OtherOutInComponent implements OnInit {
  // 疫苗大类
  vacTypeList = [];
  // 疫苗小类名称
  vacSubClassData = [];
  vacSubClassOptions = [];
  userInfo: any;
  showInStock = false;
  loading = false; // 显示入库的加载框
  listOfData = [];
  outStockform: FormGroup;
  inStockForm: FormGroup;

  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private stockService: StockService,
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

    this.outStockform = this.fb.group({
      startTime: [null],
      endTime: [null],
      batchCode: [null],
      facilityCode: [null], // 冷藏设备编码
      stockBy: [null] // 出库人
    });

    this.inStockForm = this.fb.group({
      vacType: [null],
      vacSubClassCode: [null],
      facilityCode: [null],
      prodBatchCode: [null],
      count: [null],
      memo: [null],
      stockTime: [null],
      stockBy: [null]
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
    if (
      this.outStockform.get('startTime').value ||
      this.outStockform.get('endTime').value
    ) {
      if (
        !this.outStockform.get('startTime').value ||
        !this.outStockform.get('endTime').value
      ) {
        this.msg.warning('请正确填写日期范围');
        return;
      } else {
        let start = this.outStockform
          .get('startTime')
          .value.format('YYYY-MM-DD');
        let end = this.outStockform.get('endTime').value.format('YYYY-MM-DD');
        if (moment(end).isBefore(start)) {
          this.msg.warning('你输入的起始时间晚于截止时间');
          return;
        }
      }
    }
    const params = {
      povCode: this.userInfo.pov,
      stockBy: this.outStockform.value.stockBy,
      facilityCode: this.outStockform.value.facilityCode,
      batchCode: this.outStockform.value.batchCode,
      stockTimeStart: DateUtils.getFormatDateTime(
        this.outStockform.value.startTime
      ),
      stockTimeEnd: DateUtils.getFormatDateTime(this.outStockform.value.endTime)
    };
    console.log('参数====', params);
    this.loading = true;
    this.stockService.stockOther(params, res => {
      this.loading = false;
      console.log('其它出入库=====', res);
      if (res.code === 0) {
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

  transferTime(time) {
    return DateUtils.getFormatDateTime(time) || '';
  }
}
