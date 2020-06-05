import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {SelectAddressComponent} from '../../../common/dialog/select-address/select-address.component';

import {
  VaccineSubclassInitService,
  VaccManufactureDataService,
  VaccBroadHeadingDataService,
  TreeDataApi
} from '@tod/svs-common-lib';
import {UserService} from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-adult-rabies-statistics',
  templateUrl: './adult-rabies-statistics.component.html',
  styleUrls: ['./adult-rabies-statistics.component.scss']
})
export class AdultRabiesStatisticsComponent implements OnInit {


  listForm: FormGroup;

  listOfData: any = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;

  // 疫苗小类
  vacSubClassData = [];
  // 疫苗大类
  vacBroadHeaderData = [];
  // 生产企业
  manufactureData = [];
  userInfo: any;
  areaCode: any;
  TreeData: any;
  constructor(
    private fb: FormBuilder,
    private vacSubClassSvc: VaccineSubclassInitService,
    private manufaSvc: VaccManufactureDataService,
    private modalSvc: NzModalService,
    private msg: NzMessageService,
    private vacBroadHeaderSvc: VaccBroadHeadingDataService,
    private user: UserService,
    private treeDataApi: TreeDataApi
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      this.areaCode = this.userInfo.pov.slice(0, 4);
      this.treeDataApi.queryTreeDataByCityCode(this.areaCode, resp2 => {
        if (resp2['code'] === 0) {
          this.TreeData = resp2['data'];
          console.log('树数据', this.TreeData);
          // 进来默认选中树的根节点
          /*this.initSelect = this.userInfo.pov;*/
        }
      });
      console.log('用户所在的市code====', this.areaCode);
    });
  }

  ngOnInit() {
    // 获取小类编码
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取生产企业
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();
    // 获取疫苗大类
    this.vacBroadHeaderData = this.vacBroadHeaderSvc.getVaccBoradHeadingData();

    this.listForm = this.fb.group({
      address: [null], // 地区
      vacSbuClassCode: [null], // 疫苗名称(小类)
      manufacturerCode: [null], // 生产企业
      vacBroadHeaderCode: [null], // 疫苗大类
      batchNo: [null], // 疫苗批号
      startTime: [null], // 开始信息
      endTime: [null], // 结束信息
    });
  }

  // 查询
  queryData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
  }

  // 重置
  resetForm() {
    this.listForm.reset();
    this.loading = false;
  }

  // 选择地区
  selectAddress(): void {
    const modal = this.modalSvc.create({
      nzTitle: '选择机构',
      nzContent: SelectAddressComponent,
      nzWidth: 500,
      nzClosable: false,
      nzComponentParams: {
        areaCode: this.areaCode, /*当前的areaCode*/
        TreeData: this.TreeData
      },
      nzMask: false,
      nzFooter: [
        {
          label: '确定',
          type: 'primary',
          onClick: componentInstance => {
            if (componentInstance.selectedNode) {
              console.log('已选中的地区节点------', componentInstance.selectedNode);
              this.listForm.get('address').setValue(componentInstance.selectedNode.title);
              this.areaCode = componentInstance.selectedNode.areaCode;
              modal.destroy();
              componentInstance.selectedNode = null;
            } else {
              this.msg.warning('请选择机构');
              return;
            }
          }
        },
        {
          label: '关闭',
          onClick: () => {
            modal.destroy();
          }
        }
      ]
    });
  }
}
