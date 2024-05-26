import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { Vehicle } from '../models/vehicles';
import { environment } from '@env/environment';
import { VehicleIssue } from '../models/vehicle-issue';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  public selected_vehicle:Vehicle = new Vehicle();
  public selected_model:string="";
  public selected_vehicle_plate:string="";
  public vehicles_list: Vehicle[] = [];
  public vehicles_list_route: Vehicle[] = [];
  public vehicles_list_page: Vehicle[] = [];
  pageSize = 10;
  public available_vehicles_list: Vehicle[] = [];
  public open_issue!:VehicleIssue;

  constructor(private httpClient: HttpClient) { }

  public getVehicles() {

    return this.httpClient.get('http://localhost:3000/vehicles').pipe(
      map(data => data as Vehicle[])
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
      
        this.vehicles_list = respose;
        if(respose.length > this.pageSize)
          this.vehicles_list_page = respose.slice(0,this.pageSize);
    });
  }

  public getVehiclesByRoute(route_id:number) {

    return this.httpClient.get('http://localhost:3000/vehicles/byRoute/' + route_id ).pipe(
      map(data => data as Vehicle[])
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
        debugger
        this.vehicles_list_route = respose;
       
    });
  }

  public getVehiclesAvailables() {
    this.available_vehicles_list = [];
    return this.httpClient.get('http://localhost:3000/vehicles/availables').pipe(
      map(data => data as Vehicle[])
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
      
       this.available_vehicles_list.push({
         vehicle_id: 0, licence_plate: '00000',
         serial_number: '0000000',
         vehicle_status:1,
         private_company:1,
         model_id: 0,
         route_id:0,
         active: ''
       })
       respose.forEach((item: Vehicle) => {
        this.available_vehicles_list.push(item);
       });
        
    });
  }

  public saveVehicle(payload: Vehicle) {
    
    payload.active = "1";
    return this.httpClient.post('http://localhost:3000/vehicles',payload).pipe(
      map(data => data as Vehicle)
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => { 
      
        this.vehicles_list.push(respose[0]);
    });
 }

 public updateVehicle(payload: Vehicle) {
  
  var vehicle_id = payload.vehicle_id; 
  return this.httpClient.put('http://localhost:3000/vehicles/' + vehicle_id,payload).pipe(
    map(data => data as Vehicle)
  ).pipe(
    map(message => message as any)
  ).subscribe(response => {
     console.log(response);
     this.vehicles_list.forEach(vehicle => {
      if(vehicle.vehicle_id == vehicle_id){
        vehicle.serial_number = response.serial_number;
        vehicle.licence_plate = response.licence_plate;
        vehicle.vehicle_status = response.vehicle_status;
        vehicle.private_company = response.private_company;
        vehicle.model_id = response.model_id;
        vehicle.route_id = response.route_id;
      }
     })
  })
}

public deleteVehicle(vehicle_id:number){
  return this.httpClient.delete('http://localhost:3000/vehicles/'+vehicle_id).subscribe(response => {
      console.log(response);
   })
}

 setVehicleFromList(employee:Employee){
  
    let vehicle = this.vehicles_list.find(vehicle => vehicle.vehicle_id == employee.vehicle_id);
    if(vehicle != undefined)
    this.selected_vehicle_plate = vehicle.licence_plate;
    else
      this.selected_vehicle_plate = "";
  }

  setEmployeeInVehicle(employeeVehicle:any):Observable<any>{
    return this.httpClient.post(environment.apiHost + '/vehicles/vehicleEmployee', employeeVehicle)
  }

  getVehicleEmployee(vehicle_id:number): Observable<any>{
    return this.httpClient.get(environment.apiHost + '/vehicles/vehicleEmployee/'+vehicle_id)
  }

  removeVehicleEmployeeTour(payload:any): Observable<any> {
    return this.httpClient.post(environment.apiHost + '/vehicles/removeVehicleEmployee',payload)
  }

  openIssue(vehicle_issue:VehicleIssue){
    this.httpClient.post(environment.apiHost + '/vehicles/issue/',vehicle_issue).pipe(
      map(data => data as VehicleIssue)
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
        
        this.open_issue = respose;
    });
  }
  
  getOpenIssue(vehicle_id:number):Observable<VehicleIssue[]> { 
   return this.httpClient.get(environment.apiHost + '/vehicles/issue/' + vehicle_id).pipe(
      map(data => data as VehicleIssue[])
    ).pipe(
      map(message => message as any)
    )
  }

  closeIssue(vehicle_id:number,vehicle_issue_id:number){
    this.httpClient.delete(environment.apiHost + '/vehicles/issue/' + vehicle_id + '/' + vehicle_issue_id).pipe(
      map(data => data as VehicleIssue)
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
        
        if(respose.length !=0){
          this.open_issue = respose;
        }else {
          this.open_issue = new VehicleIssue;
        }
        alert("La incidencia se cerro con exito")
    });
  }


}
