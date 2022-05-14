import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GameEndpoints } from 'src/app/core/endpoints';
import { GameService } from 'src/app/core/game.service';
import { Player } from 'src/app/core/objects/player';
import { SoundService } from 'src/app/core/sound.service';

@Component({
  selector: 'app-players-window',
  templateUrl: './players-window.component.html',
  styleUrls: ['./players-window.component.scss']
})
export class PlayersWindowComponent implements OnInit {
  @Input()
  adminMode: boolean = false;
  
  players: Player[] = [];

  statusText: string = "Ready to start game!";

  myUsername: string = "";

  pickingWord: boolean = false;

  constructor(private soundService: SoundService, private gameService: GameService, private httpClient: HttpClient, private router: Router, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.gameService.currentGameSubject.subscribe(game => {
      if(game != null) {
        this.pickingWord = false;
        this.players = game.allPlayers;
        if(game.currentState == "PICK_WORD") {
          this.pickingWord = true;
          this.statusText = game.currentPlayer.name + " is choosing a word";
        } else if (game.currentState == "PLAY") {
          this.statusText = game.timeRemaining + " seconds remaining";
        }

        this.myUsername = this.cookieService.get("username");
        this.adminMode = false;

        this.players.forEach(player => {
          if(player.name == this.myUsername) {
            if(player.isAdmin) {
              this.adminMode = true;
            }
          }
        });
      }
    })
  }

  getIconUrl(icon: string) {
    return "assets/images/window/icons/" + icon + ".png";
  }

  startGame() {
    this.httpClient.post<boolean>(GameEndpoints.GAME_STATE_URL, "PICK_WORD", {withCredentials: true}).subscribe(result => {
      if(!result) {
        alert("Game failed to start");
      }
    }, error => {
      alert("Failed to start game due to API issue");
    })
  }

}
