import { Component, OnInit } from '@angular/core';
import { SelectAddressComponent } from '../common/dialog/select-address/select-address.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ApiAdminDailyManagementService,
  DateUtils,
  TreeDataApi,
  VaccBroadHeadingDataService,
  VaccineSubclassInitService,
  VaccManufactureDataService
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { AEFIService } from './aefi.service';

@Component({
  selector: 'uea-vaccine-aefi-manage',
  templateUrl: './vaccine-aefi-manage.component.html',
  styleUrls: ['./vaccine-aefi-manage.component.scss']
})
export class VaccineAefiManageComponent implements OnInit {
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
  povName: any;
  areaCode: any;
  TreeData: any;
  name: any;
  // 初始化时间值
  endBirthDate = new Date();
  startBirthDate = new Date().setDate(this.endBirthDate.getDate() - 6);
  endDate = new Date();
  startDate = new Date().setDate(this.endDate.getDate() - 6);

  constructor(
    private fb: FormBuilder,
    private vacSubClassSvc: VaccineSubclassInitService,
    private manufaSvc: VaccManufactureDataService,
    private modalSvc: NzModalService,
    private msg: NzMessageService,
    private vacBroadHeaderSvc: VaccBroadHeadingDataService,
    private user: UserService,
    private treeDataApi: TreeDataApi,
    private aefiService: AEFIService,
  ) {
  }

  ngOnInit() {
    this.listForm = this.fb.group({
      code: [null], // 发生地区
      reportCode: [null], // 报告单位
      childName: [null], // 儿童姓名
      gender: [null], // 性别
      vaccineSubclassCode: [null], // 疫苗名称
      vaccineManufactureCode: [null], // 生产厂商
      startBirthDate: [null], // 出生开始时间
      endBirthDate: [null], // 出生结束时间
      vaccineBatchNo: [null], // 疫苗批号
      hospitalType: [null], // 住院类型
      startDate: [null], // AEFI开始时间
      endDate: [null], // AEFI结束时间
      vaccType: [null], // 疫苗类型
    });
  }

  // 选择地区和门诊
  selectAddress(): void {
    const modal = this.modalSvc.create({
      nzTitle: '选择机构',
      nzContent: SelectAddressComponent,
      nzWidth: 500,
      nzClosable: false,
      nzComponentParams: {
        areaCode: this.areaCode, /*当前的选中的节点*/
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
              this.areaCode = componentInstance.selectedNode.key;
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

  // 查询
  queryData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    const params = {
      code: this.listForm.value.code, // 发生地区
      reportCode: this.listForm.value.reportCode, // 报告单位
      childName: this.listForm.value.childName, // 儿童姓名
      gender: this.listForm.value.gender, // 性别
      vaccineSubclassCode: this.listForm.value.vaccineSubclassCode, // 疫苗名称
      vaccineManufactureCode: this.listForm.value.vaccineManufactureCode, // 生产厂商
      startBirthDate: DateUtils.formatStartDate(this.listForm.value.startBirthDate), // 出生开始时间
      endBirthDate: DateUtils.formatStartDate(this.listForm.value.endBirthDate), // 出生结束时间
      vaccineBatchNo: this.listForm.value.vaccineBatchNo, // 疫苗批号
      hospitalType: this.listForm.value.hospitalType, // 住院类型
      startDate: DateUtils.formatStartDate(this.listForm.value.startDate), // 出生开始时间
      endDate: DateUtils.formatStartDate(this.listForm.value.endDate), // 出生结束时间
      vaccType: this.listForm.value.vaccType, // 疫苗类型
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.loading = true;
    this.aefiService.queryAEFIReportList(params, (queryData, countData) => {
      this.loading = false;
      console.log('返回来的数据', queryData, countData);
      if (
        queryData && queryData.code === 0 && queryData.hasOwnProperty('data')) {
        this.listOfData = queryData.data;
      } else {
        this.listOfData = [];
        this.msg.warning('未查询到数据');
      }
      if (
        countData &&
        countData.code === 0 &&
        countData.hasOwnProperty('data')
      ) {
        this.total = countData.data[0]['count'];
      }
    });
  }

  // 重置
  resetForm() {
    this.listForm.reset();
    this.loading = false;
  }


  /**
   * 过滤开始日期
   * @param d
   */
  disabledStartDate = (d: Date) => {
    if (this.listForm.value.endTime) {
      return d > this.listForm.value.endTime;
    } else {
      return false;
    }
  }
  /**
   * 过滤开始日期
   * @param d
   */
  disabledEndDate = (d: Date) => {
    if (this.listForm.value.startTime) {
      return d < this.listForm.value.startTime;
    } else {
      return false;
    }
  }

  transerCheckStatus(status) {
    if (status === 0) {
      return '未审核';
    } else {
      return '已审核';
    }
  }

  transerhospitalType(hospitalType) {
    if (hospitalType === 1) {
      return '住院';
    } else if (hospitalType === 2) {
      return '未住院';
    } else {
      return '不详';
    }
  }

  transerTrueFalse(result) {
    if (result === 1) {
      return '是';
    } else {
      return '否';
    }
  }

  transerGender(gender) {
    if (gender === 'm') {
      return '男';
    } else if (gender === 'f') {
      return '女';
    } else {
      return '不详';
    }
  }
}
