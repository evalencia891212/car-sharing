import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  selected_employee : Employee = new Employee();
  public employee_list: Employee[] = [];


  constructor(private httpClient: HttpClient) { }


  public getEmployees() {
     this.httpClient.get('http://localhost:3000/employees').pipe(
      map(data => data as Employee[])
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
      debugger;
        this.employee_list = respose;
    });
  }


  public saveEmployee(payload: Employee) {
     return this.httpClient.post('http://localhost:3000/employees',payload).pipe(
      map(data => data as Employee)
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
      debugger;
        this.employee_list.push(respose[0]);
    });
  }

  public updateEmployee(payload: Employee) {
    let employee_id = payload.employee_id;
    return this.httpClient.put('http://localhost:3000/employees/' + employee_id,payload).pipe(
      map(data => data as Employee)
    ).pipe(
      map(message => message as any)
    ).subscribe(response => {
      debugger;
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
        employee.neighborhood=response.neighborhood;
        employee.personal_mail = response.personal_mail;
        employee.company_mail=response.company_mail;
        employee.location=response.location;

       }
      })
    });
  }

  public deleteEmployee(employee_id:number){
    return this.httpClient.delete('http://localhost:3000/employees/'+employee_id).pipe(
      map(data => data as Employee[])
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
      debugger;
        this.employee_list = respose;
    });
  }

}
