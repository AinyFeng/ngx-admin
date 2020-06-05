import {Component, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'uea-inoculation-rate-detail',
  templateUrl: './inoculation-rate-detail.component.html',
  styleUrls: ['./inoculation-rate-detail.component.scss']
})
export class InoculationRateDetailComponent implements OnInit {

  listOfData: any = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  loading = false;

  // 接收蒙版传递的参数和类型
  data: any;
  type: any;

  constructor(
    private ref: NbDialogRef<InoculationRateDetailComponent>
  ) {
  }

  ngOnInit() {
  }

  // 查询个案详情数据
  queryData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
  }

  // 关闭
  onClose() {
    this.ref.close();
  }

}
