import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'uea-out-in-date',
  templateUrl: './out-in-date.component.html',
  styleUrls: ['./out-in-date.component.scss']
})
export class OutInDateComponent implements OnInit {

  dateForm: FormGroup;
  title: any;

  today = new Date();
  outInDate: any;

  /**
   * 输出的时间值
   */
  @Input()
  outDate;

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.dateForm = this.fb.group({
      outInDate: [new Date(), null]
    });
    this.outDate = this.dateForm.get('outInDate').value;

  }

  disabledDate = (d: Date) => {
    return d > this.today;
  }

  changeTime() {
    this.outDate = this.dateForm.get('outInDate').value;
  }

}
