import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uea-plan-config',
  templateUrl: './plan-config.component.html',
  styleUrls: ['./plan-config.component.scss']
})
export class PlanConfigComponent implements OnInit {

  data: any = null;

  tabIndex = 0;

  constructor() {

  }

  ngOnInit() {
  }

}
