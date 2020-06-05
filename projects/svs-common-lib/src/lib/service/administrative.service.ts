import { Injectable, OnInit } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()

/**
 * 行政区划数据
 */
export class AdministrativeService {
  /**
   * 下拉框使用的行政区划数据
   */
  private data = [];

  /**
   * 树形组件使用的行政区划数据
   */
  private treeData = [];

  constructor(private localSt: LocalStorageService) {
    const data = this.localSt.retrieve(LOCAL_STORAGE.ADMINISTRATIVE_DATA);
    if (data) {
      this.data = data;
    }
    const treeData = this.localSt.retrieve(
      LOCAL_STORAGE.ADMINISTRATIVE_TREE_DATA
    );
    if (treeData) {
      this.treeData = treeData;
    }
  }

  setAdministrativeData(data: any) {
    if (!data) return;
    this.data = data;
  }

  getAdministrativeData() {
    return this.data;
  }

  setAdministrativeTreeData(data: any) {
    if (!data) return;
    this.treeData = data;
  }

  getAdministrativeTreeData() {
    return this.treeData;
  }
}
