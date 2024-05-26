import { Component, Input, PipeTransform } from '@angular/core';
import { StationService } from '../services/station.service';
import { Output, EventEmitter } from '@angular/core';
import { Station } from '../models/station';
import { FormControl } from '@angular/forms';

function search(this: any, text: string, pipe: PipeTransform): Station[] {
  return this.models.filter((model: { model_year: string; model_name: any; }) => {
    const term = text.toLowerCase();
    return (
      model.model_name.toLowerCase().includes(term) ||
      pipe.transform(model.model_year).includes(term)
    );
  });
}

@Component({
  selector: 'app-stations-list',
  templateUrl: './stations-list.component.html',
  styleUrls: ['./stations-list.component.css']
})
export class StationsListComponent {
  @Output() onUpdateClick = new EventEmitter<Station>();
  @Output() onRemoveClick = new EventEmitter<Station>();
  @Output() onEmployees = new EventEmitter<Station>();
  filter = new FormControl('', { nonNullable: true });

  public stations_list_route:Station[] = [];
  @Input({ required: false }) route_id!: number;

  constructor(public station_service: StationService){

  }

  public emitUpdate(station:Station){
    
    this.onUpdateClick.emit(station);
  }

  public emitRemove(station:Station){
    this.onRemoveClick.emit(station);
  }

  emitEmployes(station:Station){
    this.onEmployees.emit(station);
  }


}
