import {Injectable} from '@angular/core';
import {LocalStorageService} from '@tod/ngx-webstorage';
import {LOCAL_STORAGE} from '../base/localStorage.base';

@Injectable()
export class RabiesStrategyProgramService {
  value: any;

  constructor(private localSt: LocalStorageService) {
    const programName = this.localSt.retrieve(
      LOCAL_STORAGE.RABIES_INJECT_STRATEGY
    );
    if (programName !== null) {
      this.setProgramsData(programName);
    }
  }

  setProgramsData(data) {
    this.value = data;
  }

  getProgramsData() {
    return this.value;
  }
}
