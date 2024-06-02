import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isAuthenticated!:boolean;
  userType!:number;
  current_usser!: User;
  selected_employee_usser!: User;
  constructor(private httpClient: HttpClient) { }

  public getUser(user_name:string,password:string):Observable<any>{
    return this.httpClient.get(environment.apiHost +  '/user/'+user_name+'/'+password)
  }

  public createUser(payload :User, employee_id:number){
     this.httpClient.post(environment.apiHost +  '/user/'+employee_id,payload).pipe(
      map(data => data as User)
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
       console.log("Succes:" + respose);
    });
  }

  public updatteUser(payload :User){
    debugger
    this.httpClient.put(environment.apiHost +  '/user/',payload).pipe(
     map(data => data as any)
   ).pipe(
     map(message => message as any)
   ).subscribe(respose => {
      if(respose.message == "ok"){
        alert("El usuario se actualizo con exito!")
      }
      console.log("Succes:" + respose);
   });
 }

  public getUserByEmployeeId(employee_id:number):Observable<any>{
    return this.httpClient.get(environment.apiHost +  '/UserByEmployeeId/'+employee_id).pipe(
      map(data => data as any)
    ).pipe(
      map(message => message as any)
    )
  }





}
