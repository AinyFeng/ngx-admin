import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';
import { VaccManufactureDataService } from './vacc-manufacture.data.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PovInfoService } from '../api/master/pov/pov.service';
import { DicDataService } from './dic.data.service';
import { FieldNameUtils } from '../utils/field.name.utils';
import { VaccBroadHeadingDataService } from './vacc-broad-heading.data.service';
import { AdministrativeDivisionService } from '../api/master/administrativedivision/administrativeDivision.service';
// import { AdministrativeDivisionService } from '../../api/master/administrativedivision/administrativeDivision.service';

@Injectable()
export class VaccRecordTransformService {
  // 生产企业
  manufactureData: any;
  // 字典
  dicData: any;
  // 大类数据
  vacBroadHeadingData: any;

  constructor(
    private manuSvc: VaccManufactureDataService,
    private localSt: LocalStorageService,
    private povSvc: PovInfoService,
    private dicSvc: DicDataService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private adminSvc: AdministrativeDivisionService
  ) {
    this.manufactureData = this.manuSvc.getVaccProductManufactureData();
    this.dicData = this.dicSvc.getDicData();
    this.vacBroadHeadingData = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
  }

  // 转换接种名称
  transformVaccinateName(value: string): any {
    if (!value || value.trim() === '') return;
    for (let i = 0; i < this.vacBroadHeadingData.length; i++) {
      if (value === this.vacBroadHeadingData[i]['broadHeadingCode']) {
        return this.vacBroadHeadingData[i]['broadHeadingFullName'];
      }
    }
    return value;
  }

  // 转换接种记录中的生产企业
  transformManufacture(value: string): any {
    if (!value || value.trim() === '') return;
    for (let i = 0; i < this.manufactureData.length; i++) {
      if (value === this.manufactureData[i]['code']) {
        return this.manufactureData[i]['name'];
      }
    }
    return value;
  }


  // 转换接种记录中的接种单位
  transformPovName(value: string): Observable<string> {
    if (!value || value.trim() === '') return of('');
    const reg = new RegExp(/^[\u4e00-\u9fa5]{2,}\d?/);
    if (value.match(reg)) return of(value);
    const povName = this.localSt.retrieve(LOCAL_STORAGE.VACC_POV + value);
    if (povName !== null) {
      return of(povName);
    }
    return this.queryPovName(value).pipe(
      map(resp => {
        if (
          resp.code === 0 &&
          resp.hasOwnProperty('data') &&
          resp['data'].length !== 0
        ) {
          this.localSt.store(
            LOCAL_STORAGE.VACC_POV + value,
            resp.data[0]['name']
          );
          return resp.data[0]['name'];
        } else {
          this.localSt.store(LOCAL_STORAGE.VACC_POV + value, value);
          return value;
        }
      })
    );
  }

  // 调接口查询
  queryPovName(povCode: string): Observable<any> {
    let query = {
      povCode: povCode
    };
    return this.povSvc.queryPovInfoForPipe(query);
  }

  // 转换字典数据
  static transformPart(value: any): any {
    let vaccPart = '';
    if (value === '0') {
      return '左上臂三角肌';
    }
    if (value === '1') {
      return '左上臂三角肌';
    }
    if (value === '2') {
      vaccPart = '左臀';
    }
    if (value === '3') {
      vaccPart = '右臀';
    }
    if (value === '4') {
      vaccPart = '左大腿前外/内侧';
    }
    if (value === '5') {
      vaccPart = '右大腿前外/内侧';
    }
    if (value === '6') {
      vaccPart = '左前臂掌侧';
    }
    if (value === '7') {
      vaccPart = '右前臂掌侧';
    }
    if (value === '8') {
      vaccPart = '口服或其他部位';
    }
    return vaccPart;
  }

  // 转换禁忌症
  // 179	禁忌症类型	taboo_type	1	免疫缺陷病，如白血病、淋巴瘤等(全部活疫苗)
  // 180	禁忌症类型	taboo_type	2	恶性肿瘤(全部活疫苗)&quot;&gt;恶性肿瘤(全部活疫苗)
  // 181	禁忌症类型	taboo_type	3	应用皮质类固醇、烷化剂及抗代谢药物(全部活疫苗)
  // 182	禁忌症类型	taboo_type	4	放射治疗、使用免疫抑制剂治疗者(全部活疫苗)
  // 183	禁忌症类型	taboo_type	5	脾缺损(全部活疫苗)&quot;&gt;脾缺损(全部活疫苗)
  // 184	禁忌症类型	taboo_type	6	4周内使用过免疫球蛋白者(全部活疫苗)
  // 185	禁忌症类型	taboo_type	7	妊娠期妇女(风疹、流感、腮腺炎、水痘疫苗)
  // 186	禁忌症类型	taboo_type	8	对鸡蛋有过敏史者(麻疹、风疹、腮腺炎疫苗)
  // 187	禁忌症类型	taboo_type	9	患急性传染病或其他严重疾病者(所有疫苗)
  // 188	禁忌症类型	taboo_type	10	癫痫等神经系统疾病或既往精神病(乙脑.DPT. A群流脑)
  // 189	禁忌症类型	taboo_type	11	种某疫苗曾有过敏反应等严重异常反应者(同种疫苗)
  // 190	禁忌症类型	taboo_type	12	湿疹等严重皮肤病（BCG）
  // 191	禁忌症类型	taboo_type	13	结核菌素（PPD）试验阳性（BCG）
  // 192	禁忌症类型	taboo_type	14	肾炎及恢复期（DPT）
  // 193	禁忌症类型	taboo_type	15	骨髓或实体器官移植（BCG 、OPV）
  // 194	禁忌症类型	taboo_type	16	其他

  static transformContraindication(value: any): any {
    if (value === '1') {
      return '免疫缺陷病，如白血病、淋巴瘤等(全部活疫苗)';
    }
    if (value === '2') {
      return '恶性肿瘤(全部活疫苗),恶性肿瘤(全部活疫苗)';
    }
    if (value === '3') {
      return '应用皮质类固醇、烷化剂及抗代谢药物(全部活疫苗)';
    }
    if (value === '4') {
      return '放射治疗、使用免疫抑制剂治疗者(全部活疫苗)';
    }
    if (value === '5') {
      return '脾缺损(全部活疫苗),脾缺损(全部活疫苗)';
    }
    if (value === '6') {
      return '4周内使用过免疫球蛋白者(全部活疫苗)';
    }
    if (value === '7') {
      return '妊娠期妇女(风疹、流感、腮腺炎、水痘疫苗)';
    }
    if (value === '8') {
      return '对鸡蛋有过敏史者(麻疹、风疹、腮腺炎疫苗)';
    }
    if (value === '9') {
      return '患急性传染病或其他严重疾病者(所有疫苗)';
    }
    if (value === '10') {
      return '癫痫等神经系统疾病或既往精神病(乙脑.DPT. A群流脑)';
    }
    if (value === '11') {
      return '种某疫苗曾有过敏反应等严重异常反应者(同种疫苗)';
    }
    if (value === '12') {
      return '湿疹等严重皮肤病（BCG）';
    }
    if (value === '13') {
      return '结核菌素（PPD）试验阳性（BCG）';
    }
    if (value === '14') {
      return '肾炎及恢复期（DPT）';
    }
    if (value === '15') {
      return '骨髓或实体器官移植（BCG 、OPV）';
    }
    if (value === '16') {
      return '其他';
    }
  }

  transform(value: any, type: string): any {
    if (!value || !type) {
      return;
    }
    if (value.toString().trim() === '' || type.trim() === '') {
      return;
    }
    if (!this.dicData) {
      return;
    }
    if (type.indexOf('_') !== -1) {
      type = FieldNameUtils.toHump(type);
    }
    const valArr = this.dicData[type];
    if (!valArr) return;
    let ret = value;
    valArr.forEach(item => {
      if (item['value'] === value) {
        ret = item['label'];
      }
    });
    return ret;
  }

  // 转换行政区
  transformAdministrativeName(value: string): Observable<string> {
    if (!value || value.trim() === '') return of('');
    // if (value.length === 6) {
    //   value = value + '000000';
    //   value = value + '';
    // }
    const administrativeName = this.localSt.retrieve(
      LOCAL_STORAGE.ADMINISTRATIVE_DATA + value
    );
    if (administrativeName !== null) {
      return of(administrativeName);
    }
    return this.getAdministrativeName(value).pipe(
      map(resp => {
        if (
          resp.code === 0 &&
          resp.hasOwnProperty('data') &&
          resp['data'].length !== 0
        ) {
          this.localSt.store(
            LOCAL_STORAGE.ADMINISTRATIVE_DATA + value,
            resp.data[0]['name']
          );
          return resp.data[0]['name'];
        } else {
          this.localSt.store(LOCAL_STORAGE.ADMINISTRATIVE_DATA + value, value);
          return value;
        }
      })
    );
  }

  getAdministrativeName(code: string): Observable<any> {
    const query = {
      code: code
    };
    return this.adminSvc.queryAdministrativeDivisionForPipe(query);
  }
}
