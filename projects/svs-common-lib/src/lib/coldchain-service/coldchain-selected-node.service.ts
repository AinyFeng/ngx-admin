import { Injectable } from '@angular/core';
import {LocalStorageService} from '@tod/ngx-webstorage';
import {LOCAL_STORAGE} from '../base/localStorage.base';
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable()
export class ColdchainSelectedNodeService {
  // 市平台组织结构树已选中的节点
  private  selectedNode$ = new BehaviorSubject<any>(null);

  setNzTreeSelectedNode(data) {
    this.selectedNode$.next(data);
  }

  getNzTreeSelectedNode(): Observable<any> {
    return this.selectedNode$.asObservable();
  }

  getOringerNode() {
    return this.selectedNode$.getValue();
  }
}
