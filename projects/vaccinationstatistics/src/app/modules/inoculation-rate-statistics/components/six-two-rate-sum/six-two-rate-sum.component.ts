import {Component, OnInit} from '@angular/core';
import {YEARS, MONTHS, VacReportStatisticsApiService} from '@tod/svs-common-lib';
import {SelectVaccineComponent} from '../select-vaccine/select-vaccine.component';
import {take} from 'rxjs/operators';
import {NzModalService} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-six-two-rate-sum',
  templateUrl: './six-two-rate-sum.component.html',
  styleUrls: ['./six-two-rate-sum.component.scss']
})
export class SixTwoRateSumComponent implements OnInit {

  selectedVaccine = {selectName: '', selectCode: '', selectAcronym: ''};
  listOfData: any[] = [];
  sumData: any[] = [];

  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;

  years = YEARS;
  months = MONTHS;

  year: any;
  monthStart: any;
  monthEnd: any;

  userInfo: any;
  povInfo = {
    curProvCode: '',
    curCityCode: '',
    curDistrictCode: ''
  };

  zero = true;

  constructor(
    private modalSvc: NzModalService,
    private userSvc: UserService,
    private apiSixTwoSvc: VacReportStatisticsApiService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      // 获取当前地区-市-区
      this.getCurDistrictCode();
    });
  }

  ngOnInit() {
  }


  /**
   * 获取登录用户所在 pov的前6位，使用前六位的数字作为当前地区的编码
   */
  getCurDistrictCode() {
    if (this.userInfo.pov) {
      this.povInfo['curProvCode'] = this.userInfo.pov.substring(0, 2) + '0000';
      this.povInfo['curCityCode'] = this.userInfo.pov.substring(0, 4) + '00';
      this.povInfo['curDistrictCode'] = this.userInfo.pov.substring(0, 6);
    }
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
        groupType: 'sum62',
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

  // 统计
  queryData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
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
    let param = {
      yearMonths: [...yearMonthInoculates],
      vaccCodes: this.selectedVaccine.selectCode ? [this.selectedVaccine.selectCode] : null,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      },
    };
    // console.log('参数', param);
    this.loading = true;
    this.listOfData = [];
    this.zero = true;
    this.apiSixTwoSvc.querySixTwoSum(param, resp => {
      this.loading = false;
      // console.log('结果', resp);
      if (resp && resp.code === 0) {
        this.sumData = resp.data;
        let fianllist = [];
        let dlist = [];
        for (let i = 0; i < resp.data.length; i++) {
          if (i % 2 === 0 && i !== 0) {
            fianllist.push(dlist);
            dlist = [];
            dlist.push(resp.data[i]);
          } else {
            dlist.push(resp.data[i]);
          }
        }
        if (dlist.length > 0) {
          fianllist.push(dlist);
        }
        this.listOfData = fianllist;
      } else {
        this.listOfData = [];
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

