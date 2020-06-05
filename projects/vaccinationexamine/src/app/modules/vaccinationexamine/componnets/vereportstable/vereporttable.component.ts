import { Component, OnInit, Input } from '@angular/core';
import { VaccRecordTransformService, YEARS, MONTHS } from 'dist/svs-common-lib';
import { NzMessageService } from 'ng-zorro-antd';
import { NbDialogService } from '@nebular/theme';

interface ItemData {
  name: string;
  age: number | string;
  address: string;
  checked: boolean;
  expand: boolean;
  description: string;
  disabled?: boolean;
}

@Component({
  selector: 'uea-vereporttable-component',
  templateUrl: './vereporttable.component.html',
  styleUrls: ['./vereporttable.component.scss']
})
export class VEReportTableComponent implements OnInit {

  widthConfig = ['256px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px', '32px'];

  @Input()
  userInfo: any;
  @Input()
  povInfo = {
    curProvCode: '',
    curCityCode: '',
    curDistrictCode: ''
  };

  years = YEARS;
  months = MONTHS;
  currentDate: Date = new Date();
  year: number;
  month: number;

  @Input()
  listOfData: any[] = [];
  displayData: any[] = [];
  bordered = true;
  loading = false;
  sizeChanger = false;
  pagination = true;
  header = true;
  @Input()
  title = '';
  footer = false;
  fixHeader = false;
  size = 'small';
  expandable = true;
  checkbox = true;
  allChecked = false;
  indeterminate = false;
  simple = false;
  noResult = false;
  position = 'bottom';

  constructor() { }

  currentPageDataChange($event: ItemData[]): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const validData = this.displayData.filter(value => !value.disabled);
    const allChecked = validData.length > 0 && validData.every(value => value.checked === true);
    const allUnChecked = validData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  ngOnInit(): void {

    this.year = this.currentDate.getFullYear();
    this.month = this.currentDate.getMonth();

    this.listOfData = VEReportTableComponent.sampleListOfData;
    // for (let i = 1; i <= 100; i++) {
    //   this.listOfData.push({
    //     name: 'John Brown',
    //     age: `${i}2`,
    //     address: `New York No. ${i} Lake Park`,
    //     description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
    //     checked: false,
    //     expand: false
    //   });
    // }
  }

  // noResultChange(status: boolean): void {
  //   this.listOfData = [];
  //   if (!status) {
  //     this.ngOnInit();
  //   }
  // }

  private static sampleListOfData = [
    {
      key: '1',
      name: '实验小学一一班',
      gender: '234',
      birthdate: '234',
      city: '234',
      district: '234',
      pov: '234',
      school: '234',
      classes: '234',
      entrytime: '234',
      done: 234,
      unreceived: '234',
      mobile: '234',
      importtime: '234',
      gender1: '234',
      birthdate1: '234',
      city1: '234',
      district1: '234',
      pov1: '234',
      school1: '234',
      aclaasses: '234',
      aentrytime: '234',
      adone: 234,
      aunreceived: '234',
      amobile: '234',
      aimporttime: '234',
    },
    {
      key: '2',
      name: '工人小学二三班',
      gender: '234',
      birthdate: '234',
      city: '234',
      district: '234',
      pov: '234',
      school: '234',
      classes: '234',
      entrytime: '234',
      done: 234,
      unreceived: '234',
      mobile: '234',
      importtime: '234',
      gender1: '234',
      birthdate1: '234',
      city1: '234',
      district1: '234',
      pov1: '234',
      school1: '234',
      aclaasses: '234',
      aentrytime: '234',
      adone: 234,
      aunreceived: '234',
      amobile: '234',
      aimporttime: '234',
    },
    {
      key: '3',
      name: '中心小学四二班',
      gender: '234',
      birthdate: '234',
      city: '234',
      district: '234',
      pov: '234',
      school: '234',
      classes: '234',
      entrytime: '234',
      done: 234,
      unreceived: '234',
      mobile: '234',
      importtime: '234',
      gender1: '234',
      birthdate1: '234',
      city1: '234',
      district1: '234',
      pov1: '234',
      school1: '234',
      aclaasses: '234',
      aentrytime: '234',
      adone: 234,
      aunreceived: '234',
      amobile: '234',
      aimporttime: '234',
    }
  ];
}
