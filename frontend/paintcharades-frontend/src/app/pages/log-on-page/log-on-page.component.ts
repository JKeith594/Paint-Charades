import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-on-page',
  templateUrl: './log-on-page.component.html',
  styleUrls: ['./log-on-page.component.scss']
})
export class LogOnPageComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {

  }

}
