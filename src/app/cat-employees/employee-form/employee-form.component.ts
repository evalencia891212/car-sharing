import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { Employee } from 'src/app/models/employee';
import { Vehicle } from 'src/app/models/vehicles';
import { EmployeeService } from 'src/app/services/employee.service';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit, AfterViewInit {

  @ViewChild('vehicle_search') vehicle_search!: ElementRef;
  @ViewChild('vehicleSearchList') vehicleSearchList!: ElementRef;

  selected_vehicle:string ='';
  available_vehicle_list : Vehicle[] = [];

  constructor(
    public employe_service:EmployeeService,
    public vehicle_service:VehicleService
   
  ){}

  ngOnInit() {

    this.employe_service.getEmployees();
    this.vehicle_service.getVehiclesAvailables();
    //this.vehicle_service.setVehicleFromList()
    //this.resetForm();

  }

  ngAfterViewInit() {
    this.setInputVehicleEvent();
  }


  setInputVehicleEvent() {
    fromEvent(this.vehicle_search.nativeElement, 'keydown').pipe(
      map((event: any) => event) // return event
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((event: any) => {
      let search = event.target.value // get value
      if (search.trim().length > 0) {
        this.setListStyle(this.vehicleSearchList);
        if (event.key == "Tab" || event.key == "Enter") {
          if (this.vehicle_service.available_vehicles_list.length > 0) {
            this.selectVehicle(this.vehicle_service.available_vehicles_list[0])
          } else {
            this.inputVehicle(search)
            //this.filterLocation(search);
          }

        } else if (event.key.length == 1 || event.key == "Backspace") {
          this.inputVehicle(search);
          //this.filterLocation(search);
          this.removeStyle(this.vehicleSearchList,this.vehicle_search);
         
        }
      } else {
        this.removeStyle(this.vehicleSearchList,this.vehicle_search);
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


  selectVehicle(vehicle:Vehicle) {
    
    this.vehicle_service.selected_vehicle_plate = vehicle.licence_plate;
    this.employe_service.selected_employee.vehicle_id = vehicle.vehicle_id;
    this.vehicleSearchList.nativeElement.hidden = true;
  }

  private inputVehicle(search:any) {
    this.available_vehicle_list = this.vehicle_service.available_vehicles_list.filter(item => item.licence_plate.toUpperCase().includes(search.toUpperCase()));
    
  }

  validateVehicle(){
    
    if(this.selected_vehicle.trim()=="")
    this.employe_service.selected_employee.vehicle_id = 0;
  }

   resetForm(employeeForm?: NgForm)
  {
    if(employeeForm != null)
    employeeForm.reset();
    this.employe_service.selected_employee = new Employee();  
  }

 geocoding(){
   this.employe_service.getGeocoder()
   
  }


}
