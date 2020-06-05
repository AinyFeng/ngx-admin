import { Directive, ElementRef, HostListener } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Directive({
  selector: '[inputDateFormat]'
})

export class DateInputFormatDirective {

  private regExpression = new RegExp('[0-9\-{0, 2}][10]');

  constructor(private ele: ElementRef,
              private msg: NzMessageService) {
  }

  @HostListener('keyup', ['$event.target'])
  onHostElementKeyUp(evt) {
    const val = this.ele.nativeElement.value;
    if (val.length === 4 || val.length === 7) {
      this.ele.nativeElement.value = val + '-';
    }
  }
}
