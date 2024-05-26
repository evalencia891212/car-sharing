import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '../models/route';
import { Observable, map } from 'rxjs';
import { RouteSelect } from '../models/route-select';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  public selected_route:Route = new Route();
  public route_list:Route[] = [];
  public route_selected: RouteSelect[] = [] ;

  constructor(private httpClient: HttpClient) { }

  public getRoutes() {
    
    this.httpClient.get('http://localhost:3000/routes').pipe(
     map(data => data as Route[])
   ).pipe(
     map(message => message as any)
   ).subscribe(respose => {
     this.route_selected=[];
     this.route_list = respose;
     this.route_list.forEach(route => {
       this.route_selected.push({route_id:route.route_id,route_name:route.route_name, selected:false}) 
      })
    
   });
 }

 public _getRoutes():Observable<Route[]> {
  
  return this.httpClient.get('http://localhost:3000/routes').pipe(
   map(data => data as Route[])
 ).pipe(
   map(message => message as any)
 )
}

 public saveRoutes(payload: Route) {
  
  payload.active = 1;
  return this.httpClient.post('http://localhost:3000/routes',payload).pipe(
    map(data => data as Route)
  ).pipe(
    map(message => message as any)
  ).subscribe(respose => {
    
      this.route_list.push(respose[0]);
  });
  }

  public updateRoute(payload: Route) {
    let route_id = payload.route_id;
    return this.httpClient.put('http://localhost:3000/routes/' + route_id,payload).pipe(
      map(data => data as Route)
    ).pipe(
      map(message => message as any)
    ).subscribe(response => {
      
      console.log(response);
      this.route_list.forEach(route => {
       if(route.route_id == route_id ){
        route.route_name = response.route_name;
       }
      })
    });
  }

  public deleteRoute(route_id:number){
    return this.httpClient.delete('http://localhost:3000/routes/'+route_id).pipe(
      map(data => data as Route[])
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
      
        this.route_list = respose;
    });
  }

  getRouteByID(route_id:number): any {
    let route = this.route_list.find(route => route.route_id == route_id);
    if(route != undefined)
     return route;
    else
     return;
  }

   

}
