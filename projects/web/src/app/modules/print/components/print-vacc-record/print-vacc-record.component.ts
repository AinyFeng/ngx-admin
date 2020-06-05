import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'uea-print-vacc-record',
  templateUrl: './print-vacc-record.component.html',
  styleUrls: ['./print-vacc-record.component.scss']
})
export class PrintVaccRecordComponent implements OnInit {
  // 获取最终打印的参数
  @Output()
  readonly getPrintRecord = new EventEmitter();
  // 显示下一步
  @Output()
  readonly showStep = new EventEmitter();
  // 接收所有的接种记录
  @Input() vaccinateRecord: any;
  loading = false;
  // 打印接种记录
  printRecord: any[] = [];
  // 当前打印页码
  currentPage: any;

  // 全选
  isAllDisplayDataChecked = false;

  // 打印内容页面
  isAllChecked = true;

  constructor(
  ) {
  }

  ngOnInit() {

    console.log('打印接种记录', this.vaccinateRecord);
  }

  // 查询疫苗有效期
  /*  queryVacLoseEfficacyDate(batchNo, productCode) {
      if (vaccineRecord.length) {
        const query = {
          batchNo: batchNo,
          vaccineProductCode: productCode,
        };
        this.batchSvc.queryBatchInfo(query, resp => {
          if (resp && resp.code === 0 && resp.data.length !== 0) {

          }
        });
      }

    }*/

  // 选择接种记录的checkbox,是否显示下一步
  refreshStatus() {
    this.vaccinateRecord.showNextStep = this.vaccinateRecord.historyRecordData.some(
      item => item.checked === true
    );
    this.isAllDisplayDataChecked = this.vaccinateRecord.historyRecordData.every(ele => ele.checked === true);
    this.showStep.emit(this.vaccinateRecord.showNextStep);
  }

  // 二次勾选
  secondCheck() {
    this.getPrintRecordList();
  }

  // 切换tab
  changeTab(event) {
    this.vaccinateRecord.currentTab = event.tabTitle;
    this.getPrintRecordList();
  }

  // 获取当前tab页需要打印的数据
  getPrintRecordList() {
    this.printRecord = [];
    // 用来记录可以显示的title
    let flag = [];
    for (let i = 0; i < this.vaccinateRecord.allTitle.length; i++) {
      if (
        this.vaccinateRecord.currentTab === this.vaccinateRecord.allTitle[i]
      ) {
        if (this.vaccinateRecord.vaccRecordData.length) {
          for (let j = 0; j < this.vaccinateRecord.vaccRecordData.length; j++) {
            flag.push(
              this.showPageSize(this.vaccinateRecord.vaccRecordData[j])
            );
          }
        }
        if (flag.indexOf(this.vaccinateRecord.currentTab) > -1) {
          let checkRecord = this.vaccinateRecord.vaccRecordData[
            flag.indexOf(this.vaccinateRecord.currentTab)
          ].data;
          checkRecord.forEach(record => {
            if (record.checked) {
              this.printRecord.push(record);
            }
          });
          // 全选控制
          // this.isAllChecked = checkRecord.every(item => item.checkStatus === true);
        }
        this.currentPage = i;
      }
    }
    this.getPrintRecord.emit({
      printRecord: this.printRecord,
      currentPage: this.currentPage
    });
  }

  // 显示页码
  showPageSize(data: any) {
    if (data.id.includes('page1')) {
      if (this.vaccinateRecord.allTitle.includes('1~2')) {
        return this.vaccinateRecord.allTitle[
          this.vaccinateRecord.allTitle.indexOf('1~2')
        ];
      } else {
        return this.vaccinateRecord.allTitle[
          this.vaccinateRecord.allTitle.indexOf('1')
        ];
      }
    }
    if (data.id.includes('page2')) {
      if (this.vaccinateRecord.allTitle.includes('3~4')) {
        return this.vaccinateRecord.allTitle[
          this.vaccinateRecord.allTitle.indexOf('3~4')
        ];
      } else if (this.vaccinateRecord.allTitle.includes('2~3')) {
        return this.vaccinateRecord.allTitle[
          this.vaccinateRecord.allTitle.indexOf('2~3')
        ];
      } else {
        return this.vaccinateRecord.allTitle[
          this.vaccinateRecord.allTitle.indexOf('3')
        ];
      }
    }
    if (data.id.includes('page3')) {
      if (this.vaccinateRecord.allTitle.includes('5~6')) {
        return this.vaccinateRecord.allTitle[
          this.vaccinateRecord.allTitle.indexOf('5~6')
        ];
      } else {
        return this.vaccinateRecord.allTitle[
          this.vaccinateRecord.allTitle.indexOf('4~5')
        ];
      }
    }
    if (data.id.includes('page4')) {
      if (this.vaccinateRecord.allTitle.includes('7~8')) {
        return this.vaccinateRecord.allTitle[
          this.vaccinateRecord.allTitle.indexOf('7~8')
        ];
      } else {
        return this.vaccinateRecord.allTitle[
          this.vaccinateRecord.allTitle.indexOf('6~7')
        ];
      }
    }
    if (data.id.includes('page5')) {
      if (this.vaccinateRecord.allTitle.includes('8~9')) {
        return this.vaccinateRecord.allTitle[
          this.vaccinateRecord.allTitle.indexOf('8~9')
        ];
      } else {
        return this.vaccinateRecord.allTitle[
          this.vaccinateRecord.allTitle.indexOf('8')
        ];
      }
    }
    if (data.id.includes('empty')) {
      return this.vaccinateRecord.allTitle[
        this.vaccinateRecord.allTitle.indexOf('空白页')
      ];
    }
  }

  // 全选
  checkAll(value: boolean) {
    this.vaccinateRecord.historyRecordData.forEach(item => item.checked = value);
    this.refreshStatus();
  }

  // vaccineCheckAll
  /*vaccineCheckAll(value: boolean) {
    console.log(value);
    console.log('print', this.vaccinateRecord);
    const vaccRecordData = this.vaccinateRecord.vaccRecordData;
    for (let i = 0; i < vaccRecordData.length; i++) {
      const single = vaccRecordData[i].data;
      single.forEach(item => item.checked = value);
    }
    this.secondCheck();
  }*/
}
