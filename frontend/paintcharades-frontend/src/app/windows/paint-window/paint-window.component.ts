import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StompRService } from '@stomp/ng2-stompjs';
import { create, SimpleDrawingBoard } from '@tguesdon/simple-drawing-board';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/core/game.service';
import { WebsocketService } from 'src/app/websocket.service';

@Component({
  selector: 'app-paint-window',
  templateUrl: './paint-window.component.html',
  styleUrls: ['./paint-window.component.scss']
})
export class PaintWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('paintCanvasElement') paintCanvasElement: ElementRef<HTMLCanvasElement> = null!;

  drawingCanvas: SimpleDrawingBoard = null!;

  constructor(private websocketService: WebsocketService, private stompService: StompRService, private gameService: GameService, private cookieService: CookieService) { }
  ngOnDestroy(): void {
    if(this.drawingCanvas != null) {
      this.drawingCanvas.destroy();
    }
  }

  selectedTool: string = 'DRAW';
  selectedToolSize: number = 5;
  selectedColor: string = "#000000";

  undoCount: number = 0;
  
  isClient: boolean = false;

  currentImageBinaryString: string = "";

  drawingSubscription: Subscription = null!;

  drawingTimer: NodeJS.Timeout = null!;

  userDrawing: string = "";
  wordToDraw: string = "";

  ngAfterViewInit(): void {
    this.initalizePaintCanvas();

    if(this.drawingCanvas != null) {
      this.drawingCanvas.observer.on("drawBegin", () => {
        this.drawingTimer = setInterval(() => {
          this.stompService.publish({destination: '/app/drawing', body: this.drawingCanvas.toDataURL(), skipContentLengthHeader: true})
        }, 100);
      });
  
      this.drawingCanvas.observer.on("drawEnd", () => {
        if(this.drawingTimer != null) {
          clearInterval(this.drawingTimer);
        }
        this.undoCount++;
        this.stompService.publish({destination: '/app/drawing', body: this.drawingCanvas.toDataURL(), skipContentLengthHeader: true})
      });
    }
  }

  ngOnInit(): void {
    this.websocketService.init();

    this.gameService.currentGameSubject.subscribe(game => {
      if(game != null) {
        this.userDrawing = game.currentPlayer.name;
        if(this.userDrawing != this.cookieService.get("username")) {
          this.initDrawingSubscription(true);
        } else {
          this.wordToDraw = this.cookieService.get("wordToDraw");
          this.initDrawingSubscription(false);
        }
      }
    });
  }

  initDrawingSubscription(isClient: boolean) {
    this.isClient = isClient;

    if(this.drawingSubscription == null && this.isClient) {
      let roomCode = this.cookieService.get("roomCode");
      this.drawingSubscription = this.stompService.subscribe('/topic/drawing/' + roomCode).subscribe(drawingResult => {
        this.currentImageBinaryString = drawingResult.body;
      })
    }
  }

  initalizePaintCanvas() {
    if(this.paintCanvasElement != null) {
      this.drawingCanvas = create(this.paintCanvasElement.nativeElement);
      this.drawingCanvas.setLineColor(this.selectedColor);
      this.drawingCanvas.setLineSize(this.selectedToolSize);
    }
  }

  selectTool(toolMode: string, size: number) {
    if(this.drawingCanvas != null) {
      this.selectedTool = toolMode;
      this.selectedToolSize = size;
      this.drawingCanvas.toggleMode(toolMode);

      if(size != null) {
        this.drawingCanvas.setLineSize(size);
      }
    }
  }

  selectColor(color: string) {
    if(!this.isClient) {
      this.selectedColor = color;

      if(this.drawingCanvas != null) {
        this.drawingCanvas.setLineColor(this.selectedColor);
      }
    }
  }

  undo() {
    if(this.drawingCanvas != null && !this.isClient) {
      this.drawingCanvas.undo();
      this.undoCount--;
      this.stompService.publish({destination: '/app/drawing', body: this.drawingCanvas.toDataURL(), skipContentLengthHeader: true})
    }
  }

  statusText(): string {
    if(this.isClient) {
      return this.userDrawing + " is currently drawing...";
    } else {
      return "You are drawing the word \"" + this.wordToDraw + "\"...";
    }
  }

}
