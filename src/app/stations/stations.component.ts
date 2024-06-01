import { AfterViewInit, Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { Employee } from '../models/employee';
import { Station } from '../models/station';
import { EmployeeService } from '../services/employee.service';
import { MapService } from '../services/map.service';
import { StationService } from '../services/station.service';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import { RouteService } from '../services/route.service';
import { event } from 'jquery';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { Route } from '../models/route';
import { OfficeService } from '../services/office.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})
export class StationsComponent implements OnInit, AfterViewInit  {

  private modalService = inject(NgbModal);
  closeResult = '';
  active = 1;
  selected_model:any;

  usr_lat!:number;
  usr_lng!:number;

  route_select_list:Route [] = [];

  @ViewChild('route_search') route_search!: ElementRef;
  @ViewChild('routeSelectList') routeSelectList!: ElementRef;

  constructor(
    private map: MapService,
    public employeService: EmployeeService,
    public station_service: StationService,
    public route_service:RouteService,
    public office_service: OfficeService) {}
  marker = {
    position: { lat: this.usr_lat, lng: this.usr_lng},

   }

 selected_route:string | undefined;
 markerPositions: google.maps.LatLngLiteral[] = [];
 userMarker:google.maps.LatLngLiteral[] = [];
 employeemarkerOptionsList: google.maps.MarkerOptions[] = [];
 

 public route_list:Route[]=[];

 
 vertices: google.maps.LatLngLiteral[] = [
  {lat: 23.240236893957295, lng: -106.42255317943847},
  {lat: 23.245666382372292, lng: -106.42126859910378},
  {lat: 23.249705568555097, lng: -106.420326573525},
  {lat: 23.249207234017806, lng: -106.42383775977319},
];

movies = [
  'Episode I - The Phantom Menace',
  'Episode II - Attack of the Clones',
  'Episode III - Revenge of the Sith',
  'Episode IV - A New Hope',
  'Episode V - The Empire Strikes Back',
  'Episode VI - Return of the Jedi',
  'Episode VII - The Force Awakens',
  'Episode VIII - The Last Jedi',
  'Episode IX – The Rise of Skywalker',
];

drop(event: CdkDragDrop<string[]>) {
  moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
}
 
  
  ngOnInit() {
    //this.map.buildMap();
    
    this.initValues();
    const myLatLng = { lat: 23.24459112928423, lng: -106.39800170731318};
    this.getEmployeeLatLng();
    this.station_service.getStations();
    this.office_service.getOffice();
    this.route_service.getRoutes();
    
    if(navigator.geolocation){
      this.getUserLocation();
    }
    this.setInputRoutesEvent();
    if(this.selected_route != ""){
      this.station_service.getStationsSequenceByRoute(this.route_service.selected_route.route_id);
    this.station_service.getStationsByRoute(this.route_service.selected_route.route_id);
    }
    
  }

  initValues(){
    this.station_service.markerStationPositionsByRute = [];
  }

  getUserLocation() {
    if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(position => {
         this.usr_lat = position.coords.latitude;
         this.usr_lng = position.coords.longitude;
         this.userMarker.push({ lat: this.usr_lat, lng: this.usr_lng});
       });
 }else {
    console.log("User not allow")

 }
}

  ngAfterViewInit() {
    this.setInputRoutesEvent();
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

  selectRoute(route:Route){
    
    this.route_service.selected_route = route;
    this.selected_route = route.route_name;
    this.station_service.getStationsSequenceByRoute(route.route_id);
    this.station_service.getStationsByRoute(route.route_id);
    //
    //  this.office_service.lastStationToOffice().then(result =>{
    //   
    //   this.directionsResults = result;
    //   this.calculateTotalDistanceToOfice();
      
    //  });
    this.route_select_list = [];
    this.routeSelectList.nativeElement.hidden = true;
    console.log(route);

  }

  private removeStyle(searchList: ElementRef, searchInput: ElementRef) {
    
    if (searchInput.nativeElement.value == "") {
      searchList.nativeElement.style.cssText = "position: absolute; z-index: 999; cursor: pointer; "
      searchList.nativeElement.hidden = true;
    }
  }

  

  display: any;
  center: google.maps.LatLngLiteral = {
      lat: 23.24459112928423,
      lng: -106.39800170731318
  };
  zoom = 13;

  /*------------------------------------------
    --------------------------------------------
    moveMap()
    --------------------------------------------
    --------------------------------------------*/
    moveMap(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  /*------------------------------------------
  --------------------------------------------
  move()
  --------------------------------------------
  --------------------------------------------*/
  move(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  async addMarker(event: google.maps.MapMouseEvent,station:Station ) {
    debugger
    if (event.latLng != null)  this.station_service.markerStationPositionsByRute.push(event.latLng.toJSON());
    if(station.station_id == undefined)
     this.station_service.saveStation(station,this.route_service.selected_route.route_id);
    else
     this.station_service.updateStation(station);
   // await this.routeAsociation(station);
    this.refreshStationForm();
  }

  async routeAsociation(station:Station){
    let selected_routes:Route[];
    station.routes = [];
    let checked = this.route_service.route_selected.filter(route=> route.selected==true);
    await checked.forEach(checked_route=>{
      station.routes.push(this.route_service.route_list.filter(route => route.route_id == checked_route.route_id)[0])
    })
  }

  refreshStationForm(){
    this.station_service.selected_station = new Station();
    debugger
  }

  getOption(index:number){
    return this.employeemarkerOptionsList[index];
  }

  getStationOption(index:number){
    return this.station_service.stationMarkerOptionsList[index];
  }

  getEmployeeLatLng(){
    
    this.employeService.getEmployeesLatLng().subscribe(respose => {
      
         respose.forEach(employee => {
          
           let lat_lng = this.getLatLngFromEmployeeRow(employee);
           //let latLng: google.maps.LatLngLiteral;
           //let markerPositions: google.maps.LatLgLiteral[] = [{lat: 30.021441570898386,lng: 28.12521446875}];
           this.markerPositions.push({lat:lat_lng[0],lng:lat_lng[1]});
          
           this.employeemarkerOptionsList.push({title:employee.name + ' ' + employee.last_name + '-' + employee.employee_number, icon:'http://maps.gstatic.com/mapfiles/ms2/micons/homegardenbusiness.png',draggable:false});
         })
    });
  }

  getLatLngFromEmployeeRow(employee:any){
     let lat_lng = employee.location.split(',',2);
     lat_lng[0]=parseFloat(lat_lng[0]);
     lat_lng[1]=parseFloat(lat_lng[1]);
     return lat_lng;
  }

  openEmployee(content: TemplateRef<any>,event?: any) {
    if(event.station_name)
      this.station_service.selected_station = event
    
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
        
      },
      (reason: any) => {
        this.refreshStationForm();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  //open(content: TemplateRef<any>,event: google.maps.MapMouseEvent) {
    open(content: TemplateRef<any>,event?: any) {
      
      //if (employe != undefined)
      //this.onEdit(employe);
      //else
      
      if(event.station_name)
        this.station_service.selected_station = event
      else{
        this.station_service.selected_station = new Station;
      }
        
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
        (result: any) => {
          this.closeResult = `Closed with: ${result}`;
          debugger
          if(event.latLng) this.station_service.selected_station.location = event.latLng.toString().replace('(','').replace(')','');
          debugger
          this.addMarker(event,this.station_service.selected_station);
         
            
        },
        (reason: any) => {
          this.refreshStationForm();
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
    }

  public updateStation(event:any,index:number){
    
    console.log(event);
  }

  onDelete(station: Station) {
    if(confirm('Are you sure you want to delete it?')) {
     this.station_service.deleteStation(station.station_id);
      //this.toastr.warning('Deleted Successfully', 'Product Removed');
    }
  }

  selectRoutes(route:Route){
    this.station_service.getStationsByRoute(route.route_id);
    console.log(route);
  }

  

  inputRoute(search:any){
    
    this.route_select_list = this.route_service.route_list.filter(item => item.route_name.toUpperCase().includes(search.toUpperCase()));
  }

  private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}


}
