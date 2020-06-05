import { Pipe, PipeTransform } from '@angular/core';
import { VaccinateService } from '../../api/vaccinate/vaccinate.service';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { map } from 'rxjs/operators';
import { LOCAL_STORAGE } from '../../base/localStorage.base';

@Pipe({
  name: 'eleCodePipe',
})

/**
 * 查询电子监管码 pipe 接种记录展示时使用
 */
export class VaccinateEleCode implements PipeTransform {

  constructor(private vacSvc: VaccinateService, private localSt: LocalStorageService) {
  }

  /**
   * 转化方法，传入参数是接种记录
   * @param value
   */
  transform(value: any): any {
    if (!value) {
      return new Promise(resolve => resolve('-'));
    }
    if (!value.hasOwnProperty('registerRecordNumber')) {
      return new Promise(resolve => resolve('-'));
    }
    const eleCode = this.localSt.retrieve(LOCAL_STORAGE.ELE_CODE);
    if (eleCode) {
      return new Promise(resolve => resolve(eleCode));
    }
    const query = {
      registerRecordNumber: value['registerRecordNumber']
    };
    return this.vacSvc.queryEleCode(query)
      .pipe(
        map((res: any) => {
          console.log(res);
          if (res.code === 0) {
            let retEleCode = '';
            res.data.forEach(r => retEleCode += r['electronicSupervisionCode'] + ',');
            let elementCode = retEleCode.substr(0, retEleCode.length - 1);
            console.log(elementCode);
            return elementCode === '' ? '-' : elementCode;
          } else {
            return '-';
          }
        })
      );

  }
}
