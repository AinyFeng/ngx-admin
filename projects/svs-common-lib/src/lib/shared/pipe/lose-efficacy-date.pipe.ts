import { Pipe, PipeTransform } from '@angular/core';
import {Observable} from 'rxjs';
import {BatchInfoService} from '../../api/master/batch/batchInfo.service';
import {map} from 'rxjs/operators';
import {DateUtils} from '../../utils/date.utils';


@Pipe({
  name: 'loseEfficacyDatePipe'
})
export class LoseEfficacyDatePipe implements PipeTransform {

  constructor(private batchInfoService: BatchInfoService) {

  }

  transform(productCode: string, batchNo: string): any {
    return this.getBatchInfo(batchNo, productCode).pipe(
      map(resp => {
        let status = '';
        if (resp.code === 0 && resp.hasOwnProperty('data') && resp['data'].length !== 0) {
          status = DateUtils.getFormatTime(resp['data'][0]['loseEfficacyDate'], 'YYYY-MM-DD');
        }
        // console.log('status====================', status);
        return status;
      })
    );
  }

  getBatchInfo(batchNo: string, productCode: string): Observable<any> {
    const param = {
      batchNo: batchNo,
      vaccineProductCode: productCode
    };
    return this.batchInfoService.queryBatchInfo2(param);
  }
}
