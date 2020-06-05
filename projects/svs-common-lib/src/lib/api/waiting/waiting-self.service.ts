import { Injectable } from '@angular/core';
import { WAIT_SELF } from '../url-params.const';
import { ApiService } from '../api.service';

@Injectable()
export class WaitingSelfService {
  constructor(private api: ApiService) {}

  getCurrentCount(param: any, func: Function) {
    const url = WAIT_SELF.selfMachine;
    this.api.post(url, param).subscribe(result => func(result));
  }

  profileSearch(param: any, func: Function) {
    const url = WAIT_SELF.profileSearch;
    this.api.post(url, param).subscribe(result => func(result));
  }
}
