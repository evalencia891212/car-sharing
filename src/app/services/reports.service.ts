import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  globalCO2emissions:any;
  tourInfo:any;

  constructor(private httpClient: HttpClient) { }


  public getGlobalEmissions():Observable<any> {
    this.globalCO2emissions =[];
    return this.httpClient.get(environment.apiHost + '/reports/globalCo2').pipe(
     map(data => data as any[])
   ).pipe(
     map(message => message as any)
   )
 }

 public getTourInfo(start:string,end:string):Observable<any>{
  return this.httpClient.get(environment.apiHost + `/reports/getToursInfo?startDate=${start}&endDate=${end}`).pipe(
    map(data => data as any[])
  ).pipe(
    map(message => message as any)
  )
 }


}
