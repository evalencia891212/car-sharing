import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Model } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  
  public selected_model:Model = new Model();
  public models_list: Model[] =[];
  public models_list_page: Model[] =[];
  pageSize = 10;
  constructor(private httpClient: HttpClient) { }
  
  public getModels() {
    this.httpClient.get('http://localhost:3000/models').pipe(
     map(data => data as Model[])
   ).pipe(
     map(message => message as any)
   ).subscribe(respose => {
       this.models_list = respose;
       if(respose.length > this.pageSize)
        this.models_list_page = respose.slice(0,this.pageSize);

   });
 }

 public getModelById(model_id:number):Observable<Model[]> {
  return this.httpClient.get('http://localhost:3000/models/modelById/'+model_id).pipe(
   map(data => data as Model[])
 ).pipe(
   map(message => message as any)
 )
}



 public saveModel(payload: Model) {
  payload.active = 1;
  return this.httpClient.post('http://localhost:3000/models',payload).pipe(
    map(data => data as Model)
  ).pipe(
    map(message => message as any)
  ).subscribe(respose => {
      this.models_list.push(respose[0]);
  });
  }

  public updateModel(payload: Model) {
    let model_id = payload.model_id;
    return this.httpClient.put('http://localhost:3000/models/' + model_id,payload).pipe(
      map(data => data as Model)
    ).pipe(
      map(message => message as any)
    ).subscribe(response => {
      console.log(response);
      this.models_list.forEach(model => {
       if(model.model_id == model_id ){
         model.model_name = response.model_name;
         model.model_year = response.model_year;
         model.pasenger_capability = response.pasenger_capability;
         model.performance = response.performance;
       }
      })
    });

    

 }


 public deleteModel(model_id:number){
  return this.httpClient.delete('http://localhost:3000/models/'+model_id).pipe(
    map(data => data as Model[])
  ).pipe(
    map(message => message as any)
  ).subscribe(respose => {
      this.models_list = respose;
  });
}

getModelByID(model_id:number): any {
  let model = this.models_list.find(model => model.model_id == model_id);
  if(model != undefined)
   return model;
  else
   return;
}

}
