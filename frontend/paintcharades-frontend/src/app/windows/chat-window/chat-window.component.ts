import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StompRService } from '@stomp/ng2-stompjs';
import { IMessage } from '@stomp/stompjs';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject, Subscription } from 'rxjs';
import { ChatService } from 'src/app/core/chat.service';
import { GameService } from 'src/app/core/game.service';
import { ChatMessage } from 'src/app/core/objects/chat-message';
import { SoundService } from 'src/app/core/sound.service';
import { WebsocketService } from 'src/app/websocket.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chatScrollContainer') private chatScrollContainer: ElementRef<HTMLDivElement> = null!;

  @ViewChild('chatInputBox') private chatInputBox: ElementRef<HTMLTextAreaElement> = null!;

  messageToSend: string = "";
  chatHistory: ChatMessage[] = [];
  chatSubject: Subscription = null!;

  constructor(private cookieService: CookieService, private soundService: SoundService, private websocketService: WebsocketService, private stompService: StompRService, private chatService: ChatService) { }
  ngOnDestroy(): void {
    this.chatSubject.unsubscribe();
  }

  ngAfterViewInit(): void {
    if(this.chatSubject == null) {
      this.chatSubject = this.chatService.chatSubject.subscribe(chat => {
        if(chat != null) {
          this.chatHistory = chat;
          this.scrollToBottom();

          if(this.cookieService.get("username") != this.chatHistory[this.chatHistory.length - 1].username && this.chatHistory[this.chatHistory.length - 1].username.toLowerCase() != "system") {
            this.soundService.playSound("assets/sounds/imrcv.wav");
          }
        }
      })
    }
  }

  subject: any = null!;
  
  chatSubscription: Subscription = null!;

  ngOnInit(): void {
    
  }

  sendChatMessage(event: any) {
    if(event != null) {
      event.preventDefault();
    }
    this.websocketService.init();
    this.stompService.publish("/app/chat", this.messageToSend);
    this.messageToSend = "";
    this.chatInputBox.nativeElement.focus();
    this.soundService.playSound("assets/sounds/imsend.wav");
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight + 32;
    }, 50)
  }

  getIconUrl(icon: string): string {
    return "assets/images/window/icons/" + icon + ".png";
  }

}
