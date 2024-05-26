import { AfterContentInit, AfterViewInit, Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { Model } from '../models/models';
import { Route } from '../models/route';
import { Vehicle } from '../models/vehicles';
import { ModelService } from '../services/model.service';
import { RouteService } from '../services/route.service';
import { VehicleService } from '../services/vehicle.service';
import { VehicleIssue } from '../models/vehicle-issue';

@Component({
  selector: 'app-cat-vehicles',
  templateUrl: './cat-vehicles.component.html',
  styleUrls: ['./cat-vehicles.component.css']
})
export class CatVehiclesComponent implements OnInit, AfterViewInit {

  @ViewChild('model_search') model_search!: ElementRef;
  @ViewChild('modelSearchList') modelSearchList!: ElementRef;

  @ViewChild('route_search') route_search!: ElementRef;
  @ViewChild('routeSearchList') routeSearchList!: ElementRef;

  
  

  public vehicles: Vehicle[] = [];
  public vehicle: Vehicle = new Vehicle();
  public model_select_list:Model[]=[];
  route_select_list:Route [] = [];
  open_issue!: VehicleIssue;

  private modalService = inject(NgbModal);
  closeResult = '';
  
  public selected_route:string="";

  vehicle_status:string="1";

  statusCheck=false;

  constructor(public vehicle_service:VehicleService,
             public models_service:ModelService,
             public routes_service: RouteService){
    
  }
  ngAfterViewInit() {
   // this.setInputModelEvent();
   // this.setInputRouteEvent();
  }

  ngOnInit(){
    this.vehicle_service.getVehicles();
    this.models_service.getModels();
    this.routes_service.getRoutes();
    
    
  }

  

  // setInputModelEvent() {
  //   fromEvent(this.model_search.nativeElement, 'keydown').pipe(
  //     map((event: any) => event) // return event
  //     , debounceTime(500)
  //     , distinctUntilChanged()
  //   ).subscribe((event: any) => {
  //     let search = event.target.value // get value
  //     if (search.trim().length > 0) {
  //       this.setListStyle(this.modelSearchList);
  //       if (event.key == "Tab" || event.key == "Enter") {
  //         if (this.models_service.models_list.length > 0) {
  //           this.selectModel(this.models_service.models_list[0])
  //         } else {
  //           this.inputModel(search)
  //           //this.filterLocation(search);
  //         }

  //       } else if (event.key.length == 1 || event.key == "Backspace") {
  //         this.inputModel(search);
  //         //this.filterLocation(search);
  //         this.removeStyle(this.modelSearchList,this.model_search);
         
  //       }
  //     } else {
  //       this.removeStyle(this.modelSearchList,this.model_search);
  //     }
  //   })
  // }

  // setInputRouteEvent() {
  //   fromEvent(this.route_search.nativeElement, 'keydown').pipe(
  //     map((event: any) => event) // return event
  //     , debounceTime(500)
  //     , distinctUntilChanged()
  //   ).subscribe((event: any) => {
  //     let search = event.target.value // get value
  //     if (search.trim().length > 0) {
  //       this.setListStyle(this.routeSearchList);
  //       if (event.key == "Tab" || event.key == "Enter") {
  //         if (this.models_service.models_list.length > 0) {
  //           this.selectRoute(this.routes_service.route_list[0])
  //         } else {
  //           this.inputRoute(search)
  //           //this.filterLocation(search);
  //         }

  //       } else if (event.key.length == 1 || event.key == "Backspace") {
  //         this.inputRoute(search);
  //         //this.filterLocation(search);
  //         this.removeStyle(this.modelSearchList,this.model_search);
         
  //       }
  //     } else {
  //       this.removeStyle(this.modelSearchList,this.model_search);
  //     }
  //   })
  // }

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

  private inputModel(search:any) {
    
    this.model_select_list = this.models_service.models_list.filter(item => item.model_name.toUpperCase().includes(search.toUpperCase()));
  }

  private inputRoute(search:any) {
    
    this.route_select_list = this.routes_service.route_list.filter(item => item.route_name.toUpperCase().includes(search.toUpperCase()));
  }


  onSubmit(vehicleForm: NgForm)
  { 
    if(vehicleForm.value.vehicle_id == null)
      this.vehicle_service.saveVehicle(vehicleForm.value);
    else{

    }
  }

  selectModel(model: Model){
    this.vehicle_service.selected_vehicle.model_id = model.model_id;
    this.vehicle_service.selected_model = model.model_name;
    this.modelSearchList.nativeElement.hidden = true;
  }


  selectRoute(route:Route) {
    
    this.vehicle_service.selected_vehicle.route_id = route.route_id;
    this.selected_route = route.route_name;
    this.routeSearchList.nativeElement.hidden = true;

  }
  resetForm(vehicleForm?: NgForm)
  {
    if(vehicleForm != null)
    vehicleForm.reset();
    this.vehicle_service.selected_vehicle = new Vehicle();  
  }
  onEdit(vehicle: Vehicle) {
    this.vehicle_service.selected_vehicle = Object.assign({}, vehicle);
  }


  open(content: TemplateRef<any>, vehicle?:Vehicle) {
    if (vehicle != undefined)
    this.onEdit(vehicle);
    else
    this.vehicle_service.selected_vehicle = new Vehicle;

		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
				this.closeResult = `Closed with: ${result}`;
        vehicle = this.vehicle_service.selected_vehicle;
        if(vehicle.vehicle_id== null)
        this.vehicle_service.saveVehicle(vehicle);
        else
        this.vehicle_service.updateVehicle(vehicle);
			},
			(reason: any) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}


  openIssue(content: TemplateRef<any>, vehicle:Vehicle) {

    this.vehicle_service.getOpenIssue(vehicle.vehicle_id).subscribe(respose => {
      
      if(respose.length > 0){
        this.vehicle_service.open_issue = respose[0];
      }else {
        this.vehicle_service.open_issue = new VehicleIssue;
      }
    });
   
    
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
        
				this.closeResult = `Closed with: ${result}`;
        if(this.vehicle_service.open_issue.vehicle_issue_id == 0)
          {
          this.vehicle_service.open_issue.vehicle_id=vehicle.vehicle_id;
          this.vehicle_service.openIssue(this.vehicle_service.open_issue)
          }
        else if(this.statusCheck==true)
          this.vehicle_service.closeIssue(vehicle.vehicle_id,this.vehicle_service.open_issue.vehicle_issue_id)
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

  onDelete(vehicle: Vehicle) {
    if(confirm('Are you sure you want to delete it?')) {
     this.vehicle_service.deleteVehicle(vehicle.vehicle_id);
      //this.toastr.warning('Deleted Successfully', 'Product Removed');
    }
  }



}
