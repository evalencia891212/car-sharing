import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, numberAttribute, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MapDirectionsService } from '@angular/google-maps';
import { debounceTime, distinctUntilChanged, fromEvent, map, Observable } from 'rxjs';
import { Route } from '../models/route';
import { Station } from '../models/station';
import { OfficeService } from '../services/office.service';
import { RouteService } from '../services/route.service';
import { StationService } from '../services/station.service';

@Component({
  selector: 'app-station-sequence',
  templateUrl: './station-sequence.component.html',
  styleUrls: ['./station-sequence.component.css']
})
export class StationSequenceComponent implements OnInit{

  @Input({ required: false }) tour_mode: boolean = false;
  @Input({ required: false }) tour_plan_mode: boolean = false;

  @ViewChild('route_search') route_search!: ElementRef;
  @ViewChild('routeSelectList') routeSelectList!: ElementRef;

  public route_list:Route[]=[];

  stations_by_route_list: Station[] = [];

   directionsResults$: Observable<google.maps.DirectionsResult | undefined> | undefined;
   directionsResults:any;
   pathDirectionsResults:any=[];

  display: any;
  center: google.maps.LatLngLiteral = {
      lat: 23.24459112928423,
      lng: -106.39800170731318
  };
  zoom = 13;

  selected_route:string | undefined;

  vertices: google.maps.LatLngLiteral[] = [];

  constructor(public route_service:RouteService,
              public station_service: StationService,
              public mapDirectionsService: MapDirectionsService,
              public office_service: OfficeService

              ) {


  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
   }

  move(event: google.maps.MapMouseEvent) {
  if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  ngOnInit(): void {
    this.route_service.getRoutes();
    this.selected_route = "";
  

  }

  initValues() {
    this.selected_route = "";
    this.station_service.stations_list = [];
    this.station_service.markerStationPositionsByRute = [];
  }

  drop(event: CdkDragDrop<string[]>) {
    
    moveItemInArray(this.station_service.stations_sequence_list, event.previousIndex, event.currentIndex);
    this.station_service.updateStationSequence(this.route_service.selected_route.route_id);
    //const previousIndex = this.station_service.stations_list.findIndex((station) => station === event.item.data);
    //moveItemInArray(this.station_service.stations_list, previousIndex, event.currentIndex);
    //this.station_service.stations_list = this.station_service.stations_list
  }

  ngAfterViewInit() {
    this.setInputRoutesEvent();
  }

  directionToOfice(){
  var lastStationLatLng = this.station_service.markerStationPositions[ this.station_service.markerStationPositions.length - 1];
  const request: google.maps.DirectionsRequest = {
    destination: {lat: this.office_service.office_lat_lng[0], lng: this.office_service.office_lat_lng[1]},
    origin: {lat: lastStationLatLng.lat, lng: lastStationLatLng.lng},
    travelMode: google.maps.TravelMode.DRIVING
  };
    this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));
    this.directionsResults$.subscribe(result => {
        
      this.directionsResults = result;
    })
  }

  setInputRoutesEvent() {
    
    fromEvent(this.route_search.nativeElement, 'keydown').pipe(
      map((event: any) => event) // return event
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((event: any) => {
      
      let search = event.target.value // get value
      if (search.trim().length > 0) {
        this.setListStyle(this.routeSelectList);
        if (event.key == "Tab" || event.key == "Enter") {
          if (this.route_service.route_list.length > 0) {
            this.selectRoute(this.route_service.route_list[0])
          } else {
            this.inputRoute(search)
            //this.filterLocation(search);
          }

        } else if (event.key.length == 1 || event.key == "Backspace") {
          this.inputRoute(search);
          //this.filterLocation(search);
          this.removeStyle(this.routeSelectList,this.route_search);
         
        }
      } else {
        this.removeStyle(this.routeSelectList,this.route_search);
      }
    })
  }

  private setListStyle(searchList: ElementRef) {
    searchList.nativeElement.style.cssText = "position: absolute; z-index: 999; cursor: pointer;width: 305px; max-height: 150px; margin-bottom: 10px;  overflow:scroll;  -webkit-overflow-scrolling: touch;"
    searchList.nativeElement.hidden = false;
  }

  private removeStyle(searchList: ElementRef, searchInput: ElementRef) {
    
    if (searchInput.nativeElement.value == "") {
      searchList.nativeElement.style.cssText = "position: absolute; z-index: 999; cursor: pointer; "
      searchList.nativeElement.hidden = true;
    }
  }

  getStationOption(index:number){
    return this.station_service.stationMarkerOptionsList[index];
  }

  public updateStation(event:any,index:number){
    console.log(event);
  }

  inputRoute(search:any){
    this.route_list = this.route_service.route_list.filter(item => item.route_name.toUpperCase().includes(search.toUpperCase()));
  }

   async selectRoute(route:Route){
    this.route_service.selected_route = route;
    this.selected_route = route.route_name;
    this.station_service.getStationsSequenceByRoute(route.route_id);
    this.station_service.getStationsByRoute(route.route_id);
    
    this.showDistanceToOfice()
    // this.office_service.lastStationToOffice().then(result =>{
    //   
     //  this.directionsResults = result;
     //  this.calculateTotalDistanceToOfice();
      
     // });
    
    this.routeSelectList.nativeElement.hidden = true;
    console.log(route);
  }

  showDistanceToOfice(){
    this.station_service.onStationsReady.subscribe(data => {
      debugger;
      if(data == true){
        this.vertices = this.station_service.markerStationPositionsByRute;
        this.office_service.lastStationToOffice().then(result =>{
         this.directionsResults = result;
         //this.calculateTotalDistanceToOfice();
         
         this.calculateRouteDirection();
         });
      }
    })
  }

  calculateRouteDirection(){
    let firstMarker:  google.maps.LatLngLiteral = {lat:0,lng:0};
    let secondMarker: google.maps.LatLngLiteral = {lat:0,lng:0};
    let routeDistance = 0;
    
    this.station_service.markerStationPositionsByRute.forEach((marker, index) => {
      if(firstMarker.lat == 0) {
        firstMarker = marker;
      }else {
        if(secondMarker.lat==0){
          secondMarker = marker;
        }

        this.office_service.twoStationsPath(firstMarker,secondMarker).then(result=>{
          this.pathDirectionsResults.push(result);  
          this.calculateTotalDistanceRoute(result);
        });

        let stationDistance = this.haversine_distance(firstMarker,secondMarker)
        routeDistance = routeDistance + stationDistance;
        //firstMarker = {lat:0,lng:0}
        firstMarker=secondMarker
        secondMarker={lat:0,lng:0}
      }
      
    })
    
    //this.route_long = routeDistance;
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

  calculateTotalDistanceToOfice(){
    let distance_office_km:number;
    distance_office_km =  this.directionsResults.routes[0].legs[0].distance?.value / 1000
    this.station_service.route_long = this.station_service.route_long + distance_office_km
  }

  calculateTotalDistanceRoute(results:any){
    let distance_office_km:number;
    distance_office_km =  results.routes[0].legs[0].distance?.value / 1000
    this.station_service.route_long = this.station_service.route_long + distance_office_km
  }

  open(event?: any) {
      
    //if (employe != undefined)
    //this.onEdit(employe);
    //else
    
  }

}
