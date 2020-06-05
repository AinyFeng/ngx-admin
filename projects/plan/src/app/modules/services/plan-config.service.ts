import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {ApiService} from '@tod/svs-common-lib';
import {forkJoin} from 'rxjs';
import {UserService} from '@tod/uea-auth-lib';
import {PLATFORM_PLAN_URLS} from './url-params.const';
import {LocalStorageService} from '@tod/ngx-webstorage';
import {LOCAL_STORAGE} from '../../../../../svs-common-lib/src/lib/base/localStorage.base';

@Injectable({
  providedIn: 'root'
})
export class PlanConfigService {

  userInfo: any;

  staffInfo: any;

  povInfo: any;

  constructor(private api: ApiService,
              private localStorageService: LocalStorageService,
              private userService: UserService) {
    this.userService.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      this.staffInfo =  this.localStorageService.retrieve(LOCAL_STORAGE.POV_STAFF).find(staff => staff['number'] === this.userInfo['userCode']);
      this.povInfo = this.localStorageService.retrieve(LOCAL_STORAGE.VACC_POV);
      console.log('user', this.userInfo);
      console.log('staffInfo', this.staffInfo);
      console.log('povInfo', this.povInfo);
    });
  }

  queryPlanConfig(param: any, func: Function) {
    forkJoin([
      this.api.post(PLATFORM_PLAN_URLS.planConfigList, param),
      this.api.post(PLATFORM_PLAN_URLS.planConfigCount, param)
    ]).subscribe(resp => func(resp));
  }

  savePlanConfig(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planConfigSave, param).subscribe(resp => func(resp));
  }

  updatePlanConfig(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planConfigSave, param).subscribe(resp => func(resp));
  }

  deletePlanConfig(param: any, func: Function) {
    this.api.del(PLATFORM_PLAN_URLS.planConfigDelete, param).subscribe(resp => func(resp));
  }

  getPlanYearDetailWithPlanConfig(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planConfigWithDetails, param).subscribe(resp => func(resp));
  }

  getPlanYear(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planYearList, param).subscribe(resp => func(resp));
  }

  queryPlanYear(param: any, func: Function) {
    forkJoin([
      this.api.post(PLATFORM_PLAN_URLS.planYearList, param),
      this.api.post(PLATFORM_PLAN_URLS.planYearCount, param)
    ]).subscribe(resp => func(resp));
  }

  checkPlanYear(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planYearCheck, param).subscribe(resp => func(resp));
  }

  savePlanYear(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planYearSave, param).subscribe(resp => func(resp));
  }

  updatePlanYear(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planYearUpdate, param).subscribe(resp => func(resp));
  }

  deletePlanYear(param: any, func: Function) {
    this.api.del(PLATFORM_PLAN_URLS.planYearDelete, param).subscribe(resp => func(resp));
  }

  exportFilePlanYear(param: any, func: Function) {
    const option = {
      observe: 'response',
      responseType: 'blob'
    };
    return this.api.postForDownload(PLATFORM_PLAN_URLS.planYearExport, param,
      option
    ).subscribe((resp: any) => {
      const fileName = decodeURI(resp.headers.get('content-disposition')).replace('attachment; filename=', '');
      func(resp.body, fileName, resp.body.type);
    });
  }

  getPlanYearDetail(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planYearDetailsList, param).subscribe(resp => func(resp));
  }

  getPlanMonthDetailWithYearPlanDetails(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planYearDetailsMonthly, param).subscribe(resp => func(resp));
  }

  queryPlanMonth(param: any, func: Function) {
    forkJoin([
      this.api.post(PLATFORM_PLAN_URLS.planMonthList, param),
      this.api.post(PLATFORM_PLAN_URLS.planMonthCount, param)
    ]).subscribe(resp => func(resp));
  }

  getPlanMonth(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthList, param).subscribe(resp => func(resp));
  }

  checkPlanMonth(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthCheck, param).subscribe(resp => func(resp));
  }

  savePlanMonth(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthSave, param).subscribe(resp => func(resp));
  }

  updatePlanMonth(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthUpdate, param).subscribe(resp => func(resp));
  }

  deletePlanMonth(param: any, func: Function) {
    this.api.del(PLATFORM_PLAN_URLS.planMonthDelete, param).subscribe(resp => func(resp));
  }

  statisticalPlanMonth(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthStatistical, param).subscribe(resp => func(resp));
  }

  statisticalBranchPlanMonth(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthStatisticalBranch, param).subscribe(resp => func(resp));
  }

  statisticalExportFilePlanMonth(param: any, func: Function) {
    const option = {
      observe: 'response',
      responseType: 'blob'
    };
    return this.api.postForDownload(PLATFORM_PLAN_URLS.planMonthStatisticalExportFile, param,
      option
      ).subscribe((resp: any) => {
        const fileName = decodeURI(resp.headers.get('content-disposition')).replace('attachment; filename=', '');
        func(resp.body, fileName, resp.body.type);
      });
  }

  exportFilePlanMonth(param: any, func: Function) {
    const option = {
      observe: 'response',
      responseType: 'blob'
    };
    return this.api.postForDownload(PLATFORM_PLAN_URLS.planMonthExportFile, param,
      option
      ).subscribe((resp: any) => {
        const fileName = decodeURI(resp.headers.get('content-disposition')).replace('attachment; filename=', '');
        func(resp.body, fileName, resp.body.type);
      });
  }

  getMonthDetail(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthDetailsList, param).subscribe(resp => func(resp));
  }

  queryVaccine(param: any, func: Function) {
    forkJoin([
      this.api.post(PLATFORM_PLAN_URLS.planYearTollQueryVaccine, param),
      this.api.post(PLATFORM_PLAN_URLS.planYearTollQueryVaccineCount, param)
    ]).subscribe(([queryData, countData]) => func([queryData, countData]));
  }

  getPlanYearToll(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planYearTollList, param).subscribe(resp => func(resp));
  }

  queryPlanYearToll(param: any, func: Function) {
    forkJoin([
      this.api.post(PLATFORM_PLAN_URLS.planYearTollList, param),
      this.api.post(PLATFORM_PLAN_URLS.planYearTollCount, param)
    ]).subscribe(resp => func(resp));
  }

  checkPlanYearToll(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planYearTollCheck, param).subscribe(resp => func(resp));
  }

  savePlanYearToll(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planYearTollSave, param).subscribe(resp => func(resp));
  }

  updatePlanYearToll(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planYearTollUpdate, param).subscribe(resp => func(resp));
  }

  deletePlanYearToll(param: any, func: Function) {
    this.api.del(PLATFORM_PLAN_URLS.planYearTollDelete, param).subscribe(resp => func(resp));
  }

  exportFilePlanYearToll(param: any, func: Function) {
    const option = {
      observe: 'response',
      responseType: 'blob'
    };
    return this.api.postForDownload(PLATFORM_PLAN_URLS.planYearTollExport, param,
      option
    ).subscribe((resp: any) => {
      const fileName = decodeURI(resp.headers.get('content-disposition')).replace('attachment; filename=', '');
      func(resp.body, fileName, resp.body.type);
    });
  }

  getPlanYearTollDetail(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planYearTollDetailsList, param).subscribe(resp => func(resp));
  }

  getPlanMonthTollDetailWithYearPlanDetails(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planYearTollDetailsMonthly, param).subscribe(resp => func(resp));
  }

  queryPlanMonthToll(param: any, func: Function) {
    forkJoin([
      this.api.post(PLATFORM_PLAN_URLS.planMonthTollList, param),
      this.api.post(PLATFORM_PLAN_URLS.planMonthTollCount, param)
    ]).subscribe(resp => func(resp));
  }

  getPlanMonthToll(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthTollList, param).subscribe(resp => func(resp));
  }

  checkPlanMonthToll(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthTollCheck, param).subscribe(resp => func(resp));
  }

  savePlanMonthToll(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthTollSave, param).subscribe(resp => func(resp));
  }

  updatePlanMonthToll(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthTollUpdate, param).subscribe(resp => func(resp));
  }

  deletePlanMonthToll(param: any, func: Function) {
    this.api.del(PLATFORM_PLAN_URLS.planMonthTollDelete, param).subscribe(resp => func(resp));
  }

  statisticalPlanMonthToll(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthTollStatistical, param).subscribe(resp => func(resp));
  }

  statisticalBranchPlanMonthToll(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthTollStatisticalBranch, param).subscribe(resp => func(resp));
  }

  statisticalExportFilePlanMonthToll(param: any, func: Function) {
    const option = {
      observe: 'response',
      responseType: 'blob'
    };
    return this.api.postForDownload(PLATFORM_PLAN_URLS.planMonthTollStatisticalExportFile, param,
      option
    ).subscribe((resp: any) => {
      const fileName = decodeURI(resp.headers.get('content-disposition')).replace('attachment; filename=', '');
      func(resp.body, fileName, resp.body.type);
    });
  }

  exportFilePlanMonthToll(param: any, func: Function) {
    const option = {
      observe: 'response',
      responseType: 'blob'
    };
    return this.api.postForDownload(PLATFORM_PLAN_URLS.planMonthTollExportFile, param,
      option
    ).subscribe((resp: any) => {
      const fileName = decodeURI(resp.headers.get('content-disposition')).replace('attachment; filename=', '');
      func(resp.body, fileName, resp.body.type);
    });
  }

  getMonthTollDetail(param: any, func: Function) {
    this.api.post(PLATFORM_PLAN_URLS.planMonthTollDetailsList, param).subscribe(resp => func(resp));
  }
}

@Pipe({
  name: 'planStatusPipe'
})
export class PlanStatusPipe implements PipeTransform {
  transform(value: string): any {
    switch (value) {
      case '0':
        return '新建';
      case '1':
        return '待审批';
      case '2':
        return '通过';
      case '3':
        return '-';
      default :
        return '退回';
    }
  }
}

@Pipe({
  name: 'planTypePipe'
})
export class PlanTypePipe implements PipeTransform {
  transform(value: string): any {
    switch (value) {
      case '1':
        return '一类';
      case '2':
        return '二类';
      default :
        return '-';
    }
  }
}
