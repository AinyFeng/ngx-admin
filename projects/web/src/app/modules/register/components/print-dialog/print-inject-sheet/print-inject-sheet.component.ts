import { Component, Inject, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'uea-print-inject-sheet',
  templateUrl: './print-inject-sheet.component.html',
  styleUrls: ['./print-inject-sheet.component.scss']
})
export class PrintInjectSheetComponent {
  injectSingleData: any;
  profile: any;
  child: any;

  constructor(private ref: NbDialogRef<PrintInjectSheetComponent>) { }

  onCloseDialog() {
    this.ref.close();
  }

  // // 打印加载错误
  // error = false;
  //
  // // 需要打印的注射单的数据
  // injectSingleData: any;
  // // 基本信息
  // profile: any;
  // // 是否是儿童
  // child: boolean;
  // qrCode = 'this is a test';
  //
  // // 当前时间
  // nowDate = moment().format('YYYY-MM-DD');
  // // povInfo
  // povInfo: any;
  //
  // constructor(
  //   private ref: NbDialogRef<PrintInjectSheetComponent>,
  //   public lodopPrintSvc: LodopPrintService,
  //   private povApiSvc: PovInfoService,
  // ) {
  //   // 加载打印机
  //   this.lodopPrintSvc.getLodopStatus().subscribe(status => {
  //     this.error = status;
  //   });
  // }
  // ngOnInit() {
  //   // 获取povInfo
  //   this.getPovInfo();
  // }
  //
  // /**
  //  * 根据登录用户查询接种门诊的基本信息，比如接种门诊的工作时间等
  //  */
  // getPovInfo() {
  //   const query = {
  //     povCode: this.injectSingleData.createPov
  //   };
  //   this.povApiSvc.queryPovInfo(query, resp => {
  //     if (resp.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
  //       this.povInfo = resp.data[0];
  //     }
  //   });
  // }
  //
  // // 打印
  // print(preview: boolean) {
  //   this.lodopPrintSvc.print(preview, 'injectSingle', 10, 10);
  // }
  //
  // // 关闭
  // close() {
  //   this.ref.close();
  // }
  //
  // /**
  //  * 关闭提醒
  //  */
  // closeAlert() {
  //   if (this.error) {
  //     this.error = false;
  //   }
  // }
}
