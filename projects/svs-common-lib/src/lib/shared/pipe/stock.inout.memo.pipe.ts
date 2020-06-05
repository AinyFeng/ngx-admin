import { Pipe, PipeTransform } from '@angular/core';
import {StockService} from '../../api/stock/stock.service';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';



@Pipe({
  name: 'stockInoutMemoPipe',
  pure: true
})
export class StockInoutMemoPipe implements PipeTransform {
  constructor(
    private stockSvc: StockService
  ) {
  }
  transform(value: any, type: any):  Observable<any> {
    if (value === null || value === '') return of('');
    /*
    * 1	平台出入库
      2	跨门诊调拨
      3	门诊内调剂
      4	批量接种
      5	接种出库
      6	报损出库
      7	其他出入库*/
   return this.querymemo(value, type).pipe(
     map(resp => {
       if (
         resp.code === 0 &&
         resp.hasOwnProperty('data') &&
         resp['data'].length !== 0
       ) {
         return resp.data[0]['memo'];
       }
     })
   );
  }

  querymemo(serialCode: string, type: string): Observable<any> {
    let query = {
      serialCode: serialCode,
      type: type
    };
    return this.stockSvc.queryMemo(query);
  }
}
