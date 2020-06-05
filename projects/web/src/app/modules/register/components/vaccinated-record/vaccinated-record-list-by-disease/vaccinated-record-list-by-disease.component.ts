import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DiseaseCategoryInitService } from '@tod/svs-common-lib';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'uea-vaccinated-record-list-by-disease',
  templateUrl: './vaccinated-record-list-by-disease.component.html',
  styleUrls: ['./vaccinated-record-list-by-disease.component.scss']
})
export class VaccinatedRecordListByDiseaseComponent implements OnInit {

  /**
   * 疾病大类数据
   */
  diseaseCategoryData = [];
  vaccinateRecords = [];

  @Input('vaccinateRecords')
  set setVaccinateRecords(records: any) {
    if (!records) return;
    this._vaccinateRecords$.next(records);
  }

  _vaccinateRecords$ = new BehaviorSubject<any>([]);
  @Input()
  profile: any;
  @Output()
  readonly _onQueryAgreement = new EventEmitter<void>();
  @Output()
  readonly _onUpdateRecord = new EventEmitter<void>();
  /**
   * 详情展示
   */
  showDetailVac: any;

  /**
   * 预约详情
   */
  reservationDetail: any;
  /**
   * 预约记录
   */
  reservationRecords = [];

  @Input('reservationRecords')
  set setReservationRecords(records: any) {
    if (!records) return;
    this._reservationRecords$.next(records);
  }

  _reservationRecords$ = new BehaviorSubject<any>([]);
  /**
   * 初始表格
   */
  vacRecordsDataBaseTable = [];

  evenWid = 28;

  constructor(
    private diseaseCategorySvc: DiseaseCategoryInitService,
  ) {
    this.diseaseCategoryData = this.diseaseCategorySvc.getDiseaseCategoryData()
      .sort((a, b) => a.categoryCode - b.categoryCode);
    this.diseaseCategoryData.forEach(d => {
      this.vacRecordsDataBaseTable.push({
        vaccineBroadHeadingCode: d['categoryCode'], // 大类code
        vaccineBroadHeadingName: d['categoryName'], // 大类名称
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null, // 批号
        rowspan: 1
      });
    });
    console.log(this.vacRecordsDataBaseTable);
  }

  ngOnInit() {
    combineLatest([this._vaccinateRecords$, this._reservationRecords$])
      .subscribe(([vaccinateRecords, reservationRecords]) => {
        this.formatDisplayData(vaccinateRecords, reservationRecords);
      });
  }

  /**
   * 重新组合展示数据
   * @param vaccinateRecords 接种记录
   * @param reservationRecords 预约记录
   */
  formatDisplayData(vaccinateRecords: any[], reservationRecords: any[]) {
    for (let i = 0; i < vaccinateRecords.length; i++) {
      const rec = vaccinateRecords[i];
      const recSubclassCode = rec['vaccineSubclassCode'];
      for (let j = 0; j < reservationRecords.length; j++) {
        const reservation = reservationRecords[j];
        const resSubclassCode = reservation['subclassCode'];
        if (recSubclassCode === resSubclassCode) {
          rec['reserved'] = '1';
          rec['channel'] = reservation['channel'];
          rec['reservationDate'] =
            reservation['reservationDate'];
          rec['finalDate'] = reservation['finalDate'];
          rec['status'] = reservation['status'];
        }
      }
    }
    console.log(vaccinateRecords);
  }

  /**
   * 查询告知书
   * @param record
   */
  queryAgreement(record) {
    this._onQueryAgreement.emit(record);
  }

  /**
   * 展示疫苗接种记录详情
   * @param record
   */
  showDetail(record) {
    this.showDetailVac = record;

  }

  /**
   * 设置该接种记录的预约信息
   * @param record
   */
  setReservationDetail(record) {
    this.reservationDetail = record;
  }

  /**
   * 更新接种记录
   * @param record
   */
  updateRecord(record) {
    this._onUpdateRecord.emit(record);
  }
}
