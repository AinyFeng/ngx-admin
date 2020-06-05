import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '@delon/theme';

@Component({
  selector: 'big-screen-frame',
  template: `
    <div style="display: flex;flex-direction: column;height: 100vh;background-color: #1e293b;padding: 16px;">
      <uea-big-screen-title style="height: 4rem;margin-bottom: 32px;"></uea-big-screen-title>
      <div style="flex: 1;">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrls: ['./big.screen.scss']
})

export class BigScreenFrame implements OnInit {

  constructor(@Inject(DOCUMENT) private doc, @Inject(WINDOW) private window) {
  }

  ngOnInit(): void {
  }
}
