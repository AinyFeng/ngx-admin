import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonUtils, DateUtils, LodopPrintService, PaymentService, RegistRecordService} from '@tod/svs-common-lib';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfirmDialogComponent} from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import {NbDialogService} from '@nebular/theme';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'uea-paid-list-component',
  templateUrl: './paid-list-component.component.html',
  styleUrls: ['./paid-list-component.component.scss']
})
export class PaidListComponentComponent implements OnInit {

  loading = false;

  searchForm: FormGroup;
  currentDate = new Date();
  /**
   * 订单列表数据
   */
  paidOrderData = [];

  /**
   * 当前登录用户
   */
  @Input()
  userInfo: any;

  /**
   * 付款方式
   */
  @Input()
  paymentWays = [];

  // 发票模板信息
  receiptTemplate: any;

  // 发票id，自定义名字，随意取一个
  receiptId = 'printReceipt';

  // pov 所在地区
  location: string;
  /**
   * 当前页码
   */
  pageIndex = 1;
  /**
   * 订单总数
   */
  total = 0;

  constructor(
    private paymentService: PaymentService,
    private printSvc: LodopPrintService,
    private fb: FormBuilder,
    private nbDialogService: NbDialogService,
    private msg: NzMessageService,
    private modalSvc: NzModalService,
    private regApiSvc: RegistRecordService,
  ) {
  }

  ngOnInit() {
    this.location = this.userInfo.pov.substring(0, 2);
    this.initSearchForm();
    this.queryPaidOrder();
  }

  /**
   * 初始化查询Form
   */
  initSearchForm() {
    this.searchForm = this.fb.group({
      orderSerial: [null],
      createStartTime: [new Date(DateUtils.formatStartDate(this.currentDate))],
      createEndTime: [new Date(DateUtils.formatEndDate(this.currentDate))],
      vaccineeName: [null],
      payChannel: [null]
    });
  }

  filterStartDate = (d: Date) => {
    const endTime = this.searchForm.get('createEndTime').value;
    if (endTime) {
      return d > endTime || d > this.currentDate;
    }
    return d > this.currentDate;
  }

  filterEndDate = (d: Date) => {
    const startTime = this.searchForm.get('createStartTime').value;
    if (startTime) {
      return d > this.currentDate || d < startTime;
    }
    return d > this.currentDate;
  }


  /**
   * 展开嵌套表格加载订单详情
   * @param expandFlag
   * @param item
   */
  expand(expandFlag, item) {
    if (expandFlag) {
      this.queryPaidOrderDetail(item);
    }
  }

  /**
   * 查询订单详细信息
   * @param item
   */
  queryPaidOrderDetail(item) {
    this.paymentService.queryByOrderSerial(item.orderSerial, resp => {
      if (resp.code === 0) {
        item.details = resp.data.details;
        console.log(this.paidOrderData);
      }
    });
  }

  /**
   * 查询订单信息
   */
  queryPaidOrder(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    const startTime = this.searchForm.get('createStartTime').value;
    const endTime = this.searchForm.get('createEndTime').value;
    let params = {
      vaccineeName: this.searchForm.get('vaccineeName').value ? this.searchForm.get('vaccineeName').value : null,
      povCode: this.userInfo.pov,
      status: ['2', '3', '8', '9'], // 订单状态。0-待缴费；1-已缴费；2-接种完成；3-无需付费；8-已退款；9-已取消
      createStartTime: DateUtils.getFormatDateTime(startTime),
      createEndTime: DateUtils.getFormatDateTime(endTime),
      payChannel: this.searchForm.get('payChannel').value ? this.searchForm.get('payChannel').value : [],
      pageEntity: {
        page: page,
        pageSize: 10,
        sortBy: ['createTime,desc']
      }
    };
    this.loading = true;
    console.log('参数2', params);
    this.paidOrderData = [];
    this.paymentService.queryAndCountOrderByCondition(params, ([queryData, countData]) => {
      this.loading = false;
      console.log('查询结果', queryData, countData);
      if (queryData.code !== 0 || countData.code !== 0) {
        this.msg.warning('订单查询失败，请重试');
        return;
      }
      if (queryData.code === 0) {
        this.paidOrderData = queryData.data;
      }
      if (countData.code === 0) {
        this.total = countData.data[0]['count'];
      }
    });

  }

  /**
   * 清除Form
   */
  resetForm(): void {
    this.searchForm.reset({
      payChannel: [null]
    });
    this.searchForm.get('createStartTime').patchValue(new Date(DateUtils.formatStartDate(this.currentDate)));
    this.searchForm.get('createEndTime').patchValue(new Date(DateUtils.formatEndDate(this.currentDate)));
    // 结果也重置
    // this.paidOrderData = [];
    this.loading = false;
  }

  /**
   * 开具发票
   */
  printReceipt(data: any) {
    this.modalSvc.confirm({
      nzTitle: '提示',
      nzContent: `<p>是否确认开票?</p>`,
      nzMaskClosable: true,
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        if (data) {
          console.log('开具发票', data);
          this.loading = true;
          // 1. 获取需要打印的发票数据
          this.paymentService.issueInvoice(data.orderSerial, resp => {
            console.log(resp);
            this.loading = false;
            if (resp.code === 0 && resp.data.length > 0) {
              const printData = this.formatReceiptData(
                resp.data[0],
                data.orderSerial,
              );
              // console.log(printData);
              // 2. 打印机打印
              this.printSvc.setPrintReceiptContent(
                this.receiptTemplate,
                printData,
                this.location
              );
              this.printSvc.print(false, this.receiptId);
              // 3. 二次确认打印是否成功，如果成功，则修改发票状态
              this.nbDialogService.open(ConfirmDialogComponent, {
                hasBackdrop: true,
                closeOnBackdropClick: false,
                closeOnEsc: false,
                context: {
                  title: '确认打印发票',
                  content: '请确认是否打印完成发票? 如果打印完成,请点击确认按钮。如果打印未完成,请点击取消按钮!'
                }
              }).onClose.subscribe(confirm => {
                if (confirm) {
                  console.log(confirm);
                  console.log(this.userInfo.userCode);
                  console.log(data.orderSerial);
                  // 发票开具完成，更新接种队队列状态为  '待接种' 接种操作为 '缴费完成'
                  this.paymentService.updateInvoiceStatus(data.orderSerial, re => {
                    if (re.code === 0) {
                      // 发票开具完成，更新接种队队列状态为  '待接种' 接种操作为 '缴费完成'
                      this.queryPaidOrder();
                    }
                  });
                  // 新增开票人
                  this.paymentService.updateInvoiceBy(data.orderSerial, this.userInfo.userCode, result => {
                    if (result.code === 0) {
                      // 发票开具完成,新增发票人
                      this.queryPaidOrder();
                    }
                  });
                  // 发票开具完成，更新接种队队列状态为  '待接种' 接种操作为 '缴费完成'
                  this.queryPaidOrder();
                }
              });

            } else {
              this.msg.warning('发票信息开具失败');
              return;
            }
          });

        }
      }
    });
  }

  /**
   * 获取打印发票的模板信息
   * @param ev 数据结构 { template: this.receiptTemplateJson.anhui2017, id: this.id, location: '34' }
   */
  getPrintTemplate(ev) {
    console.log('获取到的打印发票模板', ev);
    if (ev) {
      this.receiptId = ev.id;
      this.receiptTemplate = ev.template;
      this.location = ev.location;
    }
  }

  /**
   * 根据待打印的发票信息，重构为打印发票组件所需要的发票打印格式
   * @param data 传入的待打印的发票信息 数据格式：
   createTime: 1568965070000
   [
   {
       batchCode: "A201704002"
       count: 1
       leftCount: 1
       manufacturer: "深圳康泰"
       orderSerial: "558a7de6fbe1483990613970567fc615"
       povCode: "3406040802"
       productCode: "01101025B"
       registerCode: "931e4775dc3548938923fb0eab6f3edd"
       shortProductName: "康泰60ug液预"
       status: "1"
       totalAmount: 47.88
       unitPrice: 47.88
     }
   ]

   globalSerial: "0c72cf24c8dd4a3ab18c257bc6052ab0"
   invoiceStatus: "0"
   orderSerial: "558a7de6fbe1483990613970567fc615"
   payChannel: "1"
   povCode: "3406040802"
   profileCode: "8203c245cf8b4a05b53d87f3a1061598"
   status: "2"
   totalAmount: 47.88
   vaccineeName: "asino"

   需要查询档案信息、pov信息、疫苗产品信息

   * @param orderSerial
   */
  formatReceiptData(data: any, orderSerial: string) {
    console.log('格式化打印数据===', data);
    let printData = {};
    let profile = {};

    // 安徽模版
    if (this.location === '34') {
      let vacProducts = data.vacProducts.slice(0, 6).map(item => ({
        vacProductName: item.name || '' + item.vaccineSpecification || '1.0ml',
        // vacSpecifications: ,
        vacProductQuantity: item.count || 0,
        vacProductAmount: item.totalAmount || 0.0,
        vacProductPersonalPayAmount: item.totalAmount || 0.0
      }));
      printData = {
        serialNo: orderSerial, // 业务流水号
        medicalInstitution: '', // 医疗机构类型
        name: data.vaccineeName || '', // 姓名
        gender: (data.gender === 'f' ? '女' : '男') || '', // 性别
        medicalInsuranceType: '', // 医保类型
        totalAmountChinese:
          CommonUtils.digitUppercase(data.totalAmount || 0) || '', // 合计（大写）
        totalAmountDigits: data.totalAmount || '', // 合计（￥）
        medicalInsurancePayAmount: '', // 医保统筹支付start
        otherMedicalInsurancePayAmount: '', // 其他医保支付
        personalPayAmount: '', // 个人支付金额
        payeePov: this.userInfo.povName || '', // 收款单位
        payee: this.userInfo.name || '', // 收款人
        date:
          DateUtils.formatToDate(new Date()) ||
          DateUtils.formatToDate(new Date()), // 时间字段暂无，后面处理
        vacProducts
      };
    } else if (this.location === '31') {
      // 上海
      let vacProducts = data.vacProducts.map(item => ({
        vacProductName: item.name || '',
        VacSpecifications: item.vaccineSpecification || '1.0ml',
        quantityList: item.count || 0,
        amountList: item.totalAmount || 0.0,
        personalPayAmountList: item.totalAmount || 0.0
      }));

      // TODO: 接口数据暂时没有 categoryList 字段， 后面补上, 上海模块接口字段缺的较多！！
      let categoryList = [];
      if (data.hasOwnProperty('categoryList')) {
        categoryList = data.categoryList.map(item => ({
          categoryName: '大类项目一名称',
          categoryPayAmount: '大类项目一金额'
        }));
      }
      printData = {
        serialNo: orderSerial, // 业务流水号
        medicalInstitution: '', // 医疗机构类型
        name: data.vaccineeName || '', // 姓名
        gender: (data.gender === 'f' ? '女' : '男') || '', // 性别
        medicalInsuranceType: '', // 医保类型
        categoryList, // 疫苗大类信息
        vacProducts,
        totalAmountChinese:
          CommonUtils.digitUppercase(data.totalAmount || 0) || '', // 合计（大写）
        cashPayment: data.totalAmount || '', // 合计（￥）
        personalAccountPayAmount: data.totalAmount || '', // 个人支付金额
        medicalInsurancePayAmount: '', // 医保统筹支付start
        additionalPayment: '', //
        classificationOwnPayment: '', //
        ownPayment: '', //
        ownExpense: '', //
        curYearAccountBalance: '', //
        allYearAccountBalance: '', //
        payeePov: this.userInfo.povName || '', // 收款单位
        payee: this.userInfo.name || '', // 收款人
        date:
          DateUtils.formatToDate(new Date()) ||
          DateUtils.formatToDate(new Date()) // 时间字段暂无，后面处理
      };
    } else if (this.location === '36') {
      // 江西
      let vacProducts = data.vacProducts.map(item => ({
        vacProductName: `${item.name}/${item.vaccineSpecification}` || '', // 疫苗产品名称/规格
        vacProductQuantity: item.count || 0, // 疫苗数量
        vacProductAmount: item.totalAmount || 0.0, // 疫苗金额
        personalPayAmount: item.totalAmount || 0.0 // 个人支付金额
      }));
      printData = {
        serialNo: orderSerial, // 业务流水号
        medicalInstitution: '', // 医疗机构类型
        name: data.vaccineeName || '', // 姓名
        gender: (data.gender === 'f' ? '女' : '男') || '', // 性别
        medicalInsuranceType: '', // 医保类型
        totalAmountChinese:
          CommonUtils.digitUppercase(data.totalAmount || 0) || '', // 合计（大写）
        totalAmountDigits: data.totalAmount || '', // 合计（￥）
        medicalInsurancePayAmount: '', // 医保统筹支付start
        personalAccountPayAmount: '', // 个人账户支付总金额
        otherMedicalInsurancePayAmount: '', // 其他医保支付
        personalTotalPayAmount: '', // 个人支付金额
        payeePov: this.userInfo.povName || '', // 收款单位
        payee: this.userInfo.name || '', // 收款人
        date:
          DateUtils.formatToDate(new Date()) ||
          DateUtils.formatToDate(new Date()), // 时间字段暂无，后面处理
        vacProducts
      };
    } else if (this.location === '53') {
      // 云南
      let vacProducts = data.vacProducts
        .slice(0, 5)
        .map(
          (item: {
            name: any;
            vaccineSpecification: any;
            count: any;
            totalAmount: any;
          }) => ({
            vacProductName: `${item.name}/${item.vaccineSpecification}` || '', // 疫苗产品名称/规格
            vacProductQuantity: item.count || 0, // 疫苗数量
            vacProductAmount: item.totalAmount || 0.0, // 疫苗金额
            personalPayAmount: item.totalAmount || 0.0 // 个人支付金额
          })
        );
      printData = {
        serialNo: orderSerial, // 业务流水号
        medicalInstitution: '', // 医疗机构类型
        name: data.vaccineeName || '', // 姓名
        gender: (data.gender === 'f' ? '女' : '男') || '', // 性别
        medicalInsuranceType: '', // 医保类型
        socialSecurityNumber: '15151351351435135', // ?
        vacProducts,
        totalAmountChinese:
          CommonUtils.digitUppercase(data.totalAmount || 0) || '', // 合计（大写）
        totalAmountDigits: data.totalAmount || '', // 合计（￥）
        // medicalInsurancePayAmount: '',  // 医保统筹支付start
        // otherMedicalInsurancePayAmount: '',  // 其他医保支付
        // personalPayAmount: '',  // 个人支付金额
        payeePov: this.userInfo.povName || '', // 收款单位
        payee: this.userInfo.name || '', // 收款人
        date:
          DateUtils.formatToDate(new Date()) ||
          DateUtils.formatToDate(new Date()) // 时间字段暂无，后面处理
      };
    }
    console.log(printData);
    return printData;
  }

  /**
   * 根据订单号码作废发票
   * @param order
   */
  invalidInvoice(order) {
    console.log('作废发票', order);
    this.loading = true;
    this.paymentService.invalidInvoice(order.invoiceSerial, resp => {
      console.log(resp);
      this.loading = false;
      if (resp.code === 0 && resp.data.length > 0) {
        this.msg.success('已经成功作废发票');
        // const printData = this.formatReceiptData(
        //   resp.data[0],
        //   order.orderSerial,
        // );
        // console.log(printData);
        // this.printSvc.setPrintReceiptContent(
        //   this.receiptTemplate,
        //   printData,
        //   this.location
        // );
        // this.printSvc.print(true, this.receiptId);
        // 发票开具完成，更新接种队队列状态为  '待接种' 接种操作为 '缴费完成'
        this.queryPaidOrder();
      }
    });
  }

  // 退款 -- 相当于取消订单,只是考虑开发票和未开发票
  refund(data: any) {
    if (this.loading) return;
    this.modalSvc.confirm({
      nzTitle: '提示',
      nzContent: `<p>是否确认退款?</p>`,
      nzMaskClosable: true,
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        const paramList = [];
        const cancelRegRecordList = [];
        paramList.push(data.orderSerial);
        cancelRegRecordList.push({
          orderSerial: data.orderSerial,
          povCode: data.povCode
        });
        // 1. 取消订单信息
        this.paymentService.cancelOrderList(paramList, cancelResp => {
          // console.log('批量取消订单返回值', cancelResp);
          this.loading = false;
          if (cancelResp.code === 0) {
            this.msg.success('已经成功退款');
            // 2. 修改登记记录状态为取消
            this.regApiSvc.cancelRecordOrderStatusByOrderSerial(cancelRegRecordList, cancelRegRecordResp => {
              // console.log('修改登记记录订单状态为取消', cancelRegRecordResp);
            });
            // 3.如果开票了,需要作废发票
            if (data.invoiceStatus === '1') {
              // 作废发票
              this.invalidInvoice(data);
            } else {
              this.queryPaidOrder();
            }
          }
        });
      }
    });
  }


}
