import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {

  audio = new Audio();

  constructor() {
  }

  play(url) {
    this.audio.src = url;
    this.audio.load();
    this.audio.play();
  }

}
