import { Injectable } from '@angular/core';
import {ApiService} from '../api.service';
import {REG_OBSTETRICS_URLS} from '../url-params.const';

@Injectable({
  providedIn: 'root'
})
export class RegObstetricsService {

  constructor(private api: ApiService) { }


  query(param: any, func: Function) {
    this.api.post(REG_OBSTETRICS_URLS.query, param).subscribe(resp => func(resp));
  }

  update(param: any, func: Function) {
    this.api.put(REG_OBSTETRICS_URLS.update, param).subscribe(resp => func(resp));
  }

}
