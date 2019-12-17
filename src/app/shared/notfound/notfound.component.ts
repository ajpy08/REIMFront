import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {
  
  url = '';
  constructor() { }

  ngOnInit() {
    this.url = window.location.href;
  }

}
