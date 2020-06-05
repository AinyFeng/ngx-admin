import { Component, OnInit } from '@angular/core';
import { AuthService, UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'demo';
  isCollapsed = true;

  // constructor(private authService: AuthService) { }

  ngOnInit() {
    // this.authService.runInitialLoginSequence();
    console.table(location);
  }

}
