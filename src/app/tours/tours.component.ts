import { formatDate } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Route } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tour } from '../models/tour';
import { TourDetail } from '../models/tour-detail';
import { EmployeeService } from '../services/employee.service';
import { RouteService } from '../services/route.service';
import { StationService } from '../services/station.service';
import { TourService } from '../services/tour.service';
import { OfficeService } from '../services/office.service';
import { Station } from '../models/station';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css']
})
export class ToursComponent implements OnInit,OnDestroy {

  private modalService = inject(NgbModal);
  closeResult = '';

  active = 1;




  _odometer!:number;
  selected_route!:string
  employee_number!: string;
  
  //Map Variables
  markerPositions: google.maps.LatLngLiteral[] = [];
  employeemarkerOptionsList: google.maps.MarkerOptions[] = [];
  userMarker:google.maps.LatLngLiteral[] = [];
  display: any;
  center: google.maps.LatLngLiteral = {
      lat: 23.24459112928423,
      lng: -106.39800170731318
  };
  zoom = 13;
  tour_detail_to_boarding: boolean = false;
  external_tour_available:boolean = false;
  tour_detail!:TourDetail;
  interval:any

  constructor(public routes_service: RouteService,
    public employee_service:EmployeeService,
    public tour_service:TourService,
    public station_service: StationService,
    public office_service: OfficeService,
    public user_service: UserService){
    if(navigator.geolocation){

    }
  }
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
  ngOnInit(): void {
    
    if(this.user_service.userType==3){
    this.interval = setInterval(() => {
        this.employee_service.findDetailToBoarding(this.employee_service.employee_info.employee_id).subscribe(response =>{
          if(response.detail.length > 0){
            this.tour_detail = response.detail[0];
            if(response.detail.veicle_route_id == 0){
              this.external_tour_available = false
            }else {
              if(this.tour_detail.confirmation_date_time != ''){
                this.tour_detail_to_boarding=false;
                this.external_tour_available = false
              }else {
                this.tour_detail_to_boarding=true;
                this.external_tour_available = false;
              } 
            }
          }else{
            this.external_tour_available = true;
          }
        })
      },3000)
    
      
      }else if(this.user_service.userType==2) {
        this.station_service.getStationsByRoute(this.employee_service.employee_info.route_id);
        this.tour_service.getOpenTour(this.employee_service.employee_info.vehicle_route_id);
      }
   
   
  }

  isReadyToConfirm(){
    return this.tour_detail_to_boarding; 
  }

  selectRoute(route:Route) {
    
    // this.vehicle_service.selected_vehicle.route_id = route.route_id;
    // this.selected_route = route.route_name;
    // this.routeSearchList.nativeElement.hidden = true;

  }

  startTour(content: TemplateRef<any>) {
    
    this.tour_service.current_tour = new Tour
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
        
        let today= new Date();
        let todaysDataTime = formatDate(today, 'dd-MM-yyyy hh:mm:ss a', 'en-US');
				this.tour_service.current_tour.start_date_time = todaysDataTime;
        this.tour_service.current_tour.start_odometer = this._odometer;
        this.tour_service.current_tour.veicle_route_id = this.employee_service.employee_info.vehicle_route_id
        this.tour_service.startTour(this.tour_service.current_tour);
			},
			(reason: any) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
  }

  getDate(date:any){

    if(date)
     return formatDate(date,'dd-MM-yyyy hh:mm:ss a', 'en-US',)
    else
     return "";
  }

  boarding() {
    if(confirm('Desea confirmar el abordaje?')) {
      this.tour_service.confirmTour(this.tour_detail.tour_detail_id).subscribe(response => {
          if(response){
            this.tour_detail_to_boarding=false;
            alert("Abordaje confirmado con éxito")
          }
      });
      //this.toastr.warning('Deleted Successfully', 'Product Removed');
    }
  }

  boardingExternal(){
    if(confirm('Desea abordar un vehículo externo?')) {
      this.tour_service.confirmExternalTour(this.employee_service.employee_info.employee_id).subscribe(response => {
          if(response){
            this.external_tour_available=false;
            alert("Abordaje confirmado con éxito")
          }
      });
      //this.toastr.warning('Deleted Successfully', 'Product Removed');
    }
  }

  isExternalAvailable(){
    return this.external_tour_available;
  }

  AddEmployee(content: TemplateRef<any>){
    this.employee_number = "";
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
        debugger
        
        this.tour_service.addEmployee(this.employee_number,this.tour_service.current_tour.tour_id,this.employee_service.employee_info.vehicle_id);
			},
			(reason: any) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
  }

  endTour(content: TemplateRef<any>) {
    this._odometer = 0;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
        
        let today= new Date();
        let todaysDataTime = formatDate(today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
        this.tour_service.current_tour.end_odometer = this._odometer;
        this.tour_service.current_tour.tour_lenght = this.tour_service.current_tour.end_odometer - this.tour_service.current_tour.start_odometer;
        this.tour_service.endTour(this.tour_service.current_tour);
			},
			(reason: any) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
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

  getEmployeeNumber(employee_id:number) {
    let employee_number = this.tour_service.employee_tour_list.find(employee => employee.employee_id == employee_id)?.employee_number;
    return employee_number;
  }

  getEmployeeName(employee_id:number) {
    let name = this.tour_service.employee_tour_list.find(employee => employee.employee_id == employee_id)?.name;
    let last_name = this.tour_service.employee_tour_list.find(employee => employee.employee_id == employee_id)?.last_name;
    return name + " " + last_name;
  }

  getEmployeeLatLng(){
    
    this.employee_service.getEmployeesLatLng().subscribe(respose => {
      
         respose.forEach(employee => {
          
           let lat_lng = this.getLatLngFromEmployeeRow(employee);
           //let latLng: google.maps.LatLngLiteral;
           //let markerPositions: google.maps.LatLgLiteral[] = [{lat: 30.021441570898386,lng: 28.12521446875}];
           this.markerPositions.push({lat:lat_lng[0],lng:lat_lng[1]});
          
           this.employeemarkerOptionsList.push({title:employee.name + ' ' + employee.last_name, icon:'http://maps.gstatic.com/mapfiles/ms2/micons/homegardenbusiness.png',draggable:false});
         })
    });
  }

  getLatLngFromEmployeeRow(employee:any){
    let lat_lng = employee.location.split(',',2);
    lat_lng[0]=parseFloat(lat_lng[0]);
    lat_lng[1]=parseFloat(lat_lng[1]);
    return lat_lng;
 }



  refreshStationForm(){
    this.station_service.selected_station = new Station();
  }

  getOption(index:number){
    return this.employeemarkerOptionsList[index];
  }

  getStationOption(index:number){
    return this.station_service.stationMarkerOptionsList[index];
  }
  removeEmployee(tour_detail:TourDetail) {
    
  }

  
}
