import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'uea-search-result-mask',
  templateUrl: './search-result-mask.component.html',
  styleUrls: ['./search-result-mask.component.scss']
})
export class SearchResultMaskComponent implements OnInit {
  @Input()
  mask: any;
  @Input()
  listData: any;
  @Output() readonly changeMask = new EventEmitter();

  page = 1;
  pageSize = 10;

  constructor() {}

  ngOnInit() {
  }

  closeMask() {
    this.changeMask.emit({mask: false, selectProfile: ''});
  }
  // 双击选择
  select(d) {
    this.changeMask.emit({mask: false, selectProfile: d});
  }
}
