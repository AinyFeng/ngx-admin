import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { ProfileService, DictionaryPipe } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
  data = [];
  countDate = [];
  total: number;

  queryString: string;
  pageEntity: any;
  loading = false;
  page = 1;
  pageSize = 10;

  constructor(
    private ref: NbDialogRef<SearchResultComponent>,
    private profileSvc: ProfileService,
    private msg: NzMessageService
  ) { }

  ngOnInit() {
    this.total = this.countDate.length === 0 ? 0 : this.countDate[0]['total'];
  }

  onClose() {
    this.ref.close();
  }

  select(d) {
    this.ref.close(d);
  }

  queryData(ev) {
    // console.log(ev);
    this.page = ev;
    this.loading = true;
    this.pageEntity.page = ev;
    this.profileSvc.queryProfileByStrWithoutCount(
      this.queryString,
      this.pageEntity,
      resp => {
        this.loading = false;
        console.log(resp);
        if (
          resp.code !== 0 ||
          !resp.hasOwnProperty('data') ||
          resp.data.length === 0
        ) {
          this.msg.info('没有查到数据，请重试');
          return;
        }
        this.resetData();
        this.data = resp.data;
      }
    );
  }

  resetData() {
    this.data = [];
  }
}
