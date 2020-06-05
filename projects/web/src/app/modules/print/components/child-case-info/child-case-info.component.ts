import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'uea-child-case-info',
  templateUrl: './child-case-info.component.html',
  styleUrls: ['./child-case-info.component.scss']
})
export class ChildCaseInfoComponent implements OnInit {
  // 接收档案信息
  @Input()
  printProfileData: any = {};
  @Input()
  idType: any;
  nowDate = new Date();

  constructor() {}

  ngOnInit() {}
}
