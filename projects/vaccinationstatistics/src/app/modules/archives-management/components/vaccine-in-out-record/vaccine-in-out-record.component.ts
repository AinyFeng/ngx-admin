import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DateUtils,
  LOCAL_STORAGE,
  QueryStatisticsService, SelectDistrictComponent, TreeDataApi,
  VaccineSubclassInitService,
  VaccManufactureDataService
} from '@tod/svs-common-lib';
import { Location } from '@angular/common';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VacOrderInfoComponent } from '../dialog/vac-order-info/vac-order-info.component';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-vaccine-in-out-record',
  templateUrl: './vaccine-in-out-record.component.html',
  styleUrls: ['./vaccine-in-out-record.component.scss']
})
export class VaccineInOutRecordComponent implements OnInit {

  queryForm: FormGroup;
  listOfData: any = [];

  loading = false;

  // 查询范围
  checkOptionsOne = [
    {label: '市', value: '20', checked: false},
    {label: '县', value: '30', checked: false},
    {label: '乡', value: '40,50', checked: false}
  ];
  // 疫苗小类
  vacSubClassData = [];
  // 生产企业
  manufactureData = [];
  // 疫苗信息
  vaccInfo: any;
  // 树组织
  treeData: any = [];
  selectedNode: any;
  // 今天日期
  currentDate = new Date();
  // 每个月的1号
  newDay: any;
  // 登录用户信息
  userInfo: any;
  areaCode: any;
  TreeData: any;
  selectFlag = false;

  constructor(
    private fb: FormBuilder,
    private vacSubClassSvc: VaccineSubclassInitService,
    private manufaSvc: VaccManufactureDataService,
    private modalSvc: NzModalService,
    private msg: NzMessageService,
    private location: Location,
    private route: ActivatedRoute,
    private user: UserService,
    private treeDataApi: TreeDataApi,
    private api: QueryStatisticsService,
    private localSt: LocalStorageService,
  ) {
    this.route.queryParams.subscribe((params: Params) => {
      console.log('vaccInfo：', params);
      this.vaccInfo = params;
    });

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
    // 获取组织树数据
    this.treeData = this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA);
    // 获取小类编码
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取生产企业
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();
    console.log('vaccInfo：', this.vaccInfo.vaccineProductName);
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.newDay = new Date(year, month, 1, 0, 0, 0);
    this.queryForm = this.fb.group({
      address: [this.vaccInfo.povName, null], // 地区编码
      areaCoding: [this.vaccInfo.povCode, null], // 地区编码
      grade: [null], // 查询范围
      batchNo: [this.vaccInfo.vaccineBatchNo, null], // 疫苗批号
      vaccineSubclassCode: [this.vaccInfo.vaccineSubclassCode, null], // 疫苗名称
      manufactureCode: [this.vaccInfo.vaccineManufactureCode, null], // 生产企业
      outboundDate: [null], // 出入库起始时间
      outboundDateBreak: [null], // 出入库截止时间
    });

  }

  // 查询数据
  queryData() {
    const params = {
      areaCoding: this.selectFlag ? this.areaCode : this.vaccInfo.povCode,
      vaccineSubclassCode: this.queryForm.get('vaccineSubclassCode').value ? this.queryForm.get('vaccineSubclassCode').value : null,
      manufactureCode: this.queryForm.get('manufactureCode').value ? this.queryForm.get('manufactureCode').value : null,
      batchno: this.queryForm.get('batchNo').value ? this.queryForm.get('batchNo').value : null,
      outboundDate: this.queryForm.get('outboundDate').value ? DateUtils.formatStartDate(this.queryForm.get('outboundDate').value) : null,
      outboundDateBreak: this.queryForm.get('outboundDateBreak').value ? DateUtils.formatEndDate(this.queryForm.get('outboundDateBreak').value) : null,
    };
    if (this.queryForm.get('grade').value) {
      const grade = this.queryForm.get('grade').value;
      let range = [];
      grade.filter(item => item.checked === true).forEach(item => {
        if (item.value.length > 2) {
          range.push(item.value.substr(0, 2));
          range.push(item.value.substr(3));
        } else {
          range.push(item.value);
        }
      });
      params['grade'] = range;
    }
    console.log('参数', params);
    this.listOfData = [];
    this.loading = true;
    this.api.queryAreaInOutDetailAndCount(params, resp => {
      console.log('结果', resp);
      this.loading = false;
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data')) {
        return;
      }
      this.listOfData = resp[0].data;
    });
  }

  // 过滤开始日期
  disabledOutboundDate = (d: Date) => {
    if (this.queryForm.value.outboundDateBreak) {
      return d > this.queryForm.value.outboundDateBreak;
    } else {
      return false;
    }
  }

  // 过滤结束日期
  disabledOutboundDateBreak = (d: Date) => {
    if (this.queryForm.value.outboundDate) {
      return d < this.queryForm.value.outboundDate;
    } else {
      return false;
    }
  }


  // 重置
  resetForm() {
    const checkOptionsOne = this.checkOptionsOne;
    checkOptionsOne.forEach(item => item.checked = false);
    this.queryForm.reset({
      range: []
    });
    this.queryForm.get('grade').setValue(checkOptionsOne);
    this.loading = false;
  }


  // 选择地址
  selectAddress() {
    const modal = this.modalSvc.create({
      nzTitle: '选择机构',
      nzContent: SelectDistrictComponent,
      nzComponentParams: {
        treeData: this.TreeData,
        hideSearchInput: false,
        // unSelectedNodeKey: 'organizationType',
        selectedNode: this.selectedNode
      },
      nzBodyStyle: {
        height: '500px',
        overflow: 'auto'
      },
      nzFooter: [
        {
          label: '确定',
          type: 'primary',
          onClick: comp => {
            modal.close(comp.selectedNode);
          }
        },
        {
          label: '取消',
          type: 'default',
          onClick: () => modal.close()
        }
      ]
    });

    // 订阅关闭时获取的数值
    modal.afterClose.pipe(take(1)).subscribe(res => {
      if (res) {
        console.log('res', res);
        this.selectedNode = res;
        /*this.orderForm.get('supplyorgName').patchValue(res.title);
       this.orderForm.get('supplyorgCode').patchValue(res.key);*/
        this.queryForm.get('address').setValue(res.title);
        this.areaCode = res.key;
        this.selectFlag = true;
        let organizationCode = this.selectedNode.organizationCode;
        let organizationType = this.selectedNode.organizationType;
        let organizationGrade = this.selectedNode.organizationGrade;
        /**
         * 说明是POV及市疾控
         * 直接按照key值作为查询条件
         */
        if (organizationType === '2') {
          this.areaCode = organizationCode;
        }
        /**
         * 说明是行政区划数据
         */
        if (organizationType === '1') {
          // 省
          if (organizationGrade === '10') {
            const provinceCode = this.selectedNode.key.substr(0, 2);
            this.areaCode = provinceCode;
          } else if (organizationGrade === '20') {
            // 市
            const cityCode = this.selectedNode.key.substr(0, 4);
            this.areaCode = cityCode;
          } else {
            // 区县
            const county = this.selectedNode.key.substr(0, 6);
            this.areaCode = county;
          }
        }
      }
    });
  }

  // 数据显示
  showData() {
    let orderConditions = JSON.parse(JSON.stringify(this.queryForm.value));
    orderConditions['outboundDate'] = DateUtils.formatStartDate(this.queryForm.get('outboundDate').value);
    orderConditions['outboundDateBreak'] = DateUtils.formatStartDate(this.queryForm.get('outboundDateBreak').value);
    const modal2 = this.modalSvc.create({
      nzTitle: '疫苗流向订单信息',
      nzContent: VacOrderInfoComponent,
      nzWidth: 1200,
      nzMask: false,
      nzComponentParams: {
        orderConditions: orderConditions
      },
      nzFooter: null
    });
  }

  // echarts数据
  /*options = {
    title: {
      subtext: '疫苗名称',
    },
    backgroundColor: '#FFFFFF',
    series: [
      {
        type: 'sankey',
        left: 50.0,
        top: 20.0,
        right: 150.0,
        bottom: 25.0,
        data: [
          {
            'name': 'Werne',
            'itemStyle': {
              'normal': {
                'color': '#f18bbf',
                'borderColor': '#f18bbf'
              }
            }
          },
          {
            'name': 'Duesseldorf',
            'itemStyle': {
              'normal': {
                'color': '#0078D7',
                'borderColor': '#0078D7'
              }
            }
          },
          {
            'name': 'Cambridge',
            'itemStyle': {
              'normal': {
                'color': '#3891A7',
                'borderColor': '#3891A7'
              }
            }
          },
          {
            'name': 'Colma',
            'itemStyle': {
              'normal': {
                'color': '#0037DA',
                'borderColor': '#0037DA'
              }
            }
          },
          {
            'name': 'W. York',
            'itemStyle': {
              'normal': {
                'color': '#C0BEAF',
                'borderColor': '#C0BEAF'
              }
            }
          },

        ],
        links: [
          {
            'source': 'FRF',
            'target': 'Colomiers',
            'value': 357.8399963378906
          },
          {
            'source': 'FRF',
            'target': 'Pantin',
            'value': 178.9199981689453
          },
          {
            'source': 'CAD',
            'target': 'Newton',
            'value': 1781.909985654056
          },
          {
            'source': 'GBP',
            'target': 'Oxon',
            'value': 493.6499986946583
          },
          {
            'source': 'CAD',
            'target': 'Calgary',
            'value': 361.3899962902069
          }],
        lineStyle: {
          normal: {
            color: 'source',
            curveness: 0.5
          }
        },
        itemStyle: {
          normal: {
            color: '#1f77b4',
            borderColor: '#1f77b4'
          }
        },
        label: {
          normal: {
            textStyle: {
              color: 'rgba(0,0,0,0.7)',
              fontFamily: 'Arial',
              fontSize: 10
            }
          }
        }
      }],
    tooltip: {
      trigger: 'item'
    }
  };*/


  goBack() {
    this.location.back();
  }
}
