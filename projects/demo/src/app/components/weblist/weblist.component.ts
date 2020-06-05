import { Component, OnInit } from '@angular/core';
import { AuthService, UserService } from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-weblist',
  templateUrl: './weblist.component.html',
  styleUrls: ['./weblist.component.scss']
})
export class WeblistComponent implements OnInit {

  constructor(private authService: AuthService,
    private userService: UserService) { }

  ngOnInit() {
  }

  playAudio() {
    let audio = new Audio();
    audio.src = './assets/audio/Windows-Critical-Stop.wav';
    audio.load();
    audio.play();
  }


  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

}
