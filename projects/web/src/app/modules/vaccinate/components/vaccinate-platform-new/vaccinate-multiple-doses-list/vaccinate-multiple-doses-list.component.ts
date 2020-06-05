import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {DateUtils, StockService} from '@tod/svs-common-lib';
import {VaccinatePlatformService} from '../vaccinate-platform.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'uea-vaccinate-multiple-doses-list',
  templateUrl: './vaccinate-multiple-doses-list.component.html',
  styleUrls: ['./vaccinate-multiple-doses-list.component.scss']
})
export class VaccinateMultipleDosesListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  showCard: boolean = true;
  /**
   * 用于报损的入参对象
   */
  breakageObj: any;
  // 报损Form 显示
  breakageVisible = false;

  currentVaccineInfo: any;

  // 报损方式
  breakTypes = [];

  private subscription: Subscription[] = [];

  constructor(private message: NzMessageService,
              private modalService: NzModalService,
              private stockService: StockService,
              public platformService: VaccinatePlatformService) {
  }

  ngOnInit() {
    this.initCurrentVaccineInfo();
    this.initBreakageVisible();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  initCurrentVaccineInfo() {
    const sub = this.platformService.getCurrentVaccineInfo().subscribe(vaccineInfo => this.currentVaccineInfo = vaccineInfo);
    this.subscription.push(sub);
  }

  initBreakageVisible() {
    const sub = this.platformService.getBreakageVisible().subscribe(isShow => {
      console.log('initBreakageVisible', isShow);
      this.breakageVisible = isShow;
      if (this.breakageVisible) {
        // 无接种信息
        if (!this.currentVaccineInfo || this.currentVaccineInfo['vaccineProductCode'] === undefined) {
          this.initBreakageFacilityCodeOptions(this.platformService.coldStorageFacilities);
        } else if (this.currentVaccineInfo['vaccineProductCode'] !== undefined) {
          this.breakageObj = {
            vaccProductCode: this.currentVaccineInfo['vaccineProductCode'], // 有
            prodBatchCode: this.currentVaccineInfo['vaccineBatchNo'], // 有
            eleSuperviseCode: this.currentVaccineInfo['electronicSupervisionCode'], // 有
            count: this.currentVaccineInfo['vaccinateCount'],
            facilityCode: this.platformService.coldStorageFacilities[0].facilityCode, // 有
            breakType: this.breakTypes[0].value, // 有
            breakTime: new Date(),
            memo: null
          };
          // 然后将需要的下拉框选项进行封装传入到报损表单页面中
          this.initBreakageVaccineProductOptions(this.currentVaccineInfo['vaccineProductCode']);
          this.initEleSuperviseCodeOptions(this.currentVaccineInfo['electronicSupervisionCode']);
          this.initBreakageFacilityCodeOptions([this.platformService.coldStorageFacilities[0]]);
          this.initVaccineBatchOptions(this.currentVaccineInfo['vaccineBatchNo']);
        }
      }
    });
    this.subscription.push(sub);
  }

  /**
   * 倒计时完成，自动报损
   */
  onDoseFinished(event, manyDoseData) {
    console.log(event);
    if (event.action === 'done') {
      if (manyDoseData.disabled) {
        return;
      }
      if (this.platformService.coldStorageFacilities.length <= 0) {
        return;
      }
      if (manyDoseData.departmentCode !== this.platformService.selectedDepartmentCode) {
        return;
      }
      const contentText = manyDoseData.vaccineProductName + '疫苗报损时间已到，是否报损？';
      this.modalService.confirm({
        nzTitle: '<i>延时提示</i>',
        nzContent: '<b>' + contentText + '</b>',
        nzOkText: '多剂次疫苗报损',
        nzCancelText: '延迟2分钟',
        nzOnOk: () => this.doseVaccineBreakage(manyDoseData),
        nzOnCancel: () => this.delayDoseVaccineTime(manyDoseData)
      });
    }
  }

  /**
   * 多剂次人工报损
   */
  manyDoseOperationBreakage(data) {
    // 初始化报损表单的批次号下拉框选项
    console.log('data', data);
    this.initVaccineBatchOptions(data.vaccineBatchNo);
    this.initEleSuperviseCodeOptions(data.electronicSupervisionCode);
    this.initBreakageVaccineProductOptions(data.vaccineProductCode);
    this.initBreakageFacilityCodeOptions([this.platformService.coldStorageFacilities[0]]);
    this.breakageObj = {
      broadHeadingCode: data.vaccineSubclassCode.substring(0, 2), // 有
      vaccProductCode: data.vaccineProductCode, // 有
      prodBatchCode: data.vaccineBatchNo, // 有
      eleSuperviseCode: data.electronicSupervisionCode, // 有
      dosageByEachNum: data.dosageByEach - data.vaccinateDoseNumber,
      count: data.dosageByEach - data.vaccinateDoseNumber,
      facilityCode: this.platformService.coldStorageFacilities[0].facilityCode, // 有
      breakType: '2', // 有
      breakTime: DateUtils.getFormatDateTime(new Date()),
      memo: '人工报损',
      povCode: this.platformService.userInfo.pov,
      departmentCode: this.platformService.selectedDepartmentCode,
      stockBy: this.platformService.userInfo.userCode
    };
    this.breakageVisible = !this.breakageVisible;
  }

  /**
   * 多剂次疫苗报损
   * @param manyDoseData
   */
  doseVaccineBreakage(manyDoseData) {
    const params = {
      facilityCode: this.platformService.coldStorageFacilities[0].facilityCode,
      vaccProductCode: manyDoseData.vaccineProductCode,
      prodBatchCode: manyDoseData.vaccineBatchNo,
      dosageByEachNum: manyDoseData.dosageByEach - manyDoseData.vaccinateDoseNumber,
      count: null,
      breakType: '1',
      breakTime: DateUtils.getFormatDateTime(new Date()),
      memo: '自动报损',
      povCode: this.platformService.userInfo.pov,
      departmentCode: this.platformService.selectedDepartmentCode,
      stockBy: this.platformService.userInfo.userCode
    };
    this.stockService.breakage(params, resp => {
      if (resp.code !== 0) {
        // console.log(resp);
        this.platformService.error('自动报损失败，请手动报损！');
      } else {
        this.platformService.success('自动报损成功！');
      }
      this.platformService.queryVaccineDoseInfo();
    });
  }

  /**
   * 延迟多剂次报损时间
   * @param manyDoseData
   */
  delayDoseVaccineTime(manyDoseData) {
    // manyDoseData['leftTime'] = 60 * 2;
    manyDoseData.effectiveTime += (2 * 60 * 1000);
    let leftTime = (manyDoseData['effectiveTime'] - new Date().valueOf());
    manyDoseData['leftTime'] = (leftTime > 0 ? leftTime : 0) / 1000;
  }

  /**
   * 初始化报损表单的疫苗产品信息下拉框选项
   */
  initBreakageVaccineProductOptions(options?: any) {
    console.log('疫苗产品编码', options);
    this.platformService.breakageVaccineProductOptions = [];
    this.platformService.breakageVaccineProductOptions.push(options);
  }

  /**
   * 初始化报损表单的垫子监管码下拉框选项
   * @param options
   */
  initEleSuperviseCodeOptions(options?: any) {
    console.log('电子监管码编码', options);
    this.platformService.eleSuperviseCodes = [];
    this.platformService.eleSuperviseCodes.push({electronicSupervisionCode: options});
  }

  /**
   * 初始化报损表单的冷藏设备下拉框选项
   */
  initBreakageFacilityCodeOptions(options?: any) {
    console.log('冷藏设备编码', options);
    this.platformService.breakageFacilityCodeOptions = [];
    this.platformService.breakageFacilityCodeOptions = [...options];
  }

  /**
   * 初始化报损表单的疫苗批号下拉框选项
   * @param options
   */
  initVaccineBatchOptions(options?: any) {
    console.log('疫苗批次号编码', options);
    this.platformService.vaccineBatches = [];
    this.platformService.vaccineBatches.push({batchNo: options});
  }

  /**
   * 当报损成功之后，刷新多剂次信息
   */
  breakageSuccess() {
    console.log('breakageSuccess');
    this.platformService.queryVaccineDoseInfo();
    this.platformService.setBreakageVisible(false);
  }

  getNumber(date) {
    if (date) {
      return Number(date);
    } else {
      return null;
    }
  }

  ngAfterViewInit(): void {
  }

}
