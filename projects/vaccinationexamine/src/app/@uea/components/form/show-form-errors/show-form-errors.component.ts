import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';

@Component({
  selector: 'uea-show-form-errors',
  template: `
      <div *ngIf="shouldShowErrors()">
      <span
              class="alert-danger-qb d-inline-block"
              *ngFor="let error of listOfErrors()"
      >{{ error }}</span
      >
      </div>
  `,
  styleUrls: ['./show-form-errors.component.scss']
})

/**
 * 定义表单错误提示组件，用于在用户输入时对输入的信息进行错误提示
 */
export class ShowFormErrorsComponent implements OnInit {
  /**
   * 定义的错误内容显示项对象 - errorMessages
   * 其中的顺序对页面显示是有影响的，优先级高的放在前面
   */
    // Commented by XHB : Lambda is not supported by angular AOT compiler !!!
    // private static readonly errorMessages = {
    //   'required': () => '该项为必填项',
    //   'inputError': (params) => params.message,
    //   'minlength': (params) => '至少输入' + params.requiredLength + '个字符',
    //   'maxlength': (params) => '最多输入' + params.requiredLength + '个字符',
    //   'min': (params) => `输入的最小值为${params.min}`,
    //   'max': (params) => `输入的最大值为${params.max}`,
    //   'pattern': (params) => '输入格式不对 ' + params.requiredPattern,
    //   'phoneError': (params) => params.message,
    //   'idCardError': (params) => params.message
    // };

  @Input() control: AbstractControlDirective | AbstractControl;

  @Input() controlName: string;

  onDetectChange = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  shouldShowErrors(): boolean {
    const flag =
      this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched);
    this.onDetectChange.emit({ formControlName: this.controlName, show: flag });
    return flag;
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors).map(field =>
      this.getMessage(field, this.control.errors[field])
    );
  }

  private getMessage(type: string, params: any) {
    // console.log(this.control);
    // console.log(type, params);
    if (type === 'nbDatepickerParse' || type === 'nbDatepickerMax') return;
    if (type === 'required') return '该项为必填项！';
    if (type === 'confirm') return '输入的两个密码不一致！';
    if (type === 'error') return '输入有误！';
    if (type === 'inputError') return params.message;
    if (type === 'minlength') return '至少输入' + params.requiredLength + '个字符';
    if (type === 'maxlength') return '最多输入' + params.requiredLength + '个字符';
    if (type === 'min') return `必须要大于等于${params.min}`;
    if (type === 'max') return `输入的最大值为${params.max}`;
    if (type === 'pattern') return '输入格式不对 ' + params.requiredPattern;
    if (type === 'phoneError') return params.message;
    if (type === 'idCardError') return params.message;
    if (type === 'immuVacCardError') return params.message;

    return 'TODO: to do ......';
  }
}
