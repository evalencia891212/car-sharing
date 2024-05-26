import { Component, Input, OnInit } from '@angular/core';
import { Route } from '../models/route';
import { VehicleService } from '../services/vehicle.service';
import {  } from '@angular/material/select';
import { Vehicle } from '../models/vehicles';
import { EmployeeService } from '../services/employee.service';
import { Model } from '../models/models';
import { ModelService } from '../services/model.service';
import { Employee } from '../models/employee';
import { StationService } from '../services/station.service';


@Component({
  selector: 'app-vehicle-employees',
  templateUrl: './vehicle-employees.component.html',
  styleUrls: ['./vehicle-employees.component.css'],
})
export class VehicleEmployeesComponent implements OnInit{
  
  @Input({ required: false }) route_id!: number;
  vehicle:any;
  selected_vehicle:string = "Seleccioone el Vehículo";
  selected_vehicle_id!:number;
  employee_number!:string
  employee_vehicle_list:any = [];
  selected_vehicle_model!: Model;

  constructor(public vehicle_service:VehicleService,public station_service:StationService,public employee_service:EmployeeService,public model_service:ModelService) {

  }

  ngOnInit(): void {
    debugger
    this.vehicle_service.getVehiclesByRoute(this.route_id);
  }

 

  select(vehicle:Vehicle){
    debugger
    this.selected_vehicle = vehicle.licence_plate;
    this.selected_vehicle_id = vehicle.vehicle_id;
    this.model_service.getModelById(vehicle.model_id).subscribe(response =>{
      this.selected_vehicle_model = response[0];
    })
    
    this.vehicle_service.getVehicleEmployee(this.selected_vehicle_id).subscribe(response => {
      this.employee_vehicle_list = response;
    })
    
  }

  addEmplpyee(){
    if(this.employee_vehicle_list.length == this.selected_vehicle_model.pasenger_capability){
      alert("Se ha alcanzado el maximo de pasajeros")
    }
    this.employee_service.getEmployeeVehicleByNumber(this.employee_number).subscribe(respose => {
      
      if(respose.length != 0) {
        let employee = respose[0];
        
        let station_id = this.station_service.selected_station.station_id;
        this.vehicle_service.setEmployeeInVehicle({ employee_id:employee.employee_id,
                                                    vehicle_id:this.selected_vehicle_id,
                                                    station_id:station_id}).subscribe(response => {

                   let vehicle_tour_employee = response[0]                                   

                  this.employee_vehicle_list.push({employee_number:vehicle_tour_employee.employee_number,
                                                  name: vehicle_tour_employee.name,
                                                  employee_id:vehicle_tour_employee.employee_id,
                                                   vehicle_id:vehicle_tour_employee.vehicle_id,                                                 
                                                   station_id:vehicle_tour_employee.station_id})                     
        })
       
        
      }
      else{
        alert("No se encontro el empleado")
      }
    });  
  }


  removeEmployee(employee_tour_vehicle:any){
    
   let payload = {employee_id:employee_tour_vehicle.employee_id,
                  vehicle_id:employee_tour_vehicle.vehicle_id,
                  station_id:employee_tour_vehicle.station_id}
    this.vehicle_service.removeVehicleEmployeeTour(payload).subscribe(response => {
      this.employee_vehicle_list = response;
    })

  }



}
