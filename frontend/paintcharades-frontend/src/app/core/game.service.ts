import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Game } from './objects/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor() { }

  public gameRunning = new BehaviorSubject<boolean>(false);

  public setGameRunning(gameStatus: boolean): void {
    this.gameRunning.next(gameStatus);
  }

  public currentGameSubject = new BehaviorSubject<Game>(null!);
  private currentGame: Game = null!;

  public setCurrentGame(game: Game) {
    this.currentGameSubject.next(game);
    this.currentGame = game;
  }

  public getCurrentGame(): Game {
    return this.currentGame;
  }
}
