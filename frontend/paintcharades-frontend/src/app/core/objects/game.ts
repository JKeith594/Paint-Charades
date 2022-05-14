import { Player } from "./player";

export class Game {
    allPlayers: Player[] = [];
    roomCode: string = "";
    timeRemaining: number = 0;
    currentState: string = "";
    currentPlayer: Player = null!;
}