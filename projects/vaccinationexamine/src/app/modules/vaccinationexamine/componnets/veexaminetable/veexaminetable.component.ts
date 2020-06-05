import { Component, OnInit, Input } from '@angular/core';

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
  selector: 'uea-veexaminetable-component',
  templateUrl: './veexaminetable.component.html',
  styleUrls: ['./veexaminetable.component.scss']
})
export class VEExamineTableComponent implements OnInit {
  @Input()
  listOfData: any[] = [];
  displayData: any[] = [];
  bordered = true;
  loading = false;
  sizeChanger = false;
  pagination = true;
  header = true;
  @Input()
  title = '请设置表格标题';
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

    this.listOfData = VEExamineTableComponent.sampleListOfData;
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
      name: '刘沐晴',
      gender: '女',
      birthdate: '2017-09-03',
      city: '340100',
      district: '340101',
      pov: '3401020150',
      school: '凤阳县实验小学',
      classes: '一年级三班',
      entrytime: '2019',
      done: false,
      unreceived: '脊灰疫苗[1]',
      mobile: '13910901234',
      importtime: '2020-01-01',
    },
    {
      key: '2',
      name: '刘沐晴',
      gender: '女',
      birthdate: '2017-09-03',
      city: '340100',
      district: '340101',
      pov: '3401020150',
      school: '凤阳县实验小学',
      classes: '一年级三班',
      entrytime: '2019',
      done: false,
      unreceived: '脊灰疫苗[1]',
      mobile: '13910901234',
      importtime: '2020-01-01',
    },
    {
      key: '3',
      name: '刘沐晴',
      gender: '女',
      birthdate: '2017-09-03',
      city: '340100',
      district: '340101',
      pov: '3401020150',
      school: '凤阳县实验小学',
      classes: '一年级三班',
      entrytime: '2019',
      done: false,
      unreceived: '脊灰疫苗[1]',
      mobile: '13910901234',
      importtime: '2020-01-01',
    }
  ];
}
