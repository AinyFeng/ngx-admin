import {Component, OnInit} from '@angular/core';
import {YEARS, MONTHS, VacReportStatisticsApiService} from '@tod/svs-common-lib';
import {NzModalService} from 'ng-zorro-antd';
import {take} from 'rxjs/operators';
import {SelectVaccineComponent} from '../select-vaccine/select-vaccine.component';
import {UserService} from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-six-one-rate-sum',
  templateUrl: './six-one-rate-sum.component.html',
  styleUrls: ['./six-one-rate-sum.component.scss']
})
export class SixOneRateSumComponent implements OnInit {

  listOfData: any[] = [];
  sumData: any[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;

  years = YEARS;
  months = MONTHS;

  selectedVaccine = {selectName: '', selectCode: '', selectAcronym: '', aliasName: []};

  // 显示的类型
  showType: any;
  year: any;
  monthStart: any;
  monthEnd: any;
  // 显示零值
  zero: any;
  // 登录用户信息
  userInfo: any;

  constructor(
    private modalSvc: NzModalService,
    private userSvc: UserService,
    private apiSixOneService: VacReportStatisticsApiService
  ) {
    userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
  }

  ngOnInit() {

  }

  // 统计
  queryData() {
    if (this.loading) return;
    console.log(this.year);
    if (!this.year) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: `<p>请选择需要统计的年份</p>`,
        nzMaskClosable: true
      });
      return;
    }
    // 开始月大于终止月
    const yearMonthInoculates = [];
    if (this.monthStart && this.monthEnd) {
      if (Number(this.monthStart) > Number(this.monthEnd)) {
        for (let i = 0; i <= (this.monthStart - this.monthEnd); i++) {
          const month = Number(this.monthEnd) + i;
          let date;
          if (month < 10) {
            date = this.year + '-' + '0' + month;
          } else {
            console.log('10', month);
            date = this.year + '-' + month;
            console.log(date);
          }
          yearMonthInoculates.push(date);
        }
      } else {
        for (let i = 0; i <= (this.monthEnd - this.monthStart); i++) {
          const month = Number(this.monthStart) + i;
          let date;
          if (month < 10) {
            date = this.year + '-' + '0' + month;
          } else {
            date = this.year + '-' + month;
          }
          yearMonthInoculates.push(date);
        }
      }
    } else {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: `<p>请选择月份范围</p>`,
        nzMaskClosable: true
      });
      return;
    }
    let params = {
      yearMonthInoculates: [...yearMonthInoculates],
      displayType: this.showType ? this.showType : null,
      vaccName: [...this.selectedVaccine.aliasName],
    };
    this.listOfData = [];
    this.sumData = [];
    this.loading = true;
    // 只要统计都要将只显示0值勾选
    this.zero = true;
    console.log('参数', params);
    this.apiSixOneService.querySixOneSum(params, resp => {
      console.log('查询结果', resp);
      this.loading = false;
      if (resp && resp.code === 0) {
        this.sumData = resp.data;
        this.listOfData = resp.data;
      }
    });
  }

  // 预览
  preview() {

  }

  // 选择疫苗
  selectVac() {
    const modal = this.modalSvc.create({
      nzTitle: '选择疫苗',
      nzContent: SelectVaccineComponent,
      nzComponentParams: {
        groupType: 'sum61',
      },
      nzFooter: [
        {
          label: '确定',
          type: 'primary',
          onClick: comp => {
            modal.close(comp.selectedVaccines);
          }
        },
        {
          label: '取消',
          type: 'default',
          onClick: () => modal.close()
        }
      ]
    });
    // 订阅关闭时获取的数值
    modal.afterClose.pipe(take(1)).subscribe(res => {
      console.log('返回的结果', res);
      if (res) {
        this.selectedVaccine = res;
      }
    });
  }

  // 显示0值
  showZero(event) {
    this.zero = event;
    if (!this.zero) {
      if (this.listOfData.length) {
        for (let i = 0; i < this.listOfData.length; i++) {
          const item = this.listOfData[i];
          item.forEach(ele => {
            for (let key in ele) {
              if (ele.hasOwnProperty(key)) {
                if (!ele[key]) {
                  ele[key] = '';
                }
              }
            }
          });
        }
      }
    } else {
      this.listOfData = [...this.sumData];
    }
  }

}
