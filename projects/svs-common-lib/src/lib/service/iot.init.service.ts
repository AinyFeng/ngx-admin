import { Injectable } from '@angular/core';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { LOCAL_STORAGE } from '../base/localStorage.base';

@Injectable()
export class IotInitService {
  private iotData: any;

  public static INVALID_TOPIC = '000000000000';

  constructor(private localSt: LocalStorageService) {
    const data = localSt.retrieve(LOCAL_STORAGE.IOT_DATA);
    if (data) {
      this.iotData = data;
    }
  }

  setIotData(data) {
    this.iotData = data;
  }

  getIotData() {
    return this.iotData;
  }

  /**
   * 根据部门编码获取iot设备主题topic
   * @param departmentCode
   */
  getIotTopicByDepartmentCode(departmentCode: string) {
    const iot = this.iotData.filter(i => i.departmentCode === departmentCode);
    if (iot.length === 0) return [IotInitService.INVALID_TOPIC];
    const topics = [];
    iot.forEach( facility => {
      topics.push(facility['facilityTopic']);
    });
    return topics;
  }

  getObserveIotTopic() {
    const iot = this.iotData.filter(i => i.facilityType === '2');
    if (iot.length === 0) return [IotInitService.INVALID_TOPIC];
    const topics = [];
    iot.forEach( facility => {
      topics.push(facility['facilityTopic']);
    });
    return topics;
  }
}
