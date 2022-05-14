import { Component, OnInit } from '@angular/core';
import { StompRService } from '@stomp/ng2-stompjs';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/core/game.service';
import { WebsocketService } from 'src/app/websocket.service';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {

  constructor(private websocketService: WebsocketService, private stompService: StompRService, private gameService: GameService) { }

  gameSubscription: Subscription = null!;

  alertString: string = "";
  showAlert: boolean = false;

  ngOnInit(): void {
    this.gameService.currentGameSubject.subscribe(game => {
      if(game != null) {
        if(this.gameSubscription == null) {
          this.websocketService.init();
          this.gameSubscription = this.stompService.subscribe('/topic/alert/' + game.roomCode).subscribe(alertResult => {
            this.alertString = alertResult.body;

            this.showAlert = true;
            setTimeout(() => {
              this.showAlert = false;
            }, 5000);
          })
        }
      }
    });
  }

}
