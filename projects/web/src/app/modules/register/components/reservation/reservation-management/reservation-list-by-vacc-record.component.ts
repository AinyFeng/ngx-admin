import { Component, OnInit } from '@angular/core';
import { DateUtils, ReservationRecordService, VaccinateService } from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { NotifierService } from 'angular-notifier';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ReservationAddComponent } from '../../../../sharedcomponent/components/reservation-add/reservation-add.component';
import { ReservationByVaccDetailListComponent } from '../reservation-management-list/reservation-by-vacc-detail-list.component';

@Component({
  selector: 'uea-reservation-list-by-vacc-record',
  templateUrl: './reservation-list-by-vacc-record.component.html',
  styleUrls: ['./reservation-list-by-vacc-record.component.scss']
})
export class ReservationListByVaccRecordComponent implements OnInit {

  /**
   * 可预约列表数据
   */
  listData = [];
  /**
   * 用户信息
   */
  userInfo: any;

  today = new Date();

  loading = false;

  pageIndex = 1;

  /**
   * 预约记录
   */
  reservationData = [];

  constructor(private vcrApi: VaccinateService,
              private userSvc: UserService,
              private ref: NbDialogRef<ReservationListByVaccRecordComponent>,
              private notifier: NotifierService,
              private dialogService: NbDialogService,
              private reservationApi: ReservationRecordService) {

  }

  ngOnInit() {
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      if (user) {
        this.queryProfile();
      }
    });
  }

  queryProfile() {
    if (!this.userInfo) return;
    const query = {
      timeRange: {
        start: DateUtils.formatStartDate(this.today),
        end: DateUtils.formatEndDate(this.today)
      },
      actualVaccinatePovCode: this.userInfo.pov
    };
    this.listData = [];
    this.loading = true;
    this.vcrApi.queryVaccinatedProfileByPeriodTime(query, res => {
      this.loading = false;
      if (res.code === 0) {
        this.listData = res.data;
        if (this.listData.length === 0) {
          this.notifier.notify('success', '没有查到数据');
        }
      } else {
        this.notifier.notify('error', '查询失败');
      }
    });
  }

  onClose() {
    this.ref.close();
  }

  /**
   * 查看预约记录
   * @param data
   */
  queryReservation(data: any) {
    const query = {
      povCode: this.userInfo.pov,
      profileCode: data['profileCode'],
      createDate: {
        start: DateUtils.formatStartDate(new Date()),
        end: DateUtils.formatEndDate(new Date())
      },
      pageEntity: {
        page: 1,
        pageSize: 200
      }
    };
    this.reservationApi.queryRecordWithDetail(query, res => {
      if (res.code === 0) {
        console.log(res.data);
        this.reservationData = res.data;
        this.dialogService.open(ReservationByVaccDetailListComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: false,
          context: {
            reservationData: this.reservationData
          }
        });
      }
    });
  }

  /**
   * 添加预约记录，其实就是将当前预约记录删除，重新生成一个新的预约记录
   * @param data
   */
  addReservation(data: any) {
    this.dialogService.open(ReservationAddComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        profileCode: data['profileCode']
      }
    }).onClose.subscribe(res => {
      console.log(res);
      if (res) {
        this.queryProfile();
      }
    });
  }

}
