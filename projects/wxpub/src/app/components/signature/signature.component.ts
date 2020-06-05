import {Component, Input, Output, ViewChild, OnInit, AfterViewInit, HostListener, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-signature-component',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.less']
})
export class SignatureComponent implements AfterViewInit {
  @ViewChild('sigPad') sigPad;
  // 一定要写上@Input装饰器
  @Input() options: Object;

  @Output()
    // tslint:disable-next-line:prefer-output-readonly
  SaveImage: EventEmitter<string> = new EventEmitter<string>();

  sigPadElement;
  context;
  isDrawing = false;
  img;
  canvasWidth: number;
  canvasHeight: number;

  ngAfterViewInit() {
    // this.canvasWidth = 375;
    this.sigPadElement = this.sigPad.nativeElement;
    this.context = this.sigPadElement.getContext('2d');
    this.canvasWidth = window.screen.width;
    this.canvasHeight = window.screen.height * 0.6;
    this.context.strokeStyle = 'red';
  }


  @HostListener('document:mouseup', ['$event'])
  onMouseUp(e) {
    this.isDrawing = false;
  }

  // 触摸屏
  onTouchDown(e) {
    console.log('====onTouchDown=====');
    this.isDrawing = true;
    const coords = this.relativeTouchCoords(e);
    this.context.moveTo(coords.x, coords.y);
  }

  onTouchMove(e) {
    console.log('====onTouchMove=====', e);
    if (this.isDrawing) {
      e.preventDefault();
      const coords = this.relativeTouchCoords(e);
      console.log(11, coords);
      this.context.lineTo(coords.x, coords.y);
      this.context.strokeStyle = 'red';

      this.context.stroke();
    }
  }

  // 鼠标
  onMouseDown(e) {
    console.log('====onMouseDown=====');
    this.isDrawing = true;
    const coords = this.relativeMouseCoords(e);
    this.context.moveTo(coords.x, coords.y);
  }

  onMouseMove(e) {
    console.log('====onMouseMove=====', e);
    if (this.isDrawing) {
      const coords = this.relativeMouseCoords(e);
      // console.log(11, coords);
      this.context.lineTo(coords.x, coords.y);
      this.context.stroke();
    }
  }

  private relativeTouchCoords(event) {
    const bounds = event.target.getBoundingClientRect();
    // console.log(4, bounds);
    const touch = event.touches[0];
    const x = touch.clientX - bounds.left;
    const y = touch.clientY - bounds.top;
    return {x, y};
  }

  private relativeMouseCoords(event) {
    const bounds = event.target.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    return {x, y};
  }

  clear() {
    this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
    this.context.beginPath();
  }

  save() {
    this.img = this.sigPadElement.toDataURL('image/png');
    this.SaveImage.emit(this.img);
    console.log(this.img);
  }

}
