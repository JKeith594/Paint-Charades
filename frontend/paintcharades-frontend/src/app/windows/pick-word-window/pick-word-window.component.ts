import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GameEndpoints } from 'src/app/core/endpoints';
import { GameService } from 'src/app/core/game.service';
import { WordRequest } from 'src/app/core/objects/word-request';

@Component({
  selector: 'app-pick-word-window',
  templateUrl: './pick-word-window.component.html',
  styleUrls: ['./pick-word-window.component.scss']
})
export class PickWordWindowComponent implements OnInit {

  constructor(private router: Router, private httpClient: HttpClient, private gameService: GameService, private cookieService: CookieService) { }

  statusText: string = "Choose a word..."

  wordOptions: WordRequest[] = [];

  selectedWord: WordRequest = null!;

  currentPlayerName: string = "";

  ngOnInit(): void {
    let options = { withCredentials: true };
    this.httpClient.get<WordRequest[]>(GameEndpoints.GAME_PICK_WORD_URL + "true", options).subscribe(result => {
      this.wordOptions = result;
    }, error => {
      alert("Failed to get words due to an API error");
    });

    this.gameService.currentGameSubject.subscribe(game => {
      if(game != null) {
        this.currentPlayerName = game.currentPlayer.name;
      }
    });
  }

  setSelectedWord(word: WordRequest) {
    this.selectedWord = word;
  }

  pickWord() {
    let options = { withCredentials: true };
    this.cookieService.set("wordToDraw", this.selectedWord.word);
    this.httpClient.post<boolean>(GameEndpoints.GAME_PICK_WORD_URL, this.selectedWord, options).subscribe(result => {
      if(result == false) {
        alert("Failed to pick word due to an error");
      }
    }, error => {
      alert("Failed to pick word due to an API error");
    });
  }

  requestNewWords() {
    this.selectedWord = null!;
    let options = { withCredentials: true };
    this.httpClient.get<WordRequest[]>(GameEndpoints.GAME_PICK_WORD_URL + "false", options).subscribe(result => {
      this.wordOptions = result;
    }, error => {
      alert("Failed to get words due to an API error");
    });
  }

}
