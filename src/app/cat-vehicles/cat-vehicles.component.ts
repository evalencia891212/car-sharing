import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { Model } from '../models/models';
import { Vehicle } from '../models/vehicles';
import { ModelService } from '../services/model.service';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-cat-vehicles',
  templateUrl: './cat-vehicles.component.html',
  styleUrls: ['./cat-vehicles.component.css']
})
export class CatVehiclesComponent implements OnInit, AfterViewInit {

  @ViewChild('model_search') model_search!: ElementRef;
  @ViewChild('modelSearchList') modelSearchList!: ElementRef;

  

  public vehicles: Vehicle[] = [];
  public vehicle: Vehicle = new Vehicle();
  public model_select_list:Model[]=[];
  public selected_model:string="";

  constructor(public vehicle_service:VehicleService,
    public models_service:ModelService){
    
  }
  ngAfterViewInit() {
    this.setInputLocationEvent();
  }
  ngOnInit(){
    this.vehicle_service.getVehicles();
    this.models_service.getModels();
    
    this.resetForm();
  }

  

  setInputLocationEvent() {
    debugger;
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
    debugger
    this.model_select_list = this.models_service.models_list.filter(item => item.model_name.toUpperCase().includes(search.toUpperCase()));
  }

  onSubmit(vehicleForm: NgForm)
  { 
    debugger
    if(vehicleForm.value.vehicle_id == null)
      this.vehicle_service.saveVehicle(vehicleForm.value);
    else{

    }
  }

  selectModel(model: Model){
    debugger;
    this.vehicle_service.selected_vehicle.model_id = model.model_id;
    this.selected_model = model.model_name;
    this.modelSearchList.nativeElement.hidden = true;
  }

  resetForm(vehicleForm?: NgForm)
  {
    if(vehicleForm != null)
    vehicleForm.reset();
    this.vehicle_service.selected_vehicle = new Vehicle();  
  }

}
