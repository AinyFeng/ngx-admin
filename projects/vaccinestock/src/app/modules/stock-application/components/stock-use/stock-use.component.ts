import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';
import {
  DateUtils,
  DicDataService,
  VaccManufactureDataService,
  VacStockStorageApi,
  VacStockApprovalApiService
} from '@tod/svs-common-lib';
import {VaccineStockInfoComponent} from '../../../stock-shared/components/vaccine-stock-info/vaccine-stock-info.component';
import {take} from 'rxjs/operators';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Location} from '@angular/common';


@Component({
  selector: 'uea-stock-use',
  templateUrl: './stock-use.component.html',
  styleUrls: ['./stock-use.component.scss']
})
export class StockUseComponent implements OnInit {

  orderForm: FormGroup;

  userInfo: any;

  today = new Date();
  /**
   * 选择单位
   */
  selectedNode: any;
  /**
   * 已选择的疫苗
   */
  vaccData = [];
  /**
   * 生产厂家下拉框
   */
  manufactureOptions: any;
  /**
   * 当前编辑id
   */
  editId: string;
  /**
   * 合计数量
   */
  total = 0;

  // 页面跳转传来的参数
  updateOrderDate: any;

  private subscription: Subscription[] = [];

  startEdit(id: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editId = id;
  }

  stopEdit() {
    this.editId = null;
    this.calculateTotal();
  }

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private userSvc: UserService,
    private dicSvc: DicDataService,
    private manufactureInitSvc: VaccManufactureDataService,
    private vasStockStorageApiSvc: VacStockStorageApi,
    private notifierService: NotifierService,
    public route: ActivatedRoute,
    private vacStockApprovalSvc: VacStockApprovalApiService,
    private location: Location
  ) {
    // 获取上产厂商
    this.manufactureOptions = this.manufactureInitSvc.getVaccProductManufactureData();
    userSvc.getUserInfoByType().subscribe(user => {
      this.userInfo = user;
    });

    // 跳转传来的参数
    const sub = this.route.queryParams.subscribe(resp => {
      if (resp.hasOwnProperty('orderNo')) {
        this.updateOrderDate = resp;
        this.queryDetail();
      }
    });
    this.subscription.push(sub);
  }

  ngOnInit() {
    this.orderForm = this.fb.group({
      orderDate: [this.updateOrderDate ? new Date(parseInt(this.updateOrderDate.orderDate, 10)) : this.today, [Validators.required]], // 报损出库日期
      orderType: [this.updateOrderDate ? this.updateOrderDate.orderType : '0', [Validators.required]], // 类型 0--使用
      vaccineType: [this.updateOrderDate ? this.updateOrderDate.vaccineType : '0'], // 疫苗类型 0 - 第一类
      memo: [this.updateOrderDate ? this.updateOrderDate.memo : null], // 备注信息
      createBy: [this.updateOrderDate ? this.updateOrderDate.createBy : null], // 创建人
      orderStatus: [this.updateOrderDate ? this.updateOrderDate.orderStatus : null], // 订单状态
      createorgName: [this.updateOrderDate ? this.updateOrderDate.createorgName : null], // 录入单位
      entrystaffName: [this.updateOrderDate ? this.updateOrderDate.entrystaffName : null], // 录入人名称
      createorgCode: [this.updateOrderDate ? this.updateOrderDate.createorgCode : null], // 录入单位编码
      ownerorgName: [this.updateOrderDate ? this.updateOrderDate.ownerorgName : null], // 所属单位
      orderNo: [this.updateOrderDate ? this.updateOrderDate.orderNo : null], // 订单号
    });

  }

  // 查看详情
  queryDetail() {
    const params = {
      serialCode: this.updateOrderDate.serialCode,
    };
    this.vaccData = [];
    this.vacStockApprovalSvc.queryStockApprovalDetail(params, resp => {
      console.log('结果', resp);
      if (!resp || resp.code !== 0 || !resp.hasOwnProperty('data')) {
        return;
      }
      this.vaccData = resp.data;
      this.vaccData.forEach(item => item.checked = true);
    });
  }

  // 报废接口
  submitForm(): void {
    for (const i in this.orderForm.controls) {
      if (this.orderForm.controls[i]) {
        this.orderForm.controls[i].markAsDirty();
        this.orderForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.orderForm.invalid) {
      this.modalService.warning({
        nzTitle: '提示',
        nzContent: `<p>表格填写不完整，请检查</p>`,
        nzMaskClosable: true
      });
      return;
    }
    // 检查疫苗报废数量是否有效和是否选择
    if (!this.checkStorageNumSelectedAndValid()) {
      return;
    }
    // 构建查询参数
    this.fillInForm();  // 填写表单必要信息
    this.fillInVaccineInfo();
    if (this.updateOrderDate) {
      let updateParams = JSON.parse(JSON.stringify(this.updateOrderDate));
      this.vaccData.forEach(item => item.vaccNum = item.usedNum);
      updateParams['queryInventoryLevelsOutparam'] = [...this.vaccData];
      updateParams['vaccineType'] = this.orderForm.get('vaccineType').value;
      updateParams['orderDate'] = DateUtils.getTimestamp(this.orderForm.get('orderDate').value);
      updateParams['memo'] = this.orderForm.get('memo').value;
      updateParams['entrystaffName'] = this.orderForm.get('entrystaffName').value;
      updateParams['orderType'] = this.updateOrderDate.orderType;
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
      this.vaccData.forEach(item => item.vaccNum = item.usedNum);
      params ['queryInventoryLevelsOutparam'] = [...this.vaccData];
      console.log('params===', params);
      this.vasStockStorageApiSvc.use(params, res => {
        console.log('疫苗使用接口返回值', res);
        if (res.code === 0) {
          this.notifierService.notify('success', '成功');
          this.resetTable();
          this.calculateTotal(); // 清空数量
        } else {
          this.notifierService.notify('error', res.msg);
        }

      });
    }
  }

  resetTable() {
    this.vaccData = [];
  }

  fillInVaccineInfo() {
    const vaccineInfo = [];
    this.vaccData.forEach(d => {
      d['loseEfficacyDate'] = DateUtils.getFormatTime(d['loseEfficacyDate']);
      vaccineInfo.push(d);
    });
    return vaccineInfo;
  }

  /**
   * 填写表单必要信息
   */
  fillInForm() {
    // 修改时间为字符串
    this.orderForm.get('orderDate').patchValue(DateUtils.formatToDate(this.orderForm.value.orderDate)); // 录入单位名称
    // 填写录入人相关信息，录入人为当前系统登录用户
    this.orderForm.get('createorgName').setValue(this.userInfo.name); // 录入单位名称
    this.orderForm.get('entrystaffName').setValue(this.userInfo.name); // 录入人名称
    this.orderForm.get('createorgCode').setValue(this.userInfo.pov); // 录入单位编码
    // 创建人
    this.orderForm.get('createBy').setValue(this.userInfo.userCode);
  }

  /**
   * 检查是否选择了疫苗
   */
  checkStorageNumSelectedAndValid() {
    const d = this.vaccData.filter(b => b.checked);
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
    const dv = d.filter(b => !b.hasOwnProperty('usedNum') || !b.usedNum || b.usedNum === 0);
    if (dv.length > 0) {
      this.modalService.warning({
        nzTitle: '消息提示',
        nzContent: `<p>使用数量不合法，请重新填写</p>`,
        nzMaskClosable: true
      });
      return false;
    }
    // 检查出库数量是否大于已有库存
    const numRet = this.vaccData.some(sd => {
      // 出库数量
      const vaccNum = sd['usedNum'];
      // 可用库存
      const storenumF = Number(sd['storenumF']);
      return vaccNum > storenumF;
    });
    if (numRet) {
      this.modalService.warning({
        nzTitle: '消息提示',
        nzContent: `<p>出库数量必须要在可用库存范围内，请重新填写</p>`,
        nzMaskClosable: true
      });
      return false;
    }
    return true;
  }

  /**
   * 过滤日期
   * @param d
   */
  disabledDate = (d: Date) => {
    return d > this.today;
  }

  /**
   * 选择库存量信息
   */
  selectStock() {
    const modal = this.modalService.create({
      nzTitle: '库存列表',
      nzContent: VaccineStockInfoComponent,
      nzComponentParams: {
        selectedVacData: JSON.parse(JSON.stringify(this.vaccData)),
        vaccType: this.orderForm.value.vaccineType
      },
      nzWidth: '1300px',
      nzFooter: null
    });

    modal.afterClose.pipe(take(1)).subscribe(res => {
      if (res) {
        res.forEach(r => {
          const vac = this.vaccData.find(b => b['inventorySerialCode'] === r['inventorySerialCode']);
          if (!vac) {
            r['usedNum'] = 0;
            this.vaccData.push(r);
          }
        });
        this.vaccData = [...this.vaccData];
        // 统计数量
        this.calculateTotal();
      }
    });
  }

  /**
   * 计算出入库数量
   */
  calculateTotal() {
    this.total = 0;
    this.vaccData.forEach(d => this.total += d['usedNum']);
  }

  /**
   * 移除疫苗
   */
  remove(data: any) {
    this.vaccData = this.vaccData.filter(sd => sd['inventorySerialCode'] !== data['inventorySerialCode']);
    this.calculateTotal();
  }

  setFocus(temp: any) {
    temp.focus();
  }

  // 返回
  goBack() {
    this.location.back();
  }
}
