import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'uea-big-screen-title',
  templateUrl: './big-screen-title.component.html',
  styleUrls: ['./big-screen-title.component.scss']
})
export class BigScreenTitleComponent implements OnInit, OnDestroy {

  /**
   * 当前时间
   */
  date: string;
  /**
   * 当前时间
   */
  time: string;
  /**
   * 星期几
   */
  day: string;
  private subscription: Subscription[] = [];

  constructor() {
  }

  ngOnInit() {
    const sub = interval(1000).subscribe(() => {
      this.changeTime();
    });
    this.subscription.push(sub);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  changeTime() {
    const myDate = new Date();
    const year = myDate.getFullYear();
    let month: any = myDate.getMonth() + 1;
    let date: any = myDate.getDate();
    let hours: any = myDate.getHours();
    let minutes: any = myDate.getMinutes();
    let seconds: any = myDate.getSeconds();
    const weekend = myDate.getDay();
    const weeks = ['星期日 ', '星期一 ', '星期二 ', '星期三 ', '星期四 ', '星期五 ', '星期六 '];
    const day = weeks[weekend];
    if (month < 10) {
      month = '0' + month;
    }
    if (date < 10) {
      date = '0' + date;
    }
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    this.date = year + '年' + month + '月' + date + '日';
    this.time = hours + ':' + minutes + ':' + seconds;
    this.day = day;
  }

}
