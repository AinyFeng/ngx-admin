import { DialogNamePromptComponent } from './../../../../@uea/components/dialog/dialog-name-prompt/dialog-name-prompt.component';
import { ConfigService } from '@ngx-config/core';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'uea-f-pick-vaccine',
  templateUrl: './f-pick-vaccine.component.html',
  styleUrls: ['./f-pick-vaccine.component.scss']
})
export class FPickVaccineComponent implements OnInit {
  pickerData: any[] = [];

  // 接收的疫苗数据
  vaccineTypeData: any;

  constructor(
    public ref: NbDialogRef<DialogNamePromptComponent>,
    private configService: ConfigService,
  ) { }

  SELECT_OP_ALL = 'ALL'; // 选择所有
  SELECT_OP_NONE = 'NONE'; // 取消所有

  tagGroup = [
    [
      { name: '全选', tag: this.SELECT_OP_ALL },
      { name: '全不选', tag: this.SELECT_OP_NONE }
    ]
  ];

  tagSum6_1 = [
    { name: 'MCV(MV、MR、MM、MMR)', tag: 'MCV' },
    { name: 'RCV(MR、MMR)', tag: 'RCV' },
    { name: 'MumCV(MM、MMR)', tag: 'MumCV' },
    { name: 'HepA', tag: 'HepA' }
  ];

  @Input()
  groupType: String = '';

  ngOnInit() {
    if (this.groupType && this.groupType === 'sum61') {
      this.tagGroup.push(this.tagSum6_1);
      this.pickerData = this.configService.getSettings('report.VaccinePickerDataSum61');
    } else if (this.groupType && this.groupType === 'sum62') {
      console.log('传来的疫苗', this.vaccineTypeData);
      /*this.pickerData = this.configService.getSettings(
        'report.VaccinePickerDataSum62'
      );*/
      this.pickerData = [...this.vaccineTypeData];
      console.log('json', this.pickerData);
    }
    console.log('选择的数据', this.pickerData);
  }
  // 当页面销毁时关闭此页面
  /*ngOnDestroy(): void {
    this.ref.close();
  }*/

  // 取消全选
  cancelAll() {
    for (let i = 0; i < this.pickerData.length; i++) {
      this.pickerData[i].selected = false;
    }
  }

  // 上面的全选,全不选 和 第二级的选择
  selectVac(ev, op) {
    console.log('op', op);
    console.log('op', op.toLowerCase());
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
          console.log('tags', this.pickerData[i].tags);
          if (this.pickerData[i].tags.indexOf(op.toUpperCase()) > -1) {
            this.pickerData[i].selected = true;
          }
        }
      }
    }
  }

  submit() {
    let selectName: any[] = [];
    let selectCode: any[] = [];
    let selectAcronym: any[] = [];
    let aliasName: any[] = [];
    this.pickerData
      .filter(pd => pd.selected)
      .forEach(pd => {
        selectName.push(pd.vacName);
        selectCode.push(pd.vacCode);
        aliasName.push(pd.aliasName);
        if (pd.tags.length) {
          selectAcronym.push(...pd.tags);
        } else {
          selectAcronym.push(pd.aliasName);
        }

      });

    let selectData = {
      selectName: selectName.join('/'),
      selectCode: selectCode.join(','),
      aliasName: aliasName,
      selectAcronym: selectAcronym.join('/')
    };
    if (this.vaccineTypeData) {
      this.ref.close({selectData: selectData, pickerData: this.pickerData});
    } else {
      this.ref.close(selectData);
    }
  }
  // 关闭
  close() {
    this.cancelAll();
    this.ref.close( {
      selectName: '',
      selectCode: '',
      aliasName: [],
      selectAcronym: []
    });
  }
}
