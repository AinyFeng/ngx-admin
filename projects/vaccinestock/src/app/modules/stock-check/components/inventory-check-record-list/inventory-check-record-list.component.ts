import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DateUtils,
  PovStaffInitService,
  VaccineSubclassInitService,
  VacStockCheckPlanApiService
} from '@tod/svs-common-lib';
import { CandyDate, NzModalService } from 'ng-zorro-antd';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-daily-check-record-list',
  templateUrl: './inventory-check-record-list.component.html',
  styleUrls: ['./inventory-check-record-list.component.scss']
})
export class InventoryCheckRecordListComponent implements OnInit {

  queryForm: FormGroup;

  today = new Date();

  /**
   * 疫苗名称 - 小类编码
   */
  subclassCodeOptions = [];
  /**
   * 职员表选择项
   */
  povStaffOptions = [];

  /**
   * 盘点记录
   */
  checkRecordData = [];
  /**
   * 数据总数
   */
  total = 0;
  /**
   * 页码
   */
  pageIndex = 1;

  userInfo: any;

  loading = false;

  constructor(private fb: FormBuilder,
              private subclassDataSvc: VaccineSubclassInitService,
              private povStaffInitSvc: PovStaffInitService,
              private vacPlanApiSvc: VacStockCheckPlanApiService,
              private modalSvc: NzModalService,
              private userSvc: UserService
  ) {
    this.queryForm = fb.group({
      vaccineSubclassCode: [], // 疫苗小类编码
      checkCode: [], // 盘点编号
      operator: [], // 操作人
      outboundDate: [], // 盘点时间起
      outboundDateBreak: [], // 盘点日期止
    });
    this.subclassCodeOptions = this.subclassDataSvc.getVaccineSubClassData();
    this.povStaffOptions = this.povStaffInitSvc.getPovStaffData();
  }

  ngOnInit() {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  /**
   * 日期过滤
   * @param d
   */
  filterDate = (d: Date) => {
    return d > this.today;
  }

  query(page = 1, checkCode?: string) {
    if (!this.userInfo) return;
    console.log(checkCode);
    if (checkCode) {
      this.queryForm.get('checkCode').patchValue(checkCode);
    }
    const query = this.queryForm.value;
    const outboundDate = this.queryForm.get('outboundDate').value;
    const outboundDateBreak = this.queryForm.get('outboundDateBreak').value;
    if (outboundDate && outboundDateBreak) {
      if (outboundDate > outboundDateBreak) {
        this.modalSvc.warning({
          nzTitle: '提示',
          nzContent: '盘点开始时间不可大于结束时间，请重新选择',
          nzMaskClosable: true
        });
      }
      return;
    }
    query['outboundDate'] = DateUtils.formatStartDate(query['outboundDate']);
    query['outboundDateBreak'] = DateUtils.formatStartDate(query['outboundDateBreak']);
    query['storeCode'] = this.userInfo.pov;
    this.pageIndex = page;
    this.checkRecordData = [];
    this.total = 0;
    this.loading = true;
    console.log(query);
    this.vacPlanApiSvc.queryCheckPlanRecordAndCount(query, ([queryData, countData]) => {
      console.log(queryData, countData);
      this.loading = false;
      if (queryData.code === 0) {
        this.checkRecordData = queryData.data;
      }
      if (countData.code === 0) {
        this.total = countData.data[0]['count'];
      }
    });
  }

  reset() {
    this.queryForm.reset();
  }

}
