import { Component, OnInit } from '@angular/core';
import { AuthService } from '@tod/uea-auth-lib';
import { UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss']
})
export class FrameComponent implements OnInit {

  title = 'demo';

  ngOnInit() {
  }
}
