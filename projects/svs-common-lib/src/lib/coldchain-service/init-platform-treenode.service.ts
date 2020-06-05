import { Injectable } from '@angular/core';
import {LocalStorageService} from '@tod/ngx-webstorage';
import {LOCAL_STORAGE} from '../base/localStorage.base';
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable()
export class InitPlatformTreenodeService {

  private  NzTreeDataNodes: any;
  constructor(private localSt: LocalStorageService) {
    const NzTreeDataNodes = this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA);
    if (NzTreeDataNodes !== null) {
      this.setNzTreeNodes(NzTreeDataNodes);
    }
  }
  setNzTreeNodes(data) {
    this.NzTreeDataNodes = data;
  }

  getNzTreeNodes() {
    return  this.NzTreeDataNodes;
  }
}
