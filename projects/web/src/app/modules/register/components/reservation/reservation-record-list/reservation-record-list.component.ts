import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '@tod/uea-auth-lib';
import { Subscription } from 'rxjs';
import {
  ProfileDataService,
  WorkDatetimeService,
  ProfileChangeService,
  VaccinateReservationDataService,
  ReservationRecordService,
  PROFILE_CHANGE_KEY
} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-reservation-record-list',
  templateUrl: './reservation-record-list.component.html',
  styleUrls: ['./reservation-record-list.component.scss']
})
export class ReservationRecordListComponent implements OnInit {
  private readonly RESERVATION_STATUS_TO_SIGN = '0';

  private readonly RESERVATION_STATUS_CONFIRMED = '1';

  @Output()
  readonly reservationRecordCount = new EventEmitter();

  // 档案信息
  profile: any;

  // 用户信息
  userInfo: any;

  // pageSize
  pageSize = 5;

  private readonly subscription: Subscription[] = [];
  // 预约记录列表
  reservationRecordList = [];

  reservationRecordListCount = 0;

  constructor(
    private userSvc: UserService,
    private profileSvc: ProfileDataService,
    private workDatetimeSvc: WorkDatetimeService,
    private profileChangeSvc: ProfileChangeService,
    private vacReservationSvc: VaccinateReservationDataService,
    private reservationSvc: ReservationRecordService
  ) {
    const sub = this.profileSvc.getProfileData().subscribe(resp => {
      this.profile = resp;
      this.resetReservationTable();
      if (resp) {
        this.queryReservationRecord();
      }
    });
    this.subscription.push(sub);
    const sub1 = this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
    });
    this.subscription.push(sub1);
  }

  ngOnInit() {
    this.profileChangeSvc.getProfileChange().subscribe(key => {
      if (key === PROFILE_CHANGE_KEY.RESERVATION) {
        this.resetReservationTable();
        this.queryReservationRecord();
      }
    });
  }

  /**
   * 查询预约记录
   */
  queryReservationRecord(page = 1) {
    if (!this.profile || !this.userInfo) return;
    const query = {
      profileCode: this.profile['profileCode'],
      povCode: this.userInfo.pov,
      pageEntity: {
        page: page,
        pageSize: 100,
        sortBy: ['reservationDate,desc']
      }
    };
    this.reservationRecordCount.emit(this.reservationRecordList.length);
    this.reservationSvc.queryRecordDetail(query, resp => {
      // console.log('查询----------------预约记录返回值', resp);
      if (resp.code === 0) {
        this.reservationRecordList = resp.data.sort((a, b) => {
          return b['createDate'] - a['createDate'];
        });
        this.reservationRecordListCount = resp.data.length;
        const validReservationRecord = resp.data.filter(d => d.status === '0' || d.status === '1');
        this.reservationRecordCount.emit(this.reservationRecordListCount);
        this.vacReservationSvc.setVaccinateReservation(validReservationRecord);
      }
    });
  }

  resetReservationTable() {
    this.reservationRecordList = [];
    this.reservationRecordCount.emit(0);
  }

  /*
   * 取消
   * */
  cancelReservation(id: string) {
    if (!id) return;
    const query = {
      reservationDetailSerial: id
    };
    this.reservationSvc.cancelReservationRecord(query, resp => {
      console.log(resp);
      if (resp && resp.hasOwnProperty('data')) {
        if (resp.data === 'SUCCESS') {
          this.queryReservationRecord(1);
        }
      }
    });
  }
}
