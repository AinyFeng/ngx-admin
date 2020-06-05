import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[debounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {
  @Output() readonly debounceClick = new EventEmitter();
  @Input() debounceTime = 3000;
  private clicks = new Subject();
  private subscription: Subscription;

  @Input() disableKeyUp = true;

  constructor() { }

  ngOnInit(): void {
    // 使用throttleTime 只处理在debounceTime 时间范围内的第一次操作，在时间范围内的第二次及剩余操作不会被处理
    this.subscription = this.clicks
      .pipe(throttleTime(this.debounceTime))
      .subscribe(event => this.debounceClick.emit(event));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.disableKeyUp) return;
    event.preventDefault();
    event.stopPropagation();
    // console.log(event);
    this.clicks.next(event);
  }

  @HostListener('keyup.enter', ['$event'])
  onKeyUpEnter(event: KeyboardEvent) {
    if (this.disableKeyUp) return;
    // console.log(event);
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
