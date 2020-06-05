import { Component, OnDestroy, OnInit } from '@angular/core';
import { drawerAnimation } from '../../../../@uea/animations/drawer.animation';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  ApiAdminReservationSearchService,
  CommunityDataService, DateUtils,
  DicDataService, FILE_TYPE, FILE_TYPE_SUFFIX, FileDownloadUtils,
  PovStaffInitService, ReservationRecordService, StockExportService,
  VaccineSubclassInitService
} from '@tod/svs-common-lib';
import { ConfigService } from '@ngx-config/core';

import * as moment from 'moment';
import { Moment } from 'moment';
import { UserService } from '@tod/uea-auth-lib';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ReservationAddComponent } from '../../../sharedcomponent/components/reservation-add/reservation-add.component';
import { ConfirmDialogComponent } from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'uea-reservation-search',
  templateUrl: './reservation-search.component.html',
  styleUrls: ['../admin.common.scss'],
  animations: [
    drawerAnimation
  ],
  providers: []
})
export class ReservationSearchComponent implements OnInit, OnDestroy {

  reservationForm: FormGroup;
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  listOfData: any[] = [];
  // 疫苗小类
  vacSubClassData = [];
  // 所有用户信息
  userList = [];
  // 预约状态选项
  statusOptions = [
    { value: '0', label: '待确认' },
    { value: '1', label: '已确认' },
    { value: '2', label: '已完成' },
    { value: '3', label: '已作废' }
  ];

  currentDate = moment();

  /**
   * 预约类型
   */
  reservationTypeOptions = [
    { value: '0', label: 'POV预约' },
    { value: '1', label: '微信预约' },
    { value: '2', label: 'APP预约' }
  ];

  /**
   * 用户登录信息
   */
  userInfo: any;
  /**
   * 档案编码查询参数
   */
  searchProfileCode: string;

  private subscription: Subscription[] = [];

  constructor(
    private thisApiService: ApiAdminReservationSearchService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private dicSvc: DicDataService,
    private communitySvc: CommunityDataService,
    private configSvc: ConfigService,
    private userSvc: UserService,
    private staffInitSvc: PovStaffInitService,
    private activateRoute: ActivatedRoute,
    private exportSvc: StockExportService,
    private modalSvc: NbDialogService,
    private modalSer: NzModalService,
    private reservationApiSvc: ReservationRecordService,
    private modalService: NzModalService
  ) {
    const sub = this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
    this.subscription.push(sub);
    activateRoute.queryParams.subscribe(qp => {
      if (qp.hasOwnProperty('profileCode') && qp['profileCode'] && qp['profileCode'] !== '') {
        this.searchProfileCode = qp['profileCode'].trim();
      }
    });
  }

  ngOnInit() {
    // 获取疫苗小类
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取医护人员信息
    this.userList = this.staffInitSvc.getPovStaffData().filter(item => item.number !== undefined);
    this.reservationForm = this.fb.group({
      name: [null], // 姓名
      profileCode: [this.searchProfileCode ? this.searchProfileCode : null], // 档案编号
      reservationStartDate: [null], // 预约日期起
      reservationEndDate: [null], // 预约日期止
      createDateStart: [],
      createDateEnd: [],
      vaccines: [null], // 疫苗小类
      createBy: [null], // 创建人
      status: [], // 预约状态
      channel: [null] // 预约渠道
    });
    this.searchData();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  /*  /!**
     * 过滤预约日期 - 起
     * @param d
     *!/
    filterReservationStartDate = (d: Moment) => {
      const endDate = this.reservationForm.get('reservationEndDate').value;
      if (endDate) {
        return d <= endDate;
      }
      return d <= this.currentDate;

    }

    /!**
     * 过滤预约日期 - 止
     * @param d
     *!/
    filterReservationEndDate = (d: Moment) => {
      const startDate = this.reservationForm.get('reservationStartDate').value;
      if (startDate) {
        return d >= startDate && d <= this.currentDate;
      }
      return d <= this.currentDate;
    }*/

  /**
   * 过滤创建日期 - 起
   * @param d
   */
  filterCreateStartDate = (d: Moment) => {
    const endDate = this.reservationForm.get('createDateEnd').value;
    if (endDate) {
      return d <= endDate;
    }
    return d <= this.currentDate;
  }

  /**
   * 过滤创建日期 - 止
   * @param d
   */
  filterCreateEndDate = (d: Moment) => {
    const startDate = this.reservationForm.get('createDateStart').value;
    if (startDate) {
      return d >= startDate && d <= this.currentDate;
    }
    return d <= this.currentDate;
  }

  /*查询数据*/
  searchData(page = 1) {
    if (!this.userInfo) return;
    this.pageIndex = page;
    // 如果再查询的时候,则停止查询并禁止按钮不能点击
    if (this.loading) return;
    if (this.reservationForm.get('reservationStartDate').value && this.reservationForm.get('reservationEndDate').value) {
      const start = this.reservationForm.get('reservationStartDate').value.format('YYYY-MM-DD');
      const end = this.reservationForm.get('reservationEndDate').value.format('YYYY-MM-DD');
      if (moment(end).isBefore(start)) {
        this.msg.warning('预约日期范围有误，请重新选择');
        return;
      }
    }
    if (this.reservationForm.get('createDateStart').value && this.reservationForm.get('createDateEnd').value) {
      const start = this.reservationForm.get('createDateStart').value.format('YYYY-MM-DD');
      const end = this.reservationForm.get('createDateEnd').value.format('YYYY-MM-DD');
      if (moment(end).isBefore(start)) {
        this.msg.warning('创建日期范围有误，请重新选择');
        return;
      }
    }
    // 查询条件组装
    let param = {
      name: this.reservationForm.get('name').value ? this.reservationForm.get('name').value : null,
      vaccines: this.reservationForm.get('vaccines').touched ? this.reservationForm. get('vaccines').value : null,
      profileCode: this.reservationForm.get('profileCode').value ? this.reservationForm.get('profileCode').value : null,
      reservationDate: {
        start: this.reservationForm.get('reservationStartDate').value ? this.reservationForm.get('reservationStartDate').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
        end: this.reservationForm.get('reservationEndDate').value ? this.reservationForm.get('reservationEndDate').value.format('YYYY-MM-DD') + ' 23:59:59' : null
      },
      createDate: {
        start: this.reservationForm.get('createDateStart').value ? this.reservationForm.get('createDateStart').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
        end: this.reservationForm.get('createDateEnd').value ? this.reservationForm.get('createDateEnd').value.format('YYYY-MM-DD') + ' 23:59:59' : null
      },
      status: this.reservationForm.get('status').touched ? this.reservationForm. get('status').value : null,
      channel: this.reservationForm.get('channel').touched ? this.reservationForm. get('channel').value : null,
      povCode: this.userInfo.pov,
      createBy: this.reservationForm.get('createBy').touched ? this.reservationForm. get('createBy').value : null,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };

    console.log('参数', param);
    this.loading = true;
    this.listOfData = [];
    // 调用apiService查询数据
    this.reservationApiSvc.queryAndCountRecordWithDetail(param, (resp) => {
      console.info(resp);
      this.loading = false;
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
      }
      // 解析count数据
      if (searchDataCount && searchDataCount.code === 0) {
        this.total = searchDataCount.data[0].count;
      }
    });
  }

  // 导出 StockExportService
  export() {
    if (this.listOfData.length === 0) {
      this.modalSer.warning({
        nzTitle: '提示',
        nzContent: '没有数据，请先执行查询操作',
        nzMaskClosable: true
      });
      return;
    }
    this.modalSvc.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: '确认导出',
        content: '是否确认导出此报表?'
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        const params = {
          name: this.reservationForm.get('name').value ? this.reservationForm.get('name').value : null,
          vaccines: this.reservationForm.get('vaccines').touched ? this.reservationForm. get('vaccines').value : null,
          profileCode: this.reservationForm.get('profileCode').value ? this.reservationForm.get('profileCode').value : null,
          reservationDate: {
            start: this.reservationForm.get('reservationStartDate').value ? this.reservationForm.get('reservationStartDate').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
            end: this.reservationForm.get('reservationEndDate').value ? this.reservationForm.get('reservationEndDate').value.format('YYYY-MM-DD') + ' 23:59:59' : null
          },
          createDate: {
            start: this.reservationForm.get('createDateStart').value ? this.reservationForm.get('createDateStart').value.format('YYYY-MM-DD') + ' 00:00:00' : null,
            end: this.reservationForm.get('createDateEnd').value ? this.reservationForm.get('createDateEnd').value.format('YYYY-MM-DD') + ' 23:59:59' : null
          },
          status: this.reservationForm.get('status').touched ? this.reservationForm. get('status').value : null,
          channel: this.reservationForm.get('channel').touched ? this.reservationForm. get('channel').value : null,
          povCode: this.userInfo.pov,
          createBy: this.reservationForm.get('createBy').touched ? this.reservationForm. get('createBy').value : null,
          pageEntity: {
            page: this.pageIndex,
            pageSize: this.pageSize
          }
        };
        // console.log('params2',params);
        this.loading = true;
        this.exportSvc.excelReservationRecord(params, resp => {
          this.loading = false;
          // console.log(resp);
          FileDownloadUtils.downloadFile(resp, FILE_TYPE.EXCEL2003, '预约记录报表_' + DateUtils.getNewDateTime() + FILE_TYPE_SUFFIX.EXCEL2003);
        });
      }
    });
  }

  // 重置
  reset() {
    this.reservationForm.reset({
      vaccines: [],
      status: [],
      channel: [],
      createBy: []
    });
    this.loading = false;
  }

  /**
   * 修改预约记录，其实就是将当前预约记录删除，重新生成一个新的预约记录
   * @param data
   */
  addReservation(data: any) {
    this.modalSvc.open(ReservationAddComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        profileCode: data['profileCode']
      }
    }).onClose.subscribe(res => {
      console.log(res);
      if (res) {
        this.searchData();
      }
    });
  }

  /**
   * 删除预约记录
   * @param data
   */
  deleteReservation(data: any) {
    if (!data['reservationDetailSerial']) {
      this.modalService.warning({
        nzTitle: '提示',
        nzContent: '数据不完整，无法处理'
      });
      return;
    }
    this.modalService.confirm({
      nzTitle: '<i>消息确认</i>',
      nzContent: '<b>是否作废当前预约记录，当前操作不可恢复</b>',
      nzOnOk: () => {
        const serialCode = data['reservationDetailSerial'];
        this.reservationApiSvc.deleteReservationDetailByCode(serialCode, res => {
          if (res.code === 0) {
            this.searchData();
          }
        });
      }
    });

  }

}
