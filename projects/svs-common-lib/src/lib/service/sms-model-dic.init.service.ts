import {Injectable} from '@angular/core';
import {LOCAL_STORAGE} from '../base/localStorage.base';
import {LocalStorageService} from '@tod/ngx-webstorage';

@Injectable()
export class SmsModelDicInitService {
  smsModelDic: any;

  constructor(private localSt: LocalStorageService) {
    const smsModelDictionary = this.localSt.retrieve(
      LOCAL_STORAGE.SMS_MODEL_DIC
    );
    if (smsModelDictionary !== null) {
      this.setSmsModelDic(smsModelDictionary);
    }
  }

  setSmsModelDic(data) {
    this.smsModelDic = data;
  }

  getSmsModelDic() {
    return this.smsModelDic;
  }
}
