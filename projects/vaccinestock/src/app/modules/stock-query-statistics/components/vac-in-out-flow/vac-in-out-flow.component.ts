import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {
  VaccineSubclassInitService,
  VaccManufactureDataService,
  LOCAL_STORAGE,
  QueryStatisticsService,
  SelectDistrictComponent,
  DateUtils

} from '@tod/svs-common-lib';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {VacOrderInfoComponent} from '../dialog/vac-order-info/vac-order-info.component';
import {LocalStorageService} from '@tod/ngx-webstorage';
import {take} from 'rxjs/operators';

@Component({
  selector: 'uea-vac-in-out-flow',
  templateUrl: './vac-in-out-flow.component.html',
  styleUrls: ['./vac-in-out-flow.component.scss']
})
export class VacInOutFlowComponent implements OnInit {
  queryForm: FormGroup;
  listOfData: any = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
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
  // 树组织
  treeData: any = [];
  selectedNode: any;
  // 今天日期
  currentDate = new Date();
  // 每个月的1号
  newDay: any;

  // 桑基图配置
  options = {};

  constructor(
    private fb: FormBuilder,
    private vacSubClassSvc: VaccineSubclassInitService,
    private manufaSvc: VaccManufactureDataService,
    private modalSvc: NzModalService,
    private msg: NzMessageService,
    private api: QueryStatisticsService,
    private localSt: LocalStorageService,
  ) {

  }

  ngOnInit() {
    // 获取组织树数据
    this.treeData = this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA);
    // 获取小类编码
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取生产企业
    this.manufactureData = this.manufaSvc.getVaccProductManufactureData();

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.newDay = new Date(year, month, 1, 0, 0, 0);
    this.queryForm = this.fb.group({
      address: [null, [Validators.required]], // 地区编码
      areaCoding: [null], // 地区编码
      grade: [null], // 查询范围
      batchNo: [null], // 疫苗批号
      vaccineSubclassCode: [null], // 疫苗名称
      manufactureCode: [null], // 生产企业
      outboundDate: [new Date(DateUtils.formatStartDate(this.newDay)), null], // 出入库起始时间
      outboundDateBreak: [new Date(DateUtils.formatEndDate(this.currentDate)), null], // 出入库截止时间
    });
    // this.queryData();
  }

  // 日期限制
  disabledStart = (d: Date) => {
    return d > new Date();
  }
  disabledEnd = (d: Date) => {
    return d > new Date();
  }

  // 查询数据
  queryData(page = 1) {
    for (const i in this.queryForm.controls) {
      if (this.queryForm.controls[i]) {
        this.queryForm.controls[i].markAsDirty();
        this.queryForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.queryForm.invalid) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: '请将查询条件填写完整',
        nzMaskClosable: true
      });
      return;
    }
    if (this.loading) return;
    this.pageIndex = page;
    if (!this.queryForm.get('outboundDate').value && !this.queryForm.get('outboundDateBreak').value) {
      this.queryForm.get('outboundDate').patchValue(new Date(this.newDay));
      this.queryForm.get('outboundDateBreak').patchValue(new Date(this.currentDate));
    }
    const outboundDate = this.queryForm.get('outboundDate').value;
    const outboundDateBreak = this.queryForm.get('outboundDateBreak').value;
    if (outboundDate && outboundDateBreak) {
      if (outboundDate > outboundDateBreak) {
        this.modalSvc.warning({
          nzTitle: '提示',
          nzContent: '选择的开始时间晚于结束时间,请重新选择',
          nzMaskClosable: true
        });
        return;
      }
    } else {
      if (outboundDate) {
        this.modalSvc.warning({
          nzTitle: '提示',
          nzContent: '请选择结束时间',
          nzMaskClosable: true
        });
        return;
      }
      if (outboundDateBreak) {
        this.modalSvc.warning({
          nzTitle: '提示',
          nzContent: '请选择开始时间',
          nzMaskClosable: true
        });
        return;
      }
    }
    const params = {
      grade: null,
      areaCoding: this.queryForm.get('areaCoding').value ? this.queryForm.get('areaCoding').value : null,
      vaccineSubclassCode: this.queryForm.get('vaccineSubclassCode').value ? this.queryForm.get('vaccineSubclassCode').value : null,
      manufactureCode: this.queryForm.get('manufactureCode').value ? this.queryForm.get('manufactureCode').value : null,
      batchno: this.queryForm.get('batchNo').value ? this.queryForm.get('batchNo').value : null,
      outboundDate: this.queryForm.get('outboundDate').value ? DateUtils.formatStartDate(this.queryForm.get('outboundDate').value) : null,
      outboundDateBreak: this.queryForm.get('outboundDateBreak').value ? DateUtils.formatEndDate(this.queryForm.get('outboundDateBreak').value) : null,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
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
      if (!resp || resp[1].code !== 0 || !resp[1].hasOwnProperty('data')) {
        return;
      }
      this.total = resp[1].data[0].count;
    });
  }

  // 重置
  resetForm() {
    this.queryForm.reset({
      range: []
    });
  }

  // 选择地区
  selectAddress(): void {
    const modal = this.modalSvc.create({
      nzTitle: '选择机构',
      nzContent: SelectDistrictComponent,
      nzComponentParams: {
        treeData: this.treeData,
        hideSearchInput: false,
        // unSelectedNodeKey: 'organizationType'
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
        this.selectedNode = res;
        this.queryForm.get('address').patchValue(res.title);
        /**
         * 说明是POV及市疾控
         * 直接按照key值作为查询条件
         */
        if (res['organizationType'] === '2') {
          this.queryForm.get('areaCoding').patchValue(res.key);
        }
        /**
         * 说明是行政区划数据
         */
        if (res['organizationType'] === '1') {
          // 省
          if (res['organizationGrade'] === '10') {
            const provinceCode = res.key.substr(0, 2);
            this.queryForm.get('areaCoding').patchValue(provinceCode);
          } else if (res['organizationGrade'] === '20') {
            // 市
            const cityCode = res.key.substr(0, 4);
            this.queryForm.get('areaCoding').patchValue(cityCode);
          } else {
            // 区县
            this.queryForm.get('areaCoding').patchValue(res.key);
          }
        }
      }
    });

  }

  // 数据显示
  showData() {
    for (const i in this.queryForm.controls) {
      if (this.queryForm.controls[i]) {
        this.queryForm.controls[i].markAsDirty();
        this.queryForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.queryForm.invalid) {
      this.modalSvc.warning({
        nzTitle: '提示',
        nzContent: '请将查询条件填写完整',
        nzMaskClosable: true
      });
      return;
    }
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

  // 初始化桑基图
  initEcharts() {
    this.options = {};
    let options = {
      title: {
        subtext: '疫苗名称',
        color: '#000000'
      },
      backgroundColor: '#FFFFFF',
      // 工具提示
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          // 图的类型
          type: 'sankey', // 桑基图类型
          left: 50.0,
          top: 20.0,
          right: 150.0,
          bottom: 25.0,
          // 图中所用数据，就是上面引入的数据，包括节点和关联两部分
          data: [
            {'name': 'Andriod3'},
            {'name': '服务频道2'},
            {'name': '其它2'},
            {'name': '服务频道4'},
            {'name': '服务频道3'},
            {'name': '乙方2'},
            {'name': '乙方3'},
            {'name': '其它3'},
            {'name': 'Andriod4'},
            {'name': 'Andriod2'},
            {'name': '其它4'},
            {'name': 'Andriod1'},
            {'name': '乙方4'},
            {'name': '乙方5'},
            {'name': 'Andriod5'},
            {'name': '服务频道5'},
            {'name': '其它5'},
          ],
          links: [
            {'source': 'Andriod1', 'target': 'Andriod2', 'value': '65'},
            {'source': '乙方3', 'target': 'Andriod4', 'value': '1'},
            {'source': '乙方2', 'target': 'Andriod3', 'value': '1'},
            {'source': '服务频道3', 'target': 'Andriod4', 'value': '2'},
            {'source': 'Andriod2', 'target': 'Andriod3', 'value': '48'},
            {'source': '服务频道2', 'target': '其它3', 'value': '1'},
            {'source': '乙方2', 'target': '服务频道3', 'value': '1'},
            {'source': 'Andriod3', 'target': 'Andriod4', 'value': '35'},
            {'source': 'Andriod2', 'target': '服务频道3', 'value': '3'},
            {'source': 'Andriod4', 'target': '服务频道5', 'value': '3'},
            {'source': 'Andriod3', 'target': '乙方4', 'value': '1'},
            {'source': 'Andriod1', 'target': '服务频道2', 'value': '6'},
            {'source': '服务频道2', 'target': '服务频道3', 'value': '2'},
            {'source': '其它2', 'target': 'Andriod3', 'value': '1'},
            {'source': '服务频道4', 'target': 'Andriod5', 'value': '1'},
            {'source': 'Andriod2', 'target': '乙方3', 'value': '1'},
            {'source': 'Andriod1', 'target': '乙方2', 'value': '2'},
            {'source': '服务频道2', 'target': 'Andriod3', 'value': '1'},
            {'source': 'Andriod1', 'target': '其它2', 'value': '1'},
            {'source': '乙方4', 'target': 'Andriod5', 'value': '1'},
            {'source': '服务频道3', 'target': '服务频道4', 'value': '3'},
            {'source': 'Andriod4', 'target': 'Andriod5', 'value': '26'},
          ],
          itemStyle: {
            normal: {
              borderWidth: 1,
              borderColor: '#aaa'
            }
          },
          // 线条样式
          lineStyle: {
            normal: {
              curveness: 0.5
            }
          }
          // 线条样式
          /*lineStyle: {
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
          }*/
        }
      ]
    };
    this.options = {...options};
  }


}
