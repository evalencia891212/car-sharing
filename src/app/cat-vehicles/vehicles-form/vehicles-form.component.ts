import { Component, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { Model } from 'src/app/models/models';
import { Route } from 'src/app/models/route';
import { Vehicle } from 'src/app/models/vehicles';
import { ModelService } from 'src/app/services/model.service';
import { RouteService } from 'src/app/services/route.service';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-vehicles-form',
  templateUrl: './vehicles-form.component.html',
  styleUrls: ['./vehicles-form.component.css']
})
export class VehiclesFormComponent {

  @ViewChild('model_search') model_search!: ElementRef;
  @ViewChild('modelSearchList') modelSearchList!: ElementRef;

  @ViewChild('route_search') route_search!: ElementRef;
  @ViewChild('routeSearchList') routeSearchList!: ElementRef;

   public vehicles: Vehicle[] = [];
  public vehicle: Vehicle = new Vehicle();
  public model_select_list:Model[]=[];
  route_select_list:Route [] = [];
  
  public selected_route:string="";
  public selected_model:string="";

  vehicle_status:string="1";

  constructor(public vehicle_service:VehicleService,
             public models_service:ModelService,
             public routes_service: RouteService){
    
  }
  ngAfterViewInit() {
    this.setInputModelEvent();
    this.setInputRouteEvent();
  }

  ngOnInit(){
    //this.vehicle_service.getVehicles();
    
    this.models_service.getModels();
    this.selectModel(this.models_service.getModelByID(this.vehicle_service.selected_vehicle.model_id));
    
    this.routes_service.getRoutes();
    
    this.selectRoute(this.routes_service.getRouteByID(this.vehicle_service.selected_vehicle.route_id));
  }


  setInputModelEvent() {
    
    fromEvent(this.model_search.nativeElement, 'keydown').pipe(
      map((event: any) => event) // return event
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((event: any) => {
      let search = event.target.value // get value
      if (search.trim().length > 0) {
        this.setListStyle(this.modelSearchList);
        if (event.key == "Tab" || event.key == "Enter") {
          if (this.models_service.models_list.length > 0) {
            this.selectModel(this.models_service.models_list[0])
          } else {
            this.inputModel(search)
            //this.filterLocation(search);
          }

        } else if (event.key.length == 1 || event.key == "Backspace") {
          this.inputModel(search);
          //this.filterLocation(search);
          this.removeStyle(this.modelSearchList,this.model_search);
         
        }
      } else {
        this.removeStyle(this.modelSearchList,this.model_search);
      }
    })
  }

  setInputRouteEvent() {
    fromEvent(this.route_search.nativeElement, 'keydown').pipe(
      map((event: any) => event) // return event
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((event: any) => {
      let search = event.target.value // get value
      if (search.trim().length > 0) {
        this.setListStyle(this.routeSearchList);
        if (event.key == "Tab" || event.key == "Enter") {
          if (this.models_service.models_list.length > 0) {
            this.selectRoute(this.routes_service.route_list[0])
          } else {
            this.inputRoute(search)
            //this.filterLocation(search);
          }

        } else if (event.key.length == 1 || event.key == "Backspace") {
          this.inputRoute(search);
          //this.filterLocation(search);
          this.removeStyle(this.modelSearchList,this.model_search);
         
        }
      } else {
        this.removeStyle(this.modelSearchList,this.model_search);
      }
    })
  }

  private inputModel(search:any) {
    
    this.model_select_list = this.models_service.models_list.filter(item => item.model_name.toUpperCase().includes(search.toUpperCase()));
  }

  private inputRoute(search:any) {
    
    this.route_select_list = this.routes_service.route_list.filter(item => item.route_name.toUpperCase().includes(search.toUpperCase()));
  
  }


  selectModel(model: Model){
    this.vehicle_service.selected_vehicle.model_id = model.model_id;
    this.vehicle_service.selected_model = model.model_name;
    this.selected_model = model.model_name;
    if(this.modelSearchList)this.modelSearchList.nativeElement.hidden = true;
  }


  selectRoute(route:Route) {
    
    this.vehicle_service.selected_vehicle.route_id = route.route_id;
    this.selected_route = route.route_name;
    if(this.routeSearchList)this.routeSearchList.nativeElement.hidden = true;

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

  public isActive(){
    
    if(this.vehicle_service.selected_vehicle.vehicle_status == 1)
      return true;
    else
      return false
  }

  public onChangeType(event:any){
    
    this.vehicle_service.selected_vehicle.vehicle_status = event.srcElement.defaultValue;
    if(event.srcElement.defaultValue == 2)
    {
       this.selected_route = "";  
       this.vehicle_service.selected_vehicle.route_id = 0
    }
  }

  isPrivate() {
    if(this.vehicle_service.selected_vehicle.private_company == 1)
      return true;
    else
      return false
  }

  public onChangePrivate(event:any){
    
    this.vehicle_service.selected_vehicle.private_company = event.srcElement.defaultValue;
  }

}
