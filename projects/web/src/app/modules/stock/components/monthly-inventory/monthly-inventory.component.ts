import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uea-monthly-inventory',
  templateUrl: './monthly-inventory.component.html',
  styleUrls: ['../stock.common.scss']
})
export class MonthlyInventoryComponent implements OnInit {
  constructor() {}

  listOfData = [
    {
      name: '甲肝',
      company: '长春生物',
      number: 100000888,
      type: '一类',
      time: '2019-02-30',
      afi: '2022-02-30'
    }
  ];

  ngOnInit() {}

  checked = false;

  toggle(checked: boolean) {
    this.checked = checked;
  }
}
