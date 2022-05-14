import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StompRService } from '@stomp/ng2-stompjs';
import { create } from '@tguesdon/simple-drawing-board';
import { Subscription } from 'rxjs';
import { GameService } from './core/game.service';
import { Game } from './core/objects/game';
import { Player } from './core/objects/player';
import { SoundService } from './core/sound.service';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  gameSubscription: Subscription = null!;

  players: Player[] = [];

  constructor(private soundService: SoundService, private router: Router, private websocketService: WebsocketService, private stompService: StompRService, private gameService: GameService) {
    
  }

  ngAfterViewInit(): void {
    // const sdb = create(this.canvas.nativeElement);
    // sdb.setLineColor("red");
    // sdb.setLineSize(10);
  }

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement> = null!;

  ngOnInit(): void {
    this.gameService.currentGameSubject.subscribe(game => {
      if(game != null) {
        if(game.allPlayers.length < this.players.length) {
          this.soundService.playSound('assets/sounds/doorslam.wav');
        } else if (game.allPlayers.length > this.players.length) {
          this.soundService.playSound('assets/sounds/dooropen.wav');
        }
        this.players = game.allPlayers;
        if(this.gameSubscription == null) {
          this.websocketService.init();
          this.gameSubscription = this.stompService.subscribe('/topic/game/' + game.roomCode).subscribe(gameResult => {
            this.gameService.setCurrentGame(JSON.parse(gameResult.body));
            this.handleNavigationFromState(this.gameService.getCurrentGame().currentState);
          })
        }
      }
    });

    if(this.gameService.getCurrentGame() == null) {
      this.router.navigate(['/']);
    }
  }
  handleNavigationFromState(state: string) {
    switch(state.toUpperCase()) {
      case "PLAY":
        this.redirectToPage("/game");
        break;
      case "PICK_WORD":
      case "LOBBY":
        this.redirectToPage("/lobby");
        break;
      case "DELETED":
        this.redirectToPage("/home");
    }
  }
  redirectToPage(page: string) {
    if(!this.router.url.includes(page)){
      this.router.navigate([page]);
    }
  }
}
