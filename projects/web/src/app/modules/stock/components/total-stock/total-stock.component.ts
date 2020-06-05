import { Component } from '@angular/core';

@Component({
  selector: 'uea-total-stock',
  templateUrl: './total-stock.component.html',
  styleUrls: ['../stock.common.scss']
})
export class TotalStockComponent {
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
}
