import { Injectable } from '@angular/core';
import { StompRService } from '@stomp/ng2-stompjs';
import { BehaviorSubject, Subscription } from 'rxjs';
import { WebsocketService } from '../websocket.service';
import { GameService } from './game.service';
import { ChatMessage } from './objects/chat-message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatSubscription: Subscription = null!;

  public chatSubject = new BehaviorSubject<ChatMessage[]>(null!);
  private chatHistory: ChatMessage[] = [];

  constructor(private websocketService: WebsocketService, private stompService: StompRService, private gameService: GameService) { 
    this.gameService.currentGameSubject.subscribe(game => {
      if(game != null) {
        if(this.chatSubscription == null) {
          this.chatSubscription = this.stompService.subscribe('/topic/chat/' + game.roomCode).subscribe(chatResult => {
            this.chatHistory.push(JSON.parse(chatResult.body));
            this.chatSubject.next(this.chatHistory);
          })
        }
      }
    })
  }
}
