import {Component, Input, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';
import {NbDialogRef} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProfileDataService, DicDataService, BiteService, DateUtils} from '@tod/svs-common-lib';

@Component({
  selector: 'uea-adult-vacc-record',
  templateUrl: './adult-vacc-record.component.html',
  styleUrls: ['./adult-vacc-record.component.scss']
})
export class AdultVaccRecordComponent implements OnInit {
  form: FormGroup;
  @Input() data: any;

  loading = false;
  // 将当前查询或者新建的档案信息传递过来
  profile: { [key: string]: any };
  userInfo: any;
  active = false;
  // 成人疫苗大类
  adultVaccineOptions: any;
  // 抗体水平
  antibodyLevel = [];

  currentDate = new Date(DateUtils.formatEndDate(new Date()));

  constructor(
    private ref: NbDialogRef<AdultVaccRecordComponent>,
    private msg: NzMessageService,
    private userSvc: UserService,
    private profileDataSvc: ProfileDataService,
    private fb: FormBuilder,
    private dicSvc: DicDataService,
    private biteSvc: BiteService
  ) {
    this.userSvc.getUserInfoByType().subscribe(resp => (this.userInfo = resp));
    this.profileDataSvc.getProfileData().subscribe(resp => {
      if (resp) {
        this.profile = resp;
      }
    });
  }

  ngOnInit() {
    // 获取抗体水平
    this.antibodyLevel = this.dicSvc.getDicDataByKey('hepbAntibodyLevel');
    this.form = this.fb.group({
      programCode: [
        this.data ? this.data.programCode : null,
        [Validators.required]
      ],
      level: [this.data ? this.data.level : '0', null],
      registDate: [
        this.data ? this.data.registDate : null,
        [Validators.required]
      ],
      memo: [this.data ? this.data.memo : null]
    });
    if (this.data) {
      this.active = this.data.level === '0' || this.data.level === '1';
    }
    this.biteSvc.getStrategy({'diseaseCategoryCode': 'adult'}, (result) => {
         this.adultVaccineOptions = result.data;
      this.adultVaccineOptions = this.adultVaccineOptions.filter(item => item['value'] !== 'IP-0202');
       });
  }

  onClose() {
    this.ref.close();
  }

  /**
   * 过滤选择日期
   * @param d
   */
  filterDate = (d: Date) => {
    return d > this.currentDate;
  }

  // 提交存储记录
  onSubmit() {
    if (!this.profile) return;
    if (this.form.invalid) {
      this.msg.warning('请正确填写表单内容');
      return;
    }
    if (!this.active) {
      this.form.get('level').setValue('');
    }
    this.loading = true;
    if (!this.data) {
      let params = JSON.parse(JSON.stringify(this.form.value));
      console.log('adultVaccineOptions', this.adultVaccineOptions);
      params['createPov'] = this.userInfo.pov;
      params['createBy'] = this.userInfo.userCode;
      params['profileCode'] = this.profile.profileCode;
      params.registDate = DateUtils.getFormatDateTime(params.registDate);
      let selectedProgramCodeList = this.adultVaccineOptions.filter(a => (a.value === this.form.get('programCode').value));
      console.info('selectedProgramCodeList', this.adultVaccineOptions, this.form.get('programCode').value, selectedProgramCodeList);
      params['broadHeadingCode'] = selectedProgramCodeList[0].diseaseCategoryCode;
      console.log('params', params);
      console.log('selectedProgramCodeList', selectedProgramCodeList);

      this.biteSvc.savePavrVaccineRecord(params, resp => {
        this.loading = false;
        console.log(resp);
        if (resp.code !== 0 || resp.data !== 1) {
          this.msg.error(resp.msg);
          return;
        }
        this.msg.success('成人疫苗记录添加成功');
        this.ref.close(true);
      });
    } else {
      let data: any = {};
      Object.assign(data, this.data, this.form.value);
      data.registDate = DateUtils.getFormatDateTime(data.registDate);
      data.createDate = DateUtils.getFormatDateTime(data.createDate);
      this.biteSvc.updatePavrVaccineRecord(data, resp => {
        this.loading = false;
        // console.log(resp);
        if (resp.code !== 0 || (resp.hasOwnProperty(data) && resp.data !== 1)) {
          this.msg.error('操作失败，请重试');
          return;
        }
        this.msg.warning('更新成人登记记录成功');
        this.ref.close(true);
      });
    }
  }

  // 选择疫苗
  vaccineBroadHeadingChange(ev) {
    this.active = ev === 'IP-0211' || ev === 'IP-0212' || ev === 'IP-0213' || ev === 'IP-0214';
    if (ev === 'IP-0211' || ev === 'IP-0212' || ev === 'IP-0213' || ev === 'IP-0214') {
      this.form.get('level').setValue('0');
    }
  }
}
