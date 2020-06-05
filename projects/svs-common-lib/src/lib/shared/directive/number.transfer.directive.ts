import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[numberTransfer]'
})
/**
 * 将input 输入框的值强制转换为数值类型
 */
export class NumberTransferDirective {

  /**
   * 设置默认最小值，当input框的输入值小于此项值则将会使用该默认最小值，默认为0
   */
  private _defaultMinValue = 0;

  /**
   * 可以设置默认最小值
   * @param val
   */
  @Input('numberTransfer')
  set numberValue(val: number) {
    this._defaultMinValue = val;
  }

  constructor(private ele: ElementRef) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (
      // Allow: Delete, Backspace, Tab, Escape, Enter
      [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      (e.key === 'A' && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.key === 'C' && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.key === 'V' && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key === 'X' && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.key === 'A' && e.metaKey === true) || // Cmd+A (Mac)
      (e.key === 'C' && e.metaKey === true) || // Cmd+C (Mac)
      (e.key === 'V' && e.metaKey === true) || // Cmd+V (Mac)
      (e.key === 'X' && e.metaKey === true) || // Cmd+X (Mac)
      (e.keyCode >= 35 && e.keyCode <= 39) // Home, End, Left, Right
    ) {
      return;  // let it happen, don't do anything
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData
      .getData('text/plain')
      .replace(/\D/g, ''); // get a digit-only string
    document.execCommand('insertText', false, pastedInput);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event.dataTransfer
      .getData('text').replace(/\D/g, '');
    this.ele.nativeElement.focus();
    document.execCommand('insertText', false, textData);
  }

  @HostListener('keyup', ['$event.target'])
  inputChangeValue(evt) {
    if (evt.validity) {
      const validity: ValidityState = evt.validity;
      if (!validity.valid) {
        // this.ele.nativeElement.value = this._defaultMinValue;
        // 如果输入的值不符合要求的话就置为空
        this.ele.nativeElement.value = '';
        return;
      }
    }
    if (evt.value) {
      const num = Number(evt.value);
      if (num < this._defaultMinValue) {
        this.ele.nativeElement.value = this._defaultMinValue;
      } else {
        this.ele.nativeElement.value = num;
      }
    }
  }

}
