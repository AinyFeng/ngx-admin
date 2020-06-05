import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';


@Component({
  selector: 'uea-inandout-collect-detail',
  templateUrl: './inandout-collect-detail.component.html',
  styleUrls: ['../../admin.common.scss']
})
export class InandoutCollectDetailComponent implements OnInit {
// 汇总中查看详情
  collectInfo: any = null;
  refc = this.ref;
  styleD = true;
  constructor(
    private ref: NbDialogRef<InandoutCollectDetailComponent>,
  ) { }

  ngOnInit() {
  }

}
