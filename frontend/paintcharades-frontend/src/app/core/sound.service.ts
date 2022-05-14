import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor() { }

  playSound(soundUrl: string) {
    let audioElement = new Audio(soundUrl);
    audioElement.addEventListener('loadeddata', () => {
      audioElement.play();
    })
  }
}
