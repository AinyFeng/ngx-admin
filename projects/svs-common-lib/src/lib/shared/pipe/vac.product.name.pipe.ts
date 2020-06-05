import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { VaccineProductService } from '../../api/master/vaccineproduct/vaccineproduct.service';
import { LOCAL_STORAGE } from '../../base/localStorage.base';

@Pipe({
  name: 'vacProductNamePipe'
})
/**
 * 根据疫苗产品编码获取疫苗产品名称
 */
export class VacProductNamePipe implements PipeTransform {
  static readonly SHORT_NAME = 's';
  static readonly FULL_NAME = 'f';

  constructor(
    private vacProductSvc: VaccineProductService,
    private localSt: LocalStorageService
  ) { }

  transform(
    value: string,
    nameType = VacProductNamePipe.FULL_NAME
  ): Observable<string> {
    if (!value || value.trim() === '') return;
    const productName = this.localSt.retrieve(
      LOCAL_STORAGE.VACC_PRODUCT_NAME + value
    );
    if (productName !== null) {
      return of(productName);
    }
    return this.queryVaccProductName(value, nameType).pipe(
      map(resp => {
        if (
          resp.code === 0 &&
          resp.hasOwnProperty('data') &&
          resp['data'].length !== 0
        ) {
          if (nameType === VacProductNamePipe.SHORT_NAME) {
            this.localSt.store(
              LOCAL_STORAGE.VACC_PRODUCT_NAME + value,
              resp.data[0]['vaccineProductShortName']
            );
            return resp.data[0]['vaccineProductShortName'];
          } else {
            this.localSt.store(
              LOCAL_STORAGE.VACC_PRODUCT_NAME + value,
              resp.data[0]['vaccineProductName']
            );
            return resp.data[0]['vaccineProductName'];
          }
        }
      })
    );
    // this.queryVacProductNameByProductCode(value, nameType, resp => {
    //   if (resp === null) {
    //     return value;
    //   }
    //   this.localSt.store(LOCAL_STORAGE.VACC_PRODUCT_NAME + value, resp);
    //   return resp;
    // });
  }

  queryVacProductNameByProductCode(
    productCode: string,
    nameType: string,
    func: Function
  ) {
    const query = {
      vaccineProductCode: productCode
    };
    this.vacProductSvc.queryVaccineProduct(query, resp => {
      if (
        resp.code !== 0 ||
        !resp.hasOwnProperty('data') ||
        resp.data.length === 0
      ) {
        func(null);
        return;
      }
      switch (nameType) {
        case VacProductNamePipe.SHORT_NAME:
          func(resp.data[0]['vaccineProductShortName']);
          break;
        default:
          func(resp.data[0]['vaccineProductName']);
          break;
      }
    });
  }

  queryVaccProductName(productCode: string, nameType: string): Observable<any> {
    const query = {
      vaccineProductCode: productCode
    };
    return this.vacProductSvc.queryVaccineProductForPipe(query, nameType);
  }
}
