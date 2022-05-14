import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/game.service';
import { Player } from 'src/app/core/objects/player';

@Component({
  selector: 'app-score-window',
  templateUrl: './score-window.component.html',
  styleUrls: ['./score-window.component.scss']
})
export class ScoreWindowComponent implements OnInit {

  constructor(private gameService: GameService) { }
  players: Player[] = [];

  ngOnInit(): void {
    this.gameService.currentGameSubject.subscribe(game => {
      if(game != null) {
        this.players = game.allPlayers;
      }
    })
  }

  getIconUrl(icon: string) {
    return "assets/images/window/icons/" + icon + ".png";
  }
}
