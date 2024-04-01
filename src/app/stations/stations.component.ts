import { Component, OnInit } from '@angular/core';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})
export class StationsComponent implements OnInit  {

  constructor(private map: MapService) {}
  
  ngOnInit() {
    this.map.buildMap();
  }


}
