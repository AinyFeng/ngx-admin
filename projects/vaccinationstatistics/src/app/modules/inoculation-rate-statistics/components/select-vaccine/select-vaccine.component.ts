import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfigService} from '@ngx-config/core';

@Component({
  selector: 'uea-select-vaccine',
  templateUrl: './select-vaccine.component.html',
  styleUrls: ['./select-vaccine.component.scss']
})
export class SelectVaccineComponent implements OnInit {
  pickerData: any[] = [];

  // 输出选择的疫苗
  @Input()
  selectedVaccines: any;

  /**
   * 选择疫苗
   */
  @Output()
  readonly _onSelectVaccine = new EventEmitter<void>();

  constructor(
    private configService: ConfigService
  ) {
  }

  SELECT_OP_ALL = 'ALL'; // 选择所有
  SELECT_OP_NONE = 'NONE'; // 取消所有

  tagGroup = [
    [
      {name: '全选', tag: this.SELECT_OP_ALL},
      {name: '全不选', tag: this.SELECT_OP_NONE}
    ]
  ];

  tagSum6_1 = [
    {name: 'MCV(MV、MR、MM、MMR)', tag: 'MCV'},
    {name: 'RCV(MR、MMR)', tag: 'RCV'},
    {name: 'MumCV(MM、MMR)', tag: 'MumCV'},
    {name: 'HepA', tag: 'HepA'}
  ];

  // 6-1和6-2类型
  @Input()
  groupType: String = '';

  ngOnInit() {
    if (this.groupType && this.groupType === 'sum61') {
      this.tagGroup.push(this.tagSum6_1);
      this.pickerData = this.configService.getSettings('report.VaccinePickerDataSum61');
    } else if (this.groupType && this.groupType === 'sum62') {
      this.pickerData = this.configService.getSettings(
        'report.VaccinePickerDataSum62'
      );
    }
  }

  // 取消全选
  cancelAll() {
    for (let i = 0; i < this.pickerData.length; i++) {
      this.pickerData[i].selected = false;
    }
  }

  // 上面的全选,全不选 和 第二级的选择
  selectVac(ev, op) {
    this.cancelAll();
    switch (op) {
      case this.SELECT_OP_ALL:
        this.cancelAll();
        for (let i = 0; i < this.pickerData.length; i++) {
          this.pickerData[i].selected = true;
        }
        break;
      case this.SELECT_OP_NONE: {
        break;
      }
      default: {
        for (let i = 0; i < this.pickerData.length; i++) {
          if (this.pickerData[i].tags.indexOf(op) > -1) {
            this.pickerData[i].selected = true;
          }
        }
      }
    }
    this.submit();
  }

  submit() {
    let selectName: any[] = [];
    let selectCode: any[] = [];
    let selectAcronym: any[] = [];
    this.pickerData
      .filter(pd => pd.selected)
      .forEach(pd => {
        selectName.push(pd.vacName);
        selectCode.push(pd.vacCode);
        selectAcronym.push(...pd.tags);
      });

    let selectData = {
      selectName: selectName.join('/'),
      selectCode: selectCode.join(','),
      selectAcronym: selectAcronym.join('/')
    };
    this.selectedVaccines = JSON.parse(JSON.stringify(selectData));
    this._onSelectVaccine.emit(this.selectedVaccines);
  }

  changeModel() {
    this.submit();
  }
}
