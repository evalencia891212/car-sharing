import { HttpClient } from '@angular/common/http';
import { Injectable, numberAttribute } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { environment } from '@env/environment';
import { MapDirectionsService, MapGeocoder } from '@angular/google-maps';
import { OfficeService } from './office.service';
import { EmployeeInfo } from '../models/employee-info';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  public selected_employee : Employee = new Employee();
  public employee_list: Employee[] = [];
  public employee_list_page: Employee[] = [];
  public employee_list_latlng: Employee[] = [];
  public calculating_geocode:boolean = false;
  pageSize = 10;
  employee_info: EmployeeInfo;

   

  constructor(private httpClient: HttpClient,public geocoder: MapGeocoder, public office_service: OfficeService) {
    this.employee_info=new EmployeeInfo;
   }
  

    getGeocoder() {
     this.calculating_geocode = true; 
     this.geocoder.geocode({
      address: this.selected_employee.street_name + ' ' + this.selected_employee.outdoor_number + ' ' + this.selected_employee.neighborhood + ' ' + this.selected_employee.city
    }).subscribe( ({results}) => {
      
      this.selected_employee.location = results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng()
      this.selected_employee.place_id = results[0].place_id;
      this.office_service.getEmployeeDistanceToOffice(this.selected_employee).then(response =>{
        
        this.selected_employee.office_distance = response;
        this.calculating_geocode = false;
      });
      console.log(results);
    });
   
  }

 getLatLngFromPlaceRow(place:any){
  let lat_lng = place.location.split(',',2);
  lat_lng[0]=parseFloat(lat_lng[0]);
  lat_lng[1]=parseFloat(lat_lng[1]);
  return lat_lng;
}

  public getEmployees() {
     this.httpClient.get(environment.apiHost + '/employees').pipe(
      map(data => data as Employee[])
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
      
        this.employee_list = respose;
        if(respose.length > this.pageSize)
          this.employee_list_page = respose.slice(0,this.pageSize);
    });
  }


  public saveEmployee(payload: Employee) {
    
     return this.httpClient.post(environment.apiHost + '/employees',payload).pipe(
      map(data => data as Employee)
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
        this.employee_list.push(respose[0]);
    });
  }

  public updateEmployee(payload: Employee) {
    
    let employee_id = payload.employee_id;
    return this.httpClient.put(environment.apiHost  + '/employees/' + employee_id,payload).pipe(
      map(data => data as Employee)
    ).pipe(
      map(message => message as any)
    ).subscribe(response => {
      console.log(response);
      this.employee_list.forEach(employee => {
       if(employee.employee_id == employee_id ){
        employee.employee_number=response.employee_number;
        employee.name= response.name;
        employee.last_name = response.last_name;
        employee.mother_lastname=response.mother_lastname;
        employee.street_name=response.street_name;
        employee.interior_number=response.interior_number;
        employee.outdoor_number=response.outdoor_number;
        employee.vehicle_id=response.vehicle_id;
        employee.vehicle_status = response.vehicle_status;
        employee.neighborhood=response.neighborhood;
        employee.personal_mail = response.personal_mail;
        employee.company_mail=response.company_mail;
        employee.location=response.location;
        employee.place_id=response.place_id;
        employee.office_distance=response.office_distance;
       }
      })
    });
  }

  public deleteEmployee(employee_id:number){
    return this.httpClient.delete(environment.apiHost + '/employees/'+employee_id).pipe(
      map(data => data as Employee[])
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
        this.employee_list = respose;
    });
  }

  public getEmployeesLatLng():Observable<Employee[]> {
   return this.httpClient.get(environment.apiHost + '/employees/employeesLatLng').pipe(
     map(data => data as Employee[])
   ).pipe(
     map(message => message as any)
   );
 }

  public getEmployeInfoVehicleByUser(user_id:number){
    
    return this.httpClient.get(environment.apiHost + '/employees/employeeInfo/' + user_id).pipe(
      map(data => data as EmployeeInfo)
    ).pipe(
      map(message => message as any)
    ).subscribe(response => {
      this.employee_info = response[0];
    });
  }


  getEmployeeVehicleByNumber(employee_number:string) :Observable<Employee[]> {
    return this.httpClient.get(environment.apiHost + '/employees/empoyeeVehicleByNumber/' + employee_number).pipe(
      map(data => data as Employee[])
    ).pipe(
      map(message => message as any)
    );
  }

  findDetailToBoarding(employee_id:number){
    return this.httpClient.get(environment.apiHost + '/tours/tourBoarding/' + employee_id).pipe(
      map(data => data as any)
    ).pipe(
      map(message => message as any)
    );
  }
 
  public getPassengerInfoVehicleByUser(user_id:number){
    
    return this.httpClient.get( environment.apiHost + '/employees/getPassengerIngo/' + user_id).pipe(
      map(data => data as EmployeeInfo)
    ).pipe(
      map(message => message as any)
    ).subscribe(response => {
      this.employee_info = response[0];
    });
  }


}
