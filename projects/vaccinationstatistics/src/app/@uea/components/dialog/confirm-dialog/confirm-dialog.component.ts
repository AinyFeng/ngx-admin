import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbDialogRef, NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'uea-confirm-dialog',
  template: `
    <nb-card [size]="size">
      <nb-card-header
        ><span class="mr-1"><i class="far fa-question-circle"></i></span
        >{{ title }}</nb-card-header
      >
      <nb-card-body>
        {{ content }}
      </nb-card-body>
      <nb-card-footer>
        <button nbButton [status]="status" (click)="onClick(true)">确定</button>
        <button nbButton status="info" outline (click)="onClick(false)">
          取消
        </button>
      </nb-card-footer>
    </nb-card>
  `,
  styleUrls: ['./confirm-dialog.component.scss']
})
/**
 *  确认对话框通用组件
 */
export class ConfirmDialogComponent implements OnInit {
  @Input()
  title = '';
  @Input()
  content = '';
  @Input()
  size = 'small';
  @Input()
  status = 'info';

  constructor(
    private ref: NbDialogRef<ConfirmDialogComponent>,
    iconLibraries: NbIconLibraries
  ) {
    iconLibraries.registerFontPack('fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa'
    });
    iconLibraries.registerFontPack('ion', { iconClassPrefix: 'ion' });
    iconLibraries.setDefaultPack('fas');
  }

  ngOnInit() {}

  onClick(result: boolean) {
    this.ref.close(result);
  }
}
