import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StompRService } from '@stomp/ng2-stompjs';
import { create, SimpleDrawingBoard } from '@tguesdon/simple-drawing-board';
import { CookieService } from 'ngx-cookie-service';
import { LoginEndpoints } from 'src/app/core/endpoints';
import { GameService } from 'src/app/core/game.service';
import { LoginRequest } from 'src/app/core/objects/login-request';
import { LoginResponse } from 'src/app/core/objects/login-response';
import { WebsocketService } from 'src/app/websocket.service';

@Component({
  selector: 'app-sign-on-window',
  templateUrl: './sign-on-window.component.html',
  styleUrls: ['./sign-on-window.component.scss']
})
export class SignOnWindowComponent implements OnInit, AfterViewInit {
  @ViewChild('profilePictureCanvasElement') profilePictureCanvasElement: ElementRef<HTMLCanvasElement> = null!;

  drawingCanvas: SimpleDrawingBoard = null!;

  currentLineSize = 10;
  currentColor = "red";
  attemptingLogin: boolean = false;

  title: string = "Connect To";
  statusText: string = "";
  canCancel: boolean = false;

  username: string = "";
  roomCode: string = "";
  
  constructor(private router: Router, private httpClient: HttpClient, 
    private stompService: StompRService, 
    private websocketService: WebsocketService, 
    private cookieService: CookieService,
    private gameService: GameService) { }

  ngAfterViewInit(): void {

  }


  ngOnInit(): void {
    if(this.cookieService.check("sessionId") && this.cookieService.check("username") && this.cookieService.check("roomCode")) {
      let loginRequest: LoginRequest = new LoginRequest();
      loginRequest.username = this.cookieService.get("username");
      loginRequest.roomCode = this.cookieService.get("roomCode");
      loginRequest.sessionId = this.cookieService.get("sessionId");
      this.hitLogInEndpoint(loginRequest);
    }
  }

  async logIn() {
    if(this.username.length != 0) {
      this.attemptingLogin = true;
      this.canCancel = false;
      this.title = "Connecting to PaintCharades 95";
      this.statusText = "Dialing 15552529348..."
      //let delayres = await this.delay(3000);
  
      this.statusText = "Attempting log in...";
      //delayres = await this.delay(2000);

      let loginRequest: LoginRequest = new LoginRequest();
      loginRequest.username = this.username;
      loginRequest.roomCode = this.roomCode.toUpperCase();

      this.hitLogInEndpoint(loginRequest);
    }
  }

  private hitLogInEndpoint(loginRequest: LoginRequest) {
    this.attemptingLogin = true;
    this.canCancel = false;
    this.title = "Connecting to PaintCharades";

    this.httpClient.post<LoginResponse>(LoginEndpoints.LOGIN_ROOT_URL, loginRequest).subscribe(result => {
      if (result.response == "OK") {
        this.cookieService.set("sessionId", result.sessionId, {path: '/', sameSite: 'Lax'});
        this.cookieService.set("username", this.username == null || this.username == "" ? this.cookieService.get("username") : this.username, {path: '/', sameSite: 'Lax'});
        this.cookieService.set("roomCode", result.roomCode, {path: '/', sameSite: 'Lax'});
        this.statusText = "Logged in!";
        this.gameService.setCurrentGame(result.game);
        this.router.navigate(['/lobby']);
      } else {
        this.statusText = result.response;
        this.canCancel = true;
      }

      // this.websocketService.init();
      // this.stompService.publish("/app/login", this.username);
    }, error => {
      this.statusText = "Failed to reach the PaintCharades server";
      this.canCancel = true;
    });
  }

  readyToLogIn(): boolean {
    return this.username.length != 0
    && (this.roomCode.length == 0 || this.roomCode.length == 4)
  }

  cancelLogIn() {
    this.attemptingLogin = false;
    this.title = "Connect To";
  }

  delay(delayInms: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }

}
