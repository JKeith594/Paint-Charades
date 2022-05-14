import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WindowComponent } from './core/window/window.component';
import { SignOnWindowComponent } from './windows/sign-on-window/sign-on-window.component';
import { LogOnPageComponent } from './pages/log-on-page/log-on-page.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { PaintWindowComponent } from './windows/paint-window/paint-window.component';
import { ProfileWindowComponent } from './windows/profile-window/profile-window.component';
import { PlayersWindowComponent } from './windows/players-window/players-window.component';
import { ChatWindowComponent } from './windows/chat-window/chat-window.component';
import { AlertWindowComponent } from './windows/alert-window/alert-window.component';
import { PopupWindowComponent } from './windows/popup-window/popup-window.component';
import { LobbyPageComponent } from './pages/lobby-page/lobby-page.component';
import { FormsModule } from '@angular/forms';
import { PickIconWindowComponent } from './windows/pick-icon-window/pick-icon-window.component';
import { ScoreWindowComponent } from './windows/score-window/score-window.component';
import { PickWordWindowComponent } from './windows/pick-word-window/pick-word-window.component';
import { HttpClientModule } from '@angular/common/http';
import { StompRService } from '@stomp/ng2-stompjs';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    WindowComponent,
    SignOnWindowComponent,
    LogOnPageComponent,
    GamePageComponent,
    PaintWindowComponent,
    ProfileWindowComponent,
    PlayersWindowComponent,
    ChatWindowComponent,
    AlertWindowComponent,
    PopupWindowComponent,
    LobbyPageComponent,
    PickIconWindowComponent,
    ScoreWindowComponent,
    PickWordWindowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    StompRService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
