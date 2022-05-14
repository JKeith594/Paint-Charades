import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-window',
  templateUrl: './alert-window.component.html',
  styleUrls: ['./alert-window.component.scss']
})
export class AlertWindowComponent implements OnInit {

  @Input()
  alertMessage: string = "";

  @Input()
  visible: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
