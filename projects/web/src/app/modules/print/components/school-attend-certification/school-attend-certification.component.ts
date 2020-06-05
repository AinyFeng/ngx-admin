import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'uea-care-prove',
  templateUrl: './school-attend-certification.component.html',
  styleUrls: ['./school-attend-certification.component.scss']
})
export class SchoolAttendCertificationComponent implements OnInit {
  @Input()
  schoolAttendCertification: any = {};

  constructor() {}

  ngOnInit() {}
}
