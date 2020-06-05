import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'uea-injection-sheet',
  templateUrl: './injection-sheet.component.html',
  styleUrls: ['./injection-sheet.component.scss']
})
export class InjectionSheetComponent implements OnInit {
  // 接收成人疫苗记录
  @Input()
  adultVaccineList: any;

  constructor() { }

  ngOnInit() { }
}
