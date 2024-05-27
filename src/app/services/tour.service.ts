import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tour } from '../models/tour';
import { environment } from '@env/environment';
import { Observable, map } from 'rxjs';
import { Employee } from '../models/employee';
import { TourDetail } from '../models/tour-detail';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  current_tour!: Tour
  tour_list:Tour[]=[];
  employee_tour_list: Employee[] = [];
  tour_detail:TourDetail[] = [];


  constructor(private httpClient: HttpClient) { }

  startTour(payload:Tour){
    
    return this.httpClient.post(environment.apiHost + '/tours',payload).pipe(
      map(data => data as Tour)
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
        this.current_tour = respose[0];
        this.tour_list.push(respose[0]);
    });
  }

  endTour(payload:Tour){
    
    return this.httpClient.put(environment.apiHost + '/tours',payload).pipe(
      map(data => data as Tour)
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
       this.current_tour = respose[0];
        this.tour_list.forEach(tour =>{
          tour.end_date_time = respose[0].end_date_time;
          tour.tour_lenght = respose[0].tour_lenght;
        })
    });
  }

  addEmployee(employee_number: string,tour_id:number,vehicle_id:number){
    this.httpClient.get(environment.apiHost + '/employees/empoyeeByNumber/' + employee_number + '/' + vehicle_id).pipe(
      map(data => data as Employee)
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
      if(respose.message = "ok"){
        let employee: Employee = respose.data[0];
        this.employee_tour_list.push(employee)
        let tour_detail = new TourDetail;
        tour_detail.employee_id = employee.employee_id;
        tour_detail.tour_id = tour_id;
        this.httpClient.post(environment.apiHost + '/tourDetail',tour_detail).pipe(
          map(data => data as TourDetail)
        ).pipe(
          map(message => message as any)
        ).subscribe(respose => {
           this.tour_detail.push(respose[0]);
        }); 
      }
      
    });     

  }

  removeEmployee(tour_detail:TourDetail){
    this.httpClient.post(environment.apiHost + '/tours/tour_detail/',tour_detail).pipe(
      map(data => data as TourDetail)
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
       this.tour_detail = respose;
    }); 
  }
  
  getOpenTour(vehicle_route_id:number){
    this.current_tour = new Tour;
    this.tour_detail=[];
    this.httpClient.get(environment.apiHost + '/tours/openTour/' + vehicle_route_id).pipe(
      map(data => data as [Tour,TourDetail[]])
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {

        this.current_tour = respose.tour;
        
        respose.detail.forEach( (detail: any) => {
          let employee = new Employee;
          employee.employee_number = detail.employee_number;
          employee.employee_id = detail.employee_id;
          employee.name = detail.name;
          employee.last_name = detail.last_name;
          this.employee_tour_list.push(employee)
          let tour_detail = new TourDetail;
          tour_detail.tour_detail_id = detail.tour_detail_id;
          tour_detail.employee_id=detail.employee_id;
          tour_detail.tour_id=detail.tour_id;
          this.tour_detail.push(tour_detail);
          
        })
       

        this.tour_list.push(respose.tour);
    });
  }


  confirmTour(tour_detail_id:number):Observable<any> {
    return this.httpClient.put(environment.apiHost + '/tours/confirmTour/'+tour_detail_id,null)
  }

  confirmExternalTour(employee_id:number):Observable<any> {
    return this.httpClient.post(environment.apiHost + '/tours/externalTours/'+employee_id,null)
  }

  
  
}
