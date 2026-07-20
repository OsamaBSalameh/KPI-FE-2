import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tile-navigator',
  templateUrl: './tile-navigator.component.html',
  styleUrls: ['./tile-navigator.component.css']
})
export class TileNavigatorComponent implements OnInit {

  @Input() public tile: any

  constructor() { }

  ngOnInit(): void {
  }

}
