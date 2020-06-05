import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { NzInputDirective, NzMessageService } from 'ng-zorro-antd';
import {
  CommonUtils,
  DateUtils,
  ProfileDataService,
  VaccinateService,
  VaccineSubclassInitService
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { SelectHospitalComponent } from '../../common/select-hospital/select-hospital.component';
import { SaveVaccinateRecordConfirmDialogComponent } from '../save-vaccinate-record-confirm-dialog/save-vaccinate-record-confirm-dialog.component';

@Component({
  selector: 'uea-batch-dosage-record',
  templateUrl: './batch-dosage-record.component.html',
  styleUrls: ['./batch-dosage-record.component.scss']
})
export class BatchDosageRecordComponent implements OnInit {

  editId: string | null;
  /**
   * 点击的时候选择的行数据
   */
  clickRowData = [];
  @Input()
  vaccinateRecords = [];

  /**
   * 小类展示的列表数据
   */
  subclassTableData = [];

  @Input()
  profile: any;

  @ViewChild(NzInputDirective, { static: false, read: ElementRef }) inputElement: ElementRef;

  /**
   * 小类编码数据
   */
  subclassData = [];
  /**
   * 用户信息
   */
  userInfo: any;
  /**
   * 加载状态
   */
  loading = false;
  /**
   * 批量补录pov
   */
  selectPov = '1';
  /**
   * 已选择的pov，从对话框中选择的
   */
  selectedPovFromDialogValue: string;

  selectedPovFromDialogText: string;

  /**
   * 当前正在编辑的行
   */
  editingRowData = [];
  /**
   * 当前日期
   */
  currentDate = new Date(DateUtils.formatEndDate(new Date()));

  constructor(
    private ref: NbDialogRef<BatchDosageRecordComponent>,
    private subclassSvc: VaccineSubclassInitService,
    private userSvc: UserService,
    private vaccinateApiSvc: VaccinateService,
    private dialogSvc: NbDialogService,
    private msg: NzMessageService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {
    this.subclassData = this.subclassSvc.getVaccineSubClassData().sort((a, b) => a.value - b.value);
    this.initTable();
  }

  initTable() {
    const subclassTable = [];
    this.subclassData.forEach(subclass => {
      const records = [];
      for (let i = 1; i <= 6; i++) {
        records.push({
          id: subclass.value + i,
          name: subclass.label,
          vaccinateTime: null,
          actualVaccinatePovCode: null,
          vaccinateInjectNumber: i
        });
      }
      subclassTable.push({
        name: subclass.label,
        value: subclass.value,
        records: records
      });
    });
    this.initVacRecordData(subclassTable);
  }

  initVacRecordData(subclassTable: any[]) {
    this.subclassTableData = [];
    subclassTable.forEach(tableData => {
      // 获取小类编码
      const subclassCode = tableData['value'];
      const records = tableData['records'];
      records.forEach(rec => {
        const vaccinateInjectNumber = rec['vaccinateInjectNumber'];
        const vacRecord = this.getVacRecordBySubclassCode(subclassCode, vaccinateInjectNumber);
        if (vacRecord !== undefined) {
          rec['vaccinateTime'] = DateUtils.formatToDate(vacRecord['vaccinateTime']);
          rec['actualVaccinatePovCode'] = vacRecord['actualVaccinatePovCode'];
        }
      });
    });
    this.subclassTableData = subclassTable;
  }

  /**
   * 根据小类编码和接种针次获取接种记录
   * @param subclassCode
   * @param vaccinateInjectNumber
   */
  getVacRecordBySubclassCode(subclassCode: string, vaccinateInjectNumber: number) {
    return this.vaccinateRecords.find(rec => rec['vaccinateInjectNumber'] === vaccinateInjectNumber
      && rec['vaccineSubclassCode'] === subclassCode);
  }

  onClose(ev?: boolean) {
    this.ref.close(ev);
  }

  /**
   * 监听表格点击事件
   * @param e
   */
  @HostListener('window:click', ['$event'])
  handleClick(e: MouseEvent): void {
    if (this.checkInputDateInValid()) {
      return;
    }
    if (this.editId && this.inputElement && this.inputElement.nativeElement !== e.target) {
      this.editId = null;
    }
  }

  /**
   * 编辑表格
   * @param id
   * @param event
   * @param records
   */
  startEdit(id: string, event: MouseEvent, records: any[]): void {
    event.preventDefault();
    event.stopPropagation();
    // console.log(!!this.editId, id);
    if (!!this.editId && this.checkInputDateInValid() && id !== this.editId) {
      this.msg.warning('接种日期必须要大于上一针的时间，且不能大于当前日期，请重新输入');
      return;
    }
    this.clickRowData = records;
    const record = records.find(rec => rec.id === id);
    if (record['vaccinateTime'] && !record['actualVaccinatePovCode']) {
      this.editId = id;
      return;
    }

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      const vaccinateTime = rec['vaccinateTime'];
      if (!vaccinateTime) {
        this.editId = rec['id'];
        return;
      }
    }
  }

  /**
   * 检查输入值得有效性
   * 有效 - false
   * 无效 - true
   */
  checkInputDateInValid(id?: string) {
    if (!this.editId || this.clickRowData.length === 0) return false;
    const editData = this.clickRowData.find(d => d['id'] === this.editId);
    // console.log(editData);
    const index = this.clickRowData.findIndex(d => d['id'] === this.editId);
    if (editData['vaccinateTime'] === null || editData['vaccinateTime'] === '') return false;
    const vaccinateTime = new Date(editData['vaccinateTime']);
    if (!this.isValidDate(vaccinateTime)) return true;
    for (let i = 0; i < index; i++) {
      const d = this.clickRowData[i];
      const compareVaccinateTime = new Date(d['vaccinateTime']);
      if (vaccinateTime <= compareVaccinateTime || vaccinateTime > this.currentDate) {
        return true;
      }
    }
    return false;
  }

  isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }

  saveRecords() {
    if (!this.profile) return;
    this.loading = true;
    const addedVacRecords = this.findAddedVacRecords();
    this.vaccinateApiSvc.addVaccinateRecordBatch(addedVacRecords, resp => {
      this.loading = false;
      console.log('批量接种返回值', resp);
      if (resp.code === 0 && resp.data.length === 0) {
        this.msg.success('补录接种记录成功');
        this.ref.close(true);
      } else if (resp.code === 0 && resp.data.length > 0) {
        this.msg.warning('补录接种记录出现异常');
        const confirmRecords = resp.data;
        this.dialogSvc.open(SaveVaccinateRecordConfirmDialogComponent, {
          hasBackdrop: true,
          closeOnEsc: false,
          closeOnBackdropClick: false,
          context: {
            records: confirmRecords
          }
        }).onClose.subscribe(confirm => {
          if (confirm) {
            this.vaccinateApiSvc.addVaccinateRecordBatch(confirmRecords, confirmResp => {
              if (confirmResp.code === 0) {
                this.msg.success('操作成功');
                this.onClose(true);
              }
            });
          }
        });
      }
    });
  }

  findAddedVacRecords() {
    const addedVacRecords = [];
    this.subclassTableData.forEach(data => {
      const records = data['records'];
      const subclassCode = data['value'];
      const broadHeadingCode = subclassCode.substring(0, 2);
      records.forEach(rec => {
        if (!rec['actualVaccinatePovCode'] && rec['vaccinateTime']) {
          addedVacRecords.push({
            globalRecordNumber: CommonUtils.uuid(32, ''),
            registerRecordNumber: CommonUtils.uuid(32, ''),
            profileCode: this.profile['profileCode'],
            vaccinateStatus: '3', // 状态为 已接种
            vaccineBroadHeadingCode: broadHeadingCode,
            vaccineSubclassCode: subclassCode,
            dataSourceType: '2', // 数据来源 - 2 - 补录
            vaccinateTime: DateUtils.formatStartDate(new Date(rec['vaccinateTime'])),
            managePovCode: this.userInfo.pov,
            vaccinateDoseNumber: 1,
            vaccinateCount: 1,
            vaccinateStatusCode: '0', // 接种记录的状态为 正常
            isForce: '0',
            actualVaccinatePovCode: this.selectPov === '1' ? this.userInfo.pov : this.selectedPovFromDialogValue
          });
        }
      });
    });
    return addedVacRecords;
  }

  /**
   * 打开选择医院的对话框
   */
  openDialog() {
    this.dialogSvc.open(SelectHospitalComponent, {
      hasBackdrop: false,
      closeOnBackdropClick: false,
      closeOnEsc: false
    }).onClose.subscribe(selected => {
      console.log(selected);
      if (selected) {
        this.selectedPovFromDialogText = selected.label;
        this.selectedPovFromDialogValue = selected.value;
      }
    });
  }

}
