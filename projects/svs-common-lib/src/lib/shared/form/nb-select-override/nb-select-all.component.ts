import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'uea-nb-select-all',
  template: `
      <form [formGroup]="selectForm" (click)="touch()">
          <nb-select [multiple]="multiple"
                     [(selected)]="selectedData"
                     formControlName="selectFormControl"
                     fullWidth
                     [placeholder]="placeholderText"
                     size="medium"
                     (selectedChange)="onSelectedChange($event)">
              <nb-option *ngFor="let op of _options" [value]="op[valueText]">{{ op[labelText] }}</nb-option>
          </nb-select>
      </form>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NbSelectAllComponent),
      multi: true
    }
  ]
})

export class NbSelectAllComponent implements OnInit, ControlValueAccessor {

  /**
   * 选择表单
   */
  selectForm: FormGroup;

  selectAllValue = 'ALL_SELECT';

  selectAllLabel = '全选';

  @Input()
  valueText = 'value';

  @Input()
  labelText = 'label';

  /**
   * 当前已选数据
   */
  selectedData = [];

  /**
   * 是否选择全部，默认true
   */
  @Input()
  selectAll = true;

  /**
   * placeholder显示内容
   */
  @Input()
  placeholderText = '请选择';

  /**
   * 是否多选，默认true
   */
  @Input()
  multiple = true;

  /**
   * 之前已选择的数据
   */
  oldSelectedData = [];

  onTouched = () => {
  }

  propagateChange = (_: any) => {
  }

  _options = [];

  @Input('options')
  set options(options: any[]) {
    if (!options  || options.length === 0) return;
    if (this.selectAll) {
      const option = options.find(o => o[this.labelText] === this.selectAllValue);
      if (!option) {
        let all_Select: any = {};
        all_Select[this.labelText] = this.selectAllLabel;
        all_Select[this.valueText] = this.selectAllValue;
        this._options.push(all_Select);
        options.forEach(op => this._options.push(op));
      } else {
        options.forEach(op => this._options.push(op));
      }
    } else {
      options.forEach(op => this._options.push(op));
    }
  }

  constructor(private fb: FormBuilder) {
    this.selectForm = fb.group({
      selectFormControl: []
    });
  }

  ngOnInit(): void {

  }

  onSelectedChange(val) {
    const allValues = this._options.map(item => {
      return item[this.valueText];
    });
    const oldVal = this.oldSelectedData.length > 0 ? this.oldSelectedData : [];
    if (val.includes(this.selectAllValue)) {
      this.selectedData = allValues;
    }
    if (oldVal.includes(this.selectAllValue) && !val.includes(this.selectAllValue)) {
      this.selectedData = [];
    }
    if (oldVal.includes(this.selectAllValue) && val.includes(this.selectAllValue)) {
      const index = val.indexOf(this.selectAllValue);
      val.splice(index, 1); // 排除全选选项
      this.selectedData = val;
    }
    if (!oldVal.includes(this.selectAllValue) && !val.includes(this.selectAllValue)) {
      if (val.length === allValues.length - 1) {
        this.selectedData = [this.selectAllValue].concat(val);
      }
    }
    this.oldSelectedData = this.selectedData;
    if (this.selectedData.includes(this.selectAllValue)) {
      this.propagateChange(null);
    } else {
      this.propagateChange(this.selectedData);
    }
  }

  /**
   * 点击之后触发的事件
   */
  touch() {
    this.onTouched();
  }

  /**
   * 向表单中写值，由外界向组件写入初始值，比如父组件
   * @param obj
   */
  writeValue(obj: any): void {
    if (obj) {
      this.selectForm.get('selectFormControl').patchValue(obj);
    }
  }

  /**
   * 当表单的值发生变化时，向外广播表单模块发生变化
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * 当表单被touch 之后，向外广播表单被touch 的变化
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * 设置表单的 disable 状态
   * @param isDisabled
   */
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.selectForm.get('selectFormControl').disable();
    } else {
      this.selectForm.get('selectFormControl').enable();
    }
  }

}
