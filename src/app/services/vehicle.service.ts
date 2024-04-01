import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Vehicle } from '../models/vehicles';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  public selected_vehicle:Vehicle = new Vehicle();
  public vehicles_list: Vehicle[] = [];

  constructor(private httpClient: HttpClient) { }

  public getVehicles() {

    return this.httpClient.get('http://localhost:3000/vehicles').pipe(
      map(data => data as Vehicle[])
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
      debugger;
        this.vehicles_list = respose;
    });
  }

  public saveVehicle(payload: Vehicle) {
    payload.active = "1";
    return this.httpClient.post('http://localhost:3000/vehicles',payload).subscribe(response => {
       console.log(response);
    })
 }

 public updateVehicle(payload: Vehicle) {
  return this.httpClient.put('http://localhost:3000/vehicles',payload).subscribe(response => {
     console.log(response);
  })
}

public deleteVehicle(vehicle_id:number){
  return this.httpClient.delete('http://localhost:3000/vehicles/'+vehicle_id).subscribe(response => {
      console.log(response);
   })
}




}
