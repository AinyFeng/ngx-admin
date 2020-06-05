import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {FormGroup, FormControl, NgControl} from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[inputNoSpace]'
})

/**
 * 将input 输入框的值强制去除空格
 */
export class InputNoSpaceDirective {

  constructor(
    private elementRef: ElementRef,
    private control: NgControl) {
  }

  @HostListener('keydown', ['$event'])
  keydownFun(evt) {
    if (evt.key.trim() === '') {
      evt.preventDefault();
    }
  }

  @HostListener('keyup', ['$event', '$event.target'])
  keyupFun(evt, target) {
    if (target.value) {
      this.control.control.setValue(target.value.replace(/(\s*)/g, ''));
      this.control.control.setValue(target.value.replace(/[#$%^&*!()=|{}:;',"?/\\+-]/g, ''));
    }
  }

}
