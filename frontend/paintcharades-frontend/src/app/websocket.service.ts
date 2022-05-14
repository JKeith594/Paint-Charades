import { Injectable } from '@angular/core';
import { StompConfig, StompRService } from '@stomp/ng2-stompjs';
import { Observable } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Message } from 'stompjs';
import { WebsocketEndpoints } from './core/endpoints';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  constructor(private stompService: StompRService) {}

  init(): void {
    if (!this.stompService.connected()) {
      console.log("Stomp service connecting...");
      this.stompService.config = this.stompConfig();

      this.stompService.initAndConnect();
    } else {
      console.log("Stomp service already connected");
    }
  }

  onEvent(): Observable<Message> {
    this.init();

    return this.stompService.subscribe('/event');
  }

  private stompConfig(): StompConfig {
    const provider = function() {
      return new SockJS(WebsocketEndpoints.WS_ROOT_URL);
    };

    const config = new StompConfig();
    config.url = provider;
    config.heartbeat_in = 0;
    config.heartbeat_out = 0;
    config.reconnect_delay = 10000;

    return config;
  }
}
