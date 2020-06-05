import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { take } from 'rxjs/operators';
import {
  DateUtils, DepartmentInfoService,
  DicDataService, LOCAL_STORAGE,
  SelectDistrictComponent,
  VaccManufactureDataService,
  VacStockStorageApi,
  VacStockApprovalApiService
} from '@tod/svs-common-lib';
import { UserService } from '@tod/uea-auth-lib';
import { VaccineBatchInfoComponent } from '../../../stock-shared/components/vaccine-batch-info/vaccine-batch-info.component';
import { LocalStorageService } from '@tod/ngx-webstorage';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'uea-stock-in',
  templateUrl: './stock-in.component.html',
  styleUrls: ['./stock-in.component.scss']
})
export class StockInComponent implements OnInit, OnDestroy {

  orderForm: FormGroup;

  userInfo: any;

  today = new Date();
  /**
   * 选择单位
   */
  selectedNode: any;
  /**
   * 已选择的批次号信息
   */
  batchNoData = [];
  /**
   * 树形结构数据
   */
  treeData = [];

  supplyorgNameOptions = [
    { label: '上级疾控', value: '1' },
    { label: '生产厂商', value: '2' },
    { label: '其他', value: '3' }
  ];
  /**
   * 生产厂家下拉框
   */
  manufactureOptions: any;
  /**
   * 疫苗运输方式
   */
  transportationOptions: any;
  /**
   * 冷藏方式类型选项
   */
  refrigerateTypeOptions: any;
  /**
   * 当前编辑id
   */
  editId: string;
  /**
   * 全选待定
   */
  isIndeterminate = false;
  /**
   * 显示全选
   */
  isAllDisplayDataChecked = false;
  /**
   * rxjs 订阅集合
   */
  private subscription: Subscription[] = [];
  /**
   * pov 信息
   */
  povInfo: any;
  /**
   * 合计入库数量
   */
  total = 0;

  // 跳转的传参
  updateOrderDate: any;
  /**
   * 是否是阿里平台
   */
  isAli = false;


  stopEdit(data?: any) {
    this.editId = null;
    if (data) {
      const originPrice = data['orignPrice'];
      const sellPrice = data['sellPrice'];
      if (originPrice === 0) {
        data['sellPrice'] = 0;
        return;
      }
      if (sellPrice - originPrice < 10) {
        data['sellPrice'] = data['orignPrice'] + 10;
      }
    }
    this.calculateTotal();
  }

  constructor(private fb: FormBuilder,
              private modalService: NzModalService,
              private userSvc: UserService,
              private dicSvc: DicDataService,
              private localSt: LocalStorageService,
              private departmentApiSvc: DepartmentInfoService,
              private vasStockStorageApiSvc: VacStockStorageApi,
              private notifierService: NotifierService,
              private manufactureInitSvc: VaccManufactureDataService,
              public route: ActivatedRoute,
              private vacStockApprovalSvc: VacStockApprovalApiService,
              private location: Location,
  ) {
    // 跳转传来的参数
    const sub = this.route.queryParams.subscribe(resp => {
      if (resp.hasOwnProperty('orderNo')) {
        this.updateOrderDate = resp;
        // 查看疫苗详情
        this.queryDetail();
      }
    });
    this.subscription.push(sub);

    this.orderForm = fb.group({
      orderDate: [this.today, [Validators.required]], // 入库时间，入库日期
      orderType: ['1', [Validators.required]], // 类型
      supplyorgName: [null, [Validators.required]], // 供货单位名称
      consignorName: [null], // 供货单位经手人
      supplyorgCode: [null], // 供货单位编码
      supplyorgNameOption: ['1'], // 供货单位选项，这个并不是数据表中的字段
      distributionUnit: [], // 配送单位
      receiveorgName: [null, [Validators.required]], // 收货单位
      consigneeName: [null, [Validators.required]], // 收货单位经手人
      receiveorgCode: [null, [Validators.required]], // 收货单位编码
      transportation: ['1', [Validators.required]], // 疫苗运输方式
      otherTransportation: [null], // 疫苗运输方式其它
      refrigerateType: ['1', [Validators.required]], // 冷藏方式
      otherRefrigerateType: [null, [Validators.required]], // 冷藏方式其它
      memo: [], // 备注信息
      createBy: [null, [Validators.required]], // 创建人，与录入人一致
      createorgName: [null, [Validators.required]], // 录入单位
      entrystaffName: [null, [Validators.required]], // 录入人姓名
      createorgCode: [null, [Validators.required]], // 录入单位编码
      vaccineType: ['0'], // 疫苗类型,
      orderNo: [null], // 订单号
      orderStatus: [null], // 订单状态
    });
    this.manufactureOptions = this.manufactureInitSvc.getVaccProductManufactureData();
    userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
      if (user) {
        // 收货单位 - 编码
        this.orderForm.get('consigneeName').patchValue(this.userInfo.name); // 收货单位经手人
        this.orderForm.get('receiveorgCode').patchValue(this.userInfo.pov); // 收货单位编码
      }
    });
    this.transportationOptions = dicSvc.getDicDataByKey('transportationType');
    this.refrigerateTypeOptions = dicSvc.getDicDataByKey('refrigerateType');

  }

  ngOnInit() {
    // 获取组织树数据
    this.treeData = this.localSt.retrieve(LOCAL_STORAGE.PLATEFORM_TREE_DATA);

    const officeData = this.localSt.retrieve(LOCAL_STORAGE.PLATFORM_OFFICE);
    if (officeData) {
      this.orderForm.get('receiveorgName').setValue(officeData.organizationName);
    }

    const sub1 = this.orderForm.get('refrigerateType').valueChanges.subscribe(type => {
      // 冷藏类型为其他
      if (type === '3') {
        this.orderForm.get('otherRefrigerateType').setValidators(Validators.required);
        this.orderForm.get('otherRefrigerateType').markAsDirty();
      } else {
        this.orderForm.get('otherRefrigerateType').clearValidators();
        this.orderForm.get('otherRefrigerateType').markAsPristine();
      }
      this.orderForm.get('otherRefrigerateType').updateValueAndValidity();
    });
    this.subscription.push(sub1);

    const sub2 = this.orderForm.get('transportation').valueChanges.subscribe(type => {
      // 运输类型为其他
      if (type === '3') {
        this.orderForm.get('otherTransportation').setValidators(Validators.required);
        this.orderForm.get('otherTransportation').markAsDirty();
      } else {
        this.orderForm.get('otherTransportation').clearAsyncValidators();
        this.orderForm.get('otherTransportation').markAsPristine();
      }
      this.orderForm.get('otherTransportation').updateValueAndValidity();
    });
    this.subscription.push(sub2);

    // 更新
    if (this.updateOrderDate) {
      for (const key in this.updateOrderDate) {
        if (this.updateOrderDate.hasOwnProperty(key)) {
          if (this.orderForm.value.hasOwnProperty(key)) {
            if (key === 'orderDate') {
              this.orderForm.controls['orderDate'].patchValue(new Date(parseInt(this.updateOrderDate['orderDate'], 10)));
            } else {
              this.orderForm.controls[key].patchValue(this.updateOrderDate[key]);
            }
          }
        }
      }
    }
  }

  // 查看详情
  queryDetail() {
    const params = {
      serialCode: this.updateOrderDate.serialCode,
    };
    this.batchNoData = [];
    this.vacStockApprovalSvc.queryStockApprovalDetail(params, resp => {
      console.log('结果', resp);
      if (!resp || resp.code !== 0 || !resp.hasOwnProperty('data')) {
        return;
      }
      this.batchNoData = resp.data;
      this.batchNoData.forEach(item => item.checked = true);
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  startEdit(id: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editId = id;
  }

  /**
   * 填写表单必要信息
   */
  fillInForm() {
    // 填写录入人相关信息，录入人为当前系统登录用户
    this.orderForm.get('createorgName').patchValue(this.userInfo.name); // 录入单位名称
    this.orderForm.get('entrystaffName').patchValue(this.userInfo.name); // 录入人名称
    this.orderForm.get('createorgCode').patchValue(this.userInfo.pov); // 录入单位编码

    // 创建人
    this.orderForm.get('createBy').setValue(this.userInfo.userCode);
  }

  /**
   * 选择收货单位
   */
  selectDistrict() {
    const modal = this.modalService.create({
      nzTitle: '选择单位',
      nzContent: SelectDistrictComponent,
      nzComponentParams: {
        treeData: this.treeData,
        hideSearchInput: false,
        unSelectedNodeKey: 'organizationType'
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
        this.orderForm.get('supplyorgName').patchValue(res.title);
        this.orderForm.get('supplyorgCode').patchValue(res.key);
      }
    });
  }

  /**
   * 发生变化之后重置供货单位名称和供货单位编码
   */
  resetSupplyOrg() {
    this.orderForm.get('supplyorgName').patchValue(null);
    this.orderForm.get('supplyorgCode').patchValue(null);
  }

  submitForm(): void {
    // 表单填写
    this.fillInForm();
    for (const i in this.orderForm.controls) {
      if (this.orderForm.controls[i]) {
        this.orderForm.controls[i].markAsDirty();
        this.orderForm.controls[i].updateValueAndValidity();
      }
    }
    // 检查冷藏方式和运输方式
    console.log(this.orderForm);
    if (this.orderForm.invalid) {
      this.modalService.warning({
        nzTitle: '提示',
        nzContent: `<p>表格填写不完整，请检查</p>`,
        nzMaskClosable: true
      });
      return;
    }
    // 检查疫苗填写数量是否有效和是否选择
    if (!this.checkStorageNumSelectedAndValid()) {
      return;
    }
    if (this.updateOrderDate) {
      let updateParams = this.orderForm.value;
      // 填写疫苗信息
      const vaccInfo = this.fillInVaccineInfo();
      updateParams['queryBatchOutparam'] = [...vaccInfo];
      updateParams['vaccineType'] = this.orderForm.get('vaccineType').value;
      updateParams['orderDate'] = DateUtils.getTimestamp(this.orderForm.get('orderDate').value);
      updateParams['memo'] = this.orderForm.get('memo').value;
      updateParams['orderStatus'] = this.updateOrderDate.orderStatus;
      updateParams['serialCode'] = this.updateOrderDate.serialCode;
      updateParams['orderType'] = this.updateOrderDate.orderType;
      updateParams['createDate'] = '';
      updateParams['createorgName'] = this.updateOrderDate.createorgName;
      updateParams['entrystaffName'] = this.updateOrderDate.entrystaffName;
      updateParams['createorgCode'] = this.updateOrderDate.createorgCode;
      updateParams['createBy'] = this.updateOrderDate.createBy;
      updateParams['isPay'] = this.updateOrderDate.isPay;
      updateParams['tempStatus'] = this.updateOrderDate.tempStatus;
      updateParams['orderNo'] = this.updateOrderDate.orderNo;
      console.log('updateParams', updateParams);
      this.vacStockApprovalSvc.updateOrder(updateParams, resp => {
        console.log('更新订单', resp);
        if (resp && resp.code === 0) {
          this.notifierService.notify('success', '成功');
          this.resetTable();
          this.calculateTotal(); // 清空数量
        }
      });

    } else {
      const params = this.orderForm.value;
      // 填写疫苗信息
      const vaccInfo = this.fillInVaccineInfo();
      params['queryBatchOutparam'] = [...vaccInfo];
      params['orderDate'] = DateUtils.getFormatTime(params['orderDate']);
      console.log('入库参数', params);

      // 填写疫苗库存信息
      this.vasStockStorageApiSvc.storage(params, res => {
        console.log('疫苗入库返回值', res);
        if (res.code === 0) {
          this.notifierService.notify('success', '入库成功');
          this.resetTable();
          this.calculateTotal();
        }
      });
    }
  }

  resetTable() {
    this.batchNoData = [];
  }

  /**
   * 选择供货单位
   * @param ev
   */
  selectSupplyorg(ev) {
    const manufacture = this.getManufactureInfoByCode(ev);
    if (!manufacture) return;
    this.orderForm.get('supplyorgName').patchValue(manufacture.name);
  }

  /**
   * 根据厂商编码查询厂商信息
   * @param code
   */
  getManufactureInfoByCode(code: string) {
    if (!code) return undefined;
    return this.manufactureOptions.find(m => m.code === code);
  }

  /**
   * 过滤日期
   * @param d
   */
  disabledDate = (d: Date) => {
    return d > this.today;
  }

  /**
   * 选择批号信息
   * ailhealthSerialCode: "229cadf1b14440a89e2e25a6d531a752"
   batchNo: "E20190312"
   approvalLicenceNo: "国药准字S20120005"
   entName: "北京民海生物科技有限公司"
   expireDate: 1615564800000
   produceDateStr: "2019-03-14"
   serialCode: "229cadf1b14440a89e2e25a6d531a752"
   packageCode: "81751450206191950969"
   refEntAliCode: "320000000000092523"
   codeStatus: "O"
   packageLevel: 1
   physicTypeDesc: "普通药品"
   prepnTypeDesc: "注射剂"
   drugEntBaseInfoCode: "60c8c8e26c1545b7b15f9ea0ffa44bf1"
   exprie: "24月"
   prepnSpec: "每瓶为0.5ml。每1次人用剂量为0.5ml,含纯化b型流感嗜血杆菌荚膜多糖应不低于10μg。"
   pkgSpecCrit: "1支/盒"
   physicName: "b型流感嗜血杆菌结合疫苗"
   localCode: "3411260101"
   createTime: 1578366658000
   createBy: "3411260101009"
   stockStatus: "0"
   pkgAmount: 1
   checked: true
   vaccName: "b型流感嗜血杆菌结合疫苗"
   manufactureName: "北京民海生物科技有限公司"
   outBoundDate: 1615564800000
   spec: "1支/盒"
   dose: "每瓶为0.5ml。每1次人用剂量为0.5ml,含纯化b型流感嗜血杆菌荚膜多糖应不低于10μg。"
   ailhealthPackageCode: "81751450206191950969"
   vaccNum: 1
   orignPrice: 0
   sellPrice: 0
   */
  selectBatchNo(isAli = false) {
    this.isAli = isAli;
    const modal = this.modalService.create({
      nzTitle: isAli ? '选择阿里平台入库批号' : '疫苗批号信息',
      nzContent: VaccineBatchInfoComponent,
      nzComponentParams: {
        isAliPlatform: isAli,
        selectedVacData: JSON.parse(JSON.stringify(this.batchNoData))
      },
      nzWidth: '1300px',
      nzFooter: null
    });

    modal.afterClose.pipe(take(1)).subscribe(res => {
      console.log('批号', res);
      if (res) {
        if (!isAli) {
          res.forEach(r => {
            r['vaccNum'] = 0;
            r['orignPrice'] = 0;
            r['sellPrice'] = 0;
          });
        } else {
          res.forEach(r => {
            r['vaccNum'] = r['pkgAmount'];
            r['orignPrice'] = 0;
            r['sellPrice'] = 0;
          });
        }
        const batchNoData = this.batchNoData;
        res.forEach(r => {
          if (isAli) {
            const vac = this.batchNoData.find(b =>
              b['ailhealthSerialCode'] + b['packageCode'] === r['ailhealthSerialCode'] + r['packageCode']);
            if (!vac) {
              batchNoData.push(r);
            }
          } else {
            const vac = this.batchNoData.find(b => b['batchSerialCode'] === r['batchSerialCode']);
            if (!vac) {
              batchNoData.push(r);
            }
          }
        });
        /**
         * 阿里数据，需要刷数据字段
         * 刷数据字段，比如疫苗类型需要将字段名从 prepnTypeDesc 修改为 containerType
         */
        if (isAli) {
          batchNoData.forEach(bnd => {
            bnd['containerType'] = bnd['prepnTypeDesc'];
          });
        }
        this.batchNoData = [...this.batchNoData];
        console.log(this.batchNoData);
        this.calculateTotal();
      }
    });
  }

  setFocus(temp: any) {
    temp.focus();
  }

  /**
   * 检查是否选择了疫苗
   */
  checkStorageNumSelectedAndValid() {
    console.log('数据', this.batchNoData);
    const d = this.batchNoData.filter(b => b.checked);
    // 检查是否选择
    if (d.length === 0) {
      this.modalService.warning({
        nzTitle: '提示',
        nzContent: `<p>请选择疫苗</p>`,
        nzMaskClosable: true
      });
      return false;
    }
    // 检查数量有效性
    const dv = d.filter(b => !b.hasOwnProperty('vaccNum') || !b.vaccNum || b.vaccNum === 0);
    if (dv.length > 0) {
      this.modalService.warning({
        nzTitle: '消息提示',
        nzContent: `<p>入库数量不合法，请重新填写</p>`,
        nzMaskClosable: true
      });
      return false;
    }
    // 检查疫苗类型 一类 - 0，二类 - 1
    const vaccineType = this.orderForm.get('vaccineType').value;
    // 判断每一个疫苗批号信息中的类型与订单主表类型是否一致
    const typeRet = this.batchNoData.every(b => b.type === vaccineType);
    if (!typeRet) {
      this.modalService.warning({
        nzTitle: '消息提示',
        nzContent: `<p>订单的【疫苗类型】与所选疫苗的【属性】不一致</p>`,
        nzMaskClosable: true
      });
      return false;
    }
    // 当疫苗类型为二类时，成本价格或者售出价格不可为空
    if (vaccineType === '1') {
      const priceRet = this.batchNoData.some(b => b['orignPrice'] === 0 || b['sellPrice'] === 0);
      if (priceRet) {
        this.modalService.warning({
          nzTitle: '消息提示',
          nzContent: `<p>【成本价格】或者【出售价格】不可为空</p>`,
          nzMaskClosable: true
        });
        return false;
      }
    }
    return true;
  }

  /**
   * 移除已经选择的疫苗
   */
  remove(data: any) {
    this.batchNoData = this.batchNoData.filter(b => b['batchSerialCode'] !== data['batchSerialCode']);
    this.calculateTotal();
  }

  /**
   * 疫苗类型发生变化，一类、二类
   * 当疫苗类型变化为一类时，价格需要变为0
   * @param ev
   */
  onBatchNoTypeChange(ev, data: any) {
    if (ev === '0') {
      data['orignPrice'] = 0;
      data['sellPrice'] = 0;
    }
  }

  /**
   * 组合疫苗产品信息
   * batchNo: "123"
   batchSerialCode: "172839"
   certifiCode: "123456"
   containerType: "1"
   dose: "0.5"
   manufactureCode: "01"
   manufactureName: "北京科技"
   outBoundDate: 1576028813000
   spec: "5"
   type: "0"
   vaccName: "乙肝"
   checked: true
   vaccNum: 10
   orignPrice: 0
   sellPrice: 0
   */
  fillInVaccineInfo() {
    const vaccineInfo = [];
    this.batchNoData.forEach(d => {
      d['outBoundDate'] = DateUtils.getFormatTime(d['outBoundDate']);
      vaccineInfo.push(d);
    });
    return vaccineInfo;
  }

  /**
   * 计算出入库数量
   */
  calculateTotal() {
    this.total = 0;
    this.batchNoData.forEach(d => this.total += d['vaccNum']);
  }

  // 返回
  goBack() {
    this.location.back();
  }

}
