import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'uea-realtime-data',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./realtime-data.component.scss']
})
export class RealtimeDataComponent implements OnInit {


  constructor(
  ) {
  }

  ngOnInit() {
  }
}
