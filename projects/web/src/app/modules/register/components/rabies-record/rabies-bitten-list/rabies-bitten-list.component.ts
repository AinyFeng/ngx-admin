import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NzMessageService} from 'ng-zorro-antd';
import {RabiesBittenRecordComponent} from '../rabies-bitten-record/rabies-bitten-record.component';
import {AdultVaccRecordComponent} from '../adult-vacc-record/adult-vacc-record.component';
import {
  BiteService,
  ProfileDataService,
  ProfileChangeService,
  PROFILE_CHANGE_KEY,
  // ADULT_VACCINE_BROADHEADING
} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-f-rabies-bitten-list',
  templateUrl: './rabies-bitten-list.component.html',
  styleUrls: ['./rabies-bitten-list.component.scss']
})
/**
 *
 * @Author ainy
 * @Description 成人疫苗登记列表
 * @Date 2019-10-10
 *
 */
export class RabiesBittenListComponent implements OnInit, OnDestroy {
  data = [];
  adultVaccineList = [];
  profile: any;

  loading = false;

  contentData: any;
  contentDetail: any;
  // adultVaccineBroadheading: any;

  constructor(
    private ref: NbDialogRef<RabiesBittenListComponent>,
    private bitSvc: BiteService,
    private profileDataSvc: ProfileDataService,
    private msg: NzMessageService,
    private dialog: NbDialogService,
    private profileChangeSvc: ProfileChangeService
  ) {
    this.profileDataSvc.getProfileData().subscribe(resp => {
      if (resp) {
        this.profile = resp;
      }
    });
  }

  ngOnInit() {
    this.queryBiteRecord();
    this.queryAdultVaccineRecord();
    // this.bitSvc.getStrategy({'diseaseCategoryCode': 'adult'}, (result) => {
    //   this.adultVaccineBroadheading = result.data;
    // });
  }

  ngOnDestroy(): void {
    this.profileChangeSvc.setProfileChange(PROFILE_CHANGE_KEY.RABIES);
  }

  onClose() {
    this.ref.close();
  }

  /*
   * 查询成人疫苗登记所有的记录列表
   * */
  queryAdultVaccineRecord() {
    if (!this.profile) return;
    this.loading = true;
    let query = {
      profileCode: this.profile['profileCode']
    };
    this.adultVaccineList = [];
    this.bitSvc.queryPavrVaccineRecord(query, resp => {
      this.loading = false;
      console.log('成人记录查询结果', resp);
      if (resp.code === 0) {
        this.adultVaccineList = resp.data;
      }
    });
  }

  queryBiteRecord() {
    if (!this.profile) return;
    this.loading = true;
    let query = {
      profileCode: this.profile['profileCode']
    };
    this.bitSvc.queryBiteRecord(query, resp => {
      this.loading = false;
      this.resetData();
      console.log('犬伤查询结果', resp);
      if (
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp.data.length === 0
      ) {
        return;
      }
      this.data = resp.data;
    });
  }

  /**
   *
   * @Author sun
   * @Description 更新犬伤疫苗登记记录
   * @Date 2019-10-10
   *
   */
  update(data: any) {
    this.dialog
      .open(RabiesBittenRecordComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          data: data
        }
      })
      .onClose.subscribe(resp => {
      if (resp) {
        this.queryBiteRecord();
      }
    });
  }

  /**
   *
   * @Author ainy
   * @Description 删除犬伤疫苗登记列表
   * @Date 2019-10-10
   *
   */
  delete(data: any) {
    console.log('data', data);
    const rabiesCode = data['rabiesCode'];
    this.bitSvc.deleteBiteRecord(rabiesCode, resp => {
      console.log('删除犬伤记录', resp);
      if (
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp['data'] !== 1
      ) {
        this.msg.error('操作失败，请重试');
        return;
      }
      this.msg.success('删除成功');
      this.queryBiteRecord();
    });
  }

  /*
   * 更新成人疫苗登记记录
   * */
  updateAdult(data: any) {
    this.dialog
      .open(AdultVaccRecordComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          data: data,
          // adultVaccineOptions: this.adultVaccineBroadheading
        }
      })
      .onClose.subscribe(resp => {
      if (resp) {
        this.queryAdultVaccineRecord();
      }
    });
  }

  /**
   * @Author ainy
   * @Description 删除成人疫苗登记列表
   * @Date 2019-10-10
   */
  deleteAdult(data: any) {
    const code = data['registCode'];
    this.bitSvc.deletePavrVaccineRecord(code, resp => {
      console.log('删除成人记录', resp);
      if (
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp['data'] !== 1
      ) {
        this.msg.error(resp.msg);
        return;
      }
      this.msg.warning('删除成人登记记录成功');
      this.queryAdultVaccineRecord();
    });
  }

  resetData() {
    this.data = [];
  }

  // 添加犬伤记录
  addRecord() {
    this.dialog
      .open(RabiesBittenRecordComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false
      })
      .onClose.subscribe(resp => {
      this.queryBiteRecord();
    });
  }

  // 添加成人登记记录
  addAdultVaccRecord() {
    this.dialog
      .open(AdultVaccRecordComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        // context: {
        //   adultVaccineOptions: this.adultVaccineBroadheading
        // }
      })
      .onClose.subscribe(resp => {
      if (resp) {
        this.queryAdultVaccineRecord();
      }
    });
  }

  select(d) {
    this.contentData = d;
  }

  /*selectDetail(d) {
    this.contentDetail = d;
  }*/
}
