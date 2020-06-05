import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { SignatureApiService, RegistRecordService, AgreementService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-vaccinate-agreement',
  templateUrl: './vaccinate-agreement.component.html',
  styleUrls: ['./vaccinate-agreement.component.scss'],
  providers: [SignatureApiService]
})
export class VaccinateAgreementComponent
  implements OnInit, OnChanges, OnDestroy {
  displayAgreementTemplates = [];

  @Input()
  profile: any;

  @Input()
  userInfo: any;

  private _profile$ = new BehaviorSubject<object>(null);

  private _userInfo$ = new BehaviorSubject<object>(null);

  // 登记记录
  registRecords = [];

  agreement = 'agreement';

  // 总共可用的告知书模板
  agreementTemplates = [];

  // 订阅对象集合
  private subscription: Subscription[] = [];

  // 已选择的告知书模板id
  @Output()
  readonly selectedTabId = new EventEmitter();

  constructor(
    private registApiSvc: RegistRecordService,
    private agreementSvc: AgreementService,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private doc,
    private signatureApiSvc: SignatureApiService
  ) { }

  ngOnInit() {
    // 获取所有的告知书模板
    this.agreementTemplates = this.agreementSvc.getAgreementData();
    const sub = combineLatest([this._userInfo$, this._profile$]).subscribe(_ =>
      this.getRegistRecord()
    );
    this.subscription.push(sub);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.hasOwnProperty('profile') &&
      changes['profile'].currentValue !== undefined
    ) {
      this._profile$.next(changes['profile'].currentValue);
    }
    if (
      changes.hasOwnProperty('userInfo') &&
      changes['userInfo'].currentValue !== undefined
    ) {
      this._userInfo$.next(changes['userInfo'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  /**
   * 查询登记记录
   */
  getRegistRecord() {
    if (!this.profile || !this.userInfo) return;
    const query = {
      registStatus: '1',
      profileCode: this.profile['profileCode'],
      registPovCode: this.userInfo.pov
    };
    this.registApiSvc.queryRegistRecord(query, resp => {
      console.log('登记记录返回值', resp);
      if (resp.code === 0) {
        this.registRecords = resp.data;
        this.getDisplayAgreementTemByRegistRecord();
      }
    });
  }

  /**
   * 根据登记记录获取需要展现的告知书模板
   */
  getDisplayAgreementTemByRegistRecord() {
    this.displayAgreementTemplates = [];
    this.registRecords.forEach(record => {
      const agreement = this.getAgreementByCode(record['vaccineSubclassCode']);
      if (agreement !== null) {
        if (!this.checkAgreementIsExist(record['vaccineSubclassCode'])) {
          agreement['registerRecordNumber'] = record['registerRecordNumber'];
          this.displayAgreementTemplates.push(agreement);
        }
      }
    });
    this.getSignatureByRegisterRecordNumber();
  }

  /**
   * 根据小类编码获取告知书模板
   * @param code 疫苗小类编码
   */
  getAgreementByCode(code: string) {
    const length = this.agreementTemplates.length;
    // 先判断是否有与入参相同的情况
    for (let i = 0; i < length; i++) {
      const templ = this.agreementTemplates[i];
      if (templ['code'] === code) {
        return templ;
      }
    }
    // 如果没有与入参相同的情况，则根据入参的大类编码进行判断
    const boradHeadingCode = code.substring(0, 2);
    for (let i = 0; i < length; i++) {
      const templ = this.agreementTemplates[i];
      if (templ['code'] === boradHeadingCode) {
        return templ;
      }
    }
    return null;
  }

  /**
   * 根据传入的code 判断是否存在同样的数据
   * 如果存在 - true，不存在 - false
   * @param code 疫苗小类编码
   */
  checkAgreementIsExist(code: string) {
    let length = this.displayAgreementTemplates.length;
    for (let i = 0; i < length; i++) {
      if (code === this.displayAgreementTemplates[i]['code']) {
        return true;
      }
    }
    const broadHeadingCode = code.substring(0, 2);
    for (let i = 0; i < length; i++) {
      if (broadHeadingCode === this.displayAgreementTemplates[i]['code']) {
        return true;
      }
    }
    return false;
  }

  /**
   * 选择一个tab
   * @param ev
   */
  selectTab(ev) {
    console.log(ev);
    this.displayAgreementTemplates.forEach((temp, i) => {
      if (temp['title'] === ev.tabTitle) {
        this.selectedTabId.emit(this.agreement + i);
      }
    });
  }

  /**
   * 根据登记流水号查询签字信息
   */
  getSignatureByRegisterRecordNumber() {
    let query = [];
    this.displayAgreementTemplates.forEach(tem => {
      query.push({ registerRecordNumber: tem['registerRecordNumber'] });
    });
    if (query.length === 0) return;
    this.signatureApiSvc.querySignatureBatch(query, resp => {
      // console.log('签字信息', resp);
      if (resp.code === 0) {
        const data = resp.data;
        for (let i = 0; i < data.length; i++) {
          const rrn = data[i]['registerRecordNumber'];
          for (let j = 0; j < this.displayAgreementTemplates.length; j++) {
            if (
              rrn === this.displayAgreementTemplates[j]['registerRecordNumber']
            ) {
              this.displayAgreementTemplates[j]['signature'] =
                data[i]['signature'];
            }
          }
        }
        // this.displayAgreementTemplates = JSON.parse(JSON.stringify(this.displayAgreementTemplates));
        // console.log('添加签字信息后', this.displayAgreementTemplates);
      }
    });
  }
}
