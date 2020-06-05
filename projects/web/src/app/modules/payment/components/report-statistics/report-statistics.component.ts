import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uea-report-statistics',
  templateUrl: './report-statistics.component.html',
  styleUrls: ['./report-statistics.component.scss']
})
export class ReportStatisticsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  cashiers = [];

  invoiceStatusSelect = 'normal';

  invoicedStatusSelect = 'all';

  cashierStatusSelect = '有时';

  typeSelect = 'success';

  showStatistics = false;

  search() {
    this.showStatistics = true;
  }

  onChange(result: Date): void {
    console.log('Selected Time: ', result);
  }

  onOk(result: Date): void {
    console.log('onOk', result);
  }
}
