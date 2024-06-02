import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Station } from '../models/station';
import { map } from 'rxjs';
import { StationSequence } from '../models/station-sequence';
import { Marker } from 'mapbox-gl';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  markerStationPositions: google.maps.LatLngLiteral[] = [];
  markerStationPositionsByRute: google.maps.LatLngLiteral[] = [];
  stationMarkerOptionsList: google.maps.MarkerOptions[] = [];
  public selected_station:Station = new Station();
  public stations_list:Station[] = [];
  public stations_list_route:Station[] = [];
  public stations_sequence_list:StationSequence[] = [];
  public route_long!: number
  public route_long_routes!:number

  public check_in = { hour: 8, minute: 0 };

  onStationsReady = new EventEmitter<boolean>();
  

  constructor(private httpClient: HttpClient) { }

  public getStations() {
    this.httpClient.get(environment.apiHost + '/stations').pipe(
     map(data => data as Station[])
   ).pipe(
     map(message => message as any)
   ).subscribe(respose => {
       this.stations_list = respose;
       respose.forEach((station: any) => {
         let lat_lng = this.getLatLngFromStationRow(station);
         this.markerStationPositions.push({lat:lat_lng[0],lng:lat_lng[1]});
         if(station.marker_type == 'station')
          this.stationMarkerOptionsList.push( {title:station.station_name, icon:'https://maps.gstatic.com/mapfiles/ms2/micons/bus.png', draggable:false});
         else
           this.stationMarkerOptionsList.push( {title:station.station_name + station.station_id, icon:'http://maps.gstatic.com/mapfiles/ms2/micons/flag.png', draggable:false});
       })
       

       
   });
 }

 public getStationsSequenceByRoute(route_id:number) {
  debugger
   this.httpClient.get(environment.apiHost + '/stations/' + route_id).pipe(
   map(data => data as StationSequence[])
 ).pipe(
   map(message => message as any)
 ).subscribe(respose => {
      
     this.stations_sequence_list = respose;
     this.stationMarkerOptionsList = [];
     this.markerStationPositionsByRute = [];
     respose.forEach((station: any) => {
      let lat_lng = this.getLatLngFromStationRow(station);
      
      this.markerStationPositionsByRute.push({lat:lat_lng[0],lng:lat_lng[1]});
      if(station.marker_type == 'station')
       this.stationMarkerOptionsList.push( {title:station.station_name, icon:'https://maps.gstatic.com/mapfiles/ms2/micons/bus.png', draggable:false});
      else
       this.stationMarkerOptionsList.push( {title:station.station_name + station.station_id, icon:'http://maps.gstatic.com/mapfiles/ms2/micons/flag.png', draggable:false});
      
    })
    this.calculateRouteLong();
    this.onStationsReady.emit(true);
   });
}

public getStationsByRoute(route_id:number){
  this.httpClient.get(environment.apiHost + '/stations/byRoute/' + route_id).pipe(
    map(data => data as Station[])
  ).pipe(
    map(message => message as any)
  ).subscribe(respose => {
    this.stations_list_route = respose;
  });


}

calculateRouteLong(){
  debugger
  let firstMarker:  google.maps.LatLngLiteral = {lat:0,lng:0};
  let secondMarker: google.maps.LatLngLiteral = {lat:0,lng:0};
  let routeDistance = 0;
  this.route_long=0;
  this.markerStationPositionsByRute.forEach((marker, index) => {
    if(firstMarker.lat == 0) {
      firstMarker = marker;
    }else {
      if(secondMarker.lat==0){
        secondMarker = marker;
      }
      let stationDistance = this.haversine_distance(firstMarker,secondMarker)
      routeDistance = routeDistance + stationDistance;
      //firstMarker = {lat:0,lng:0}
      firstMarker=secondMarker
      secondMarker={lat:0,lng:0}
    }
    
  })
  
  this.route_long =  parseFloat(routeDistance.toFixed(2));
  console.log(routeDistance);
}

haversine_distance(mk1:google.maps.LatLngLiteral, mk2:google.maps.LatLngLiteral) {
  //var R = 3958.8; // Radius of the Earth in miles
  var R =  6371.07
  var rlat1 = mk1.lat * (Math.PI/180); // Convert degrees to radians
  var rlat2 = mk2.lat * (Math.PI/180); // Convert degrees to radians
  var difflat = rlat2-rlat1; // Radian difference (latitudes)
  var difflon = (mk2.lng-mk1.lng) * (Math.PI/180); // Radian difference (longitudes)

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  return d;
}

calculateDistanceToOffice(){
  
}

 public saveStation(payload: Station,route_id:number) {
  
  payload.active = 1;
  payload.check_in = this.check_in.hour.toString().padStart(2,'00') + ":" + this.check_in.minute.toString().padStart(2,'00')
  return this.httpClient.post(environment.apiHost + '/stations/',payload).pipe(
    map(data => data as Station)
  ).pipe(
    map(message => message as any)
  ).subscribe(respose => {
      
      this.stations_list.push(respose[0]);
      this.getStationsSequenceByRoute(route_id);
      this.getStationsByRoute(route_id);
  });
  }

  public updateStation(payload: Station) {
    let station_id = payload.station_id;
    payload.check_in = this.check_in.hour.toString().padStart(2,'00') + ":" + this.check_in.minute.toString().padStart(2,'00')
    debugger;
    return this.httpClient.put(environment.apiHost + '/stations/' + station_id,payload).pipe(
      map(data => data as Station)
    ).pipe(
      map(message => message as any)
    ).subscribe(response => {
      
      console.log(response);
      this.stations_list.forEach(station => {
       if(station.station_id == station_id ){
        station.station_name = response.station_name;
        station.location = response.location;
        station.marker_type = response.marker_type;
        station.check_in=response.check_in;
        station.course = response.course;
       }
      })
    });
  }

  public deleteStation(station_id:number){
    return this.httpClient.delete(environment.apiHost + '/stations/' + station_id).pipe(
      map(data => data as Station[])
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
      
        this.stations_list = respose;
        this.setStationMarkers(this.stations_list);
    });
  }

  getLatLngFromStationRow(station:any){
    let lat_lng = station.location.split(',',2);
    lat_lng[0]=parseFloat(lat_lng[0]);
    lat_lng[1]=parseFloat(lat_lng[1]);
    return lat_lng;
 }

 public getStationByIndex(index:number) {
   return this.stations_list[index];
 }

  setStationMarkers(stations:Station[]){
    this.markerStationPositions = [];
    this.stationMarkerOptionsList = [];
    stations.forEach((station: any) => {
      let lat_lng = this.getLatLngFromStationRow(station);
       this.markerStationPositions.push({lat:lat_lng[0],lng:lat_lng[1]});
       this.stationMarkerOptionsList.push( {title:station.station_name, icon:'https://maps.gstatic.com/mapfiles/ms2/micons/bus.png', draggable:true});
     })
  
  }

  async updateStationSequence(route_id:number) {
    
    await this.stations_sequence_list.forEach((station,index) => {
      station.new_sequence = index + 1;
    })

    var payload = this.stations_sequence_list;
    return this.httpClient.put(environment.apiHost + '/stations/sequence/' + route_id,payload).pipe(
      map(data => data as Station[])
    ).pipe(
      map(message => message as any)
    ).subscribe(response => {
      
      console.log(response);
      this.stations_sequence_list = [];
      this.stations_sequence_list = response;

    });

  }


}
