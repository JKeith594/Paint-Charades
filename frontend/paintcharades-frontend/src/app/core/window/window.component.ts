import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {
  @Input()
  title: string = "";

  @Input()
  showMenuBar: boolean = true;

  @Input()
  width: number = -1;

  @Input()
  height: number = -1;

  @Input()
  active: boolean = false;

  @Input()
  visible: boolean = true;

  @Input()
  windowIconUrl: string = "assets/images/window/icons/paint.png";

  constructor() { }

  ngOnInit(): void {
  }

}
