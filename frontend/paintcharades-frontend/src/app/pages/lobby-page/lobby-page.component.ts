import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GameService } from 'src/app/core/game.service';

@Component({
  selector: 'app-lobby-page',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.scss']
})
export class LobbyPageComponent implements OnInit {

  constructor(private gameService: GameService, private router: Router, private cookieService: CookieService) { }

  pickingWord: boolean = false;
  roomCode: string = "";

  ngOnInit(): void {
    this.gameService.currentGameSubject.subscribe(currentGame => {
      if(currentGame != null) {
        this.roomCode = currentGame.roomCode;

        if(currentGame.currentState.toUpperCase() == "PICK_WORD") {
          if(this.cookieService.get("username") == currentGame.currentPlayer.name) {
            this.pickingWord = true;
          }
        }
      }
    });
  }

  
}
