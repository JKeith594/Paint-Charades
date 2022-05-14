import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { PlayerEndpoints } from 'src/app/core/endpoints';
import { GameService } from 'src/app/core/game.service';
import { Player } from 'src/app/core/objects/player';

@Component({
  selector: 'app-pick-icon-window',
  templateUrl: './pick-icon-window.component.html',
  styleUrls: ['./pick-icon-window.component.scss']
})
export class PickIconWindowComponent implements OnInit {

  players: Player[] = [];

  constructor(private cookieService: CookieService, private httpClient: HttpClient, private gameService: GameService) { }

  icons = [
    {image: 'computer', description: 'My Computer', disabled: false, selected: false},
    {image: 'floppy', description: 'Floppy', disabled: false, selected: false},
    {image: 'msn', description: 'MSN', disabled: false, selected: false},
    {image: 'aol', description: 'AOL', disabled: false, selected: false},
    {image: 'spook', description: 'Dark Agent', disabled: false, selected: false},
    {image: 'recycle', description: 'Recycle Bin', disabled: false, selected: false},
    {image: 'notepad', description: 'Notepad', disabled: false},
    {image: 'printer', description: 'Printer', disabled: false}
  ]

  ngOnInit(): void {
    this.gameService.currentGameSubject.subscribe(game => {
      if(game != null) {
        this.players = game.allPlayers;
      }
    })
  }

  setSelectedIcon(icon: any) {
    if(!icon.disabled) {
      let options = { withCredentials: true };
      this.httpClient.post<boolean>(PlayerEndpoints.PLAYER_ICON_URL, icon.image, options).subscribe(result => {
        if(result == false) {
          //ding
          alert("Failed to pick icon");
        }
      }, error => {
        //ding
        alert("Failed to pick icon");
      })
    }
  }

  getClassList(icon: any) {
    let classes = "";
    this.players.forEach(player => {
      if(player.icon == icon.image) {
        if(player.name == this.cookieService.get("username")) {
          classes += "selected "
        } else {
          classes += "disabled ";
        }
      }
    })
    return classes;
  }

  getIconPath(icon: any) {
    return "assets/images/window/icons/" + icon.image + ".png";
  }

}
