import { Component, OnInit, Input } from '@angular/core';

class SchoolItemData {
  schoolName: string;
  schoolCode: string;
  sumstudent: number | string = '';
  description: string = '';

  checked: boolean = false;
  expand: boolean = false;
  disabled?: boolean = false;
}

@Component({
  selector: 'uea-veclassestable-component',
  templateUrl: './veclassestable.component.html',
  styleUrls: ['./veclassestable.component.scss']
})
export class VEClassesTableComponent implements OnInit {
  @Input()
  listOfData: Array<SchoolItemData> = [];

  @Input()
  listOfDisplayData: Array<SchoolItemData> = [];

  @Input()
  searchValue: string = '';

  sortName: string | null = null;
  sortValue: string | null = null;
  searchDescription: string = '';
  searchSumStudent: string = '';

  listOfSchoolName = [{ text: 'Joe', value: 'Joe' }, { text: 'Jim', value: 'Jim' }];
  listOfSumStudent = [{ text: 'London', value: 'London' }, { text: 'Sidney', value: 'Sidney' }];
  listOfSearchName: string[] = [];

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

  currentPageDataChange($event: SchoolItemData[]): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const validData = this.listOfDisplayData.filter(value => !value.disabled);
    const allChecked = validData.length > 0 && validData.every(value => value.checked === true);
    const allUnChecked = validData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  filter(listOfSearchName: string[], searchDescription: string): void {
    this.listOfSearchName = listOfSearchName;
    this.searchDescription = searchDescription;
    this.search();
  }

  search(): void {
    /** filter data **/
    const filterFunc = (item: SchoolItemData) => {
      if (!this.searchValue) return true;
      if (item.schoolName) {
        if (item.schoolName.indexOf(this.searchValue) !== -1) return true;
      }
      if (item.schoolCode) {
        if (item.schoolCode.indexOf(this.searchValue) !== -1) return true;
      }
      if (item.sumstudent) {
        if ((item.sumstudent as string).indexOf(this.searchValue) !== -1) return true;
      }
      if (item.description) {
        if (item.description.indexOf(this.searchValue) !== -1) return true;
      }
      return false;
    };

    const data = this.listOfData.filter(item => filterFunc(item));
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.listOfDisplayData = data.sort((a, b) =>
        this.sortValue === 'ascend'
          // tslint:disable-next-line: no-non-null-assertion
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          // tslint:disable-next-line: no-non-null-assertion
          : b[this.sortName!] > a[this.sortName!]
            ? 1
            : -1
      );
    } else {
      this.listOfDisplayData = data;
    }
  }

  ngOnInit(): void {
  }

}
