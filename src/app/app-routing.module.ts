import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatEmployeesComponent } from './cat-employees/cat-employees.component';
import { EmployeListComponent } from './cat-employees/employe-list/employe-list.component';
import { CatModelsComponent } from './cat-models/cat-models.component';
import { ModelsListComponent } from './cat-models/models-list/models-list.component';
import { CatVehiclesComponent } from './cat-vehicles/cat-vehicles.component';
import { VehiclesListComponent } from './cat-vehicles/vehicles-list/vehicles-list.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { StationsComponent } from './stations/stations.component';


// const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'shop-order-list', component: ShopOrderListComponent },
//   { path: 'shop-order-selected', component: ShopOrderSelectedComponent },
//   { path: 'optional-parameters', component: OptionalParametersComponent },
//   { path: 'working-screen', component: WorkingScreenComponent },
//   { path: 'stop-machine', component: StopMachineComponent },
//   { path: 'add-comment', component: AddCommentComponent },
//   { path: 'add-defect', component: AddDefectComponent }
// ];

const routes: Routes = [
  //{ path: '', component: LoginComponent},
  { path: '', component: HomeComponent},
  {path : 'app-cat-employees', component:EmployeListComponent},
  {path : 'app-cat-vehicles', component:VehiclesListComponent},
  {path: 'app-cat-models', component: ModelsListComponent},
  {path:'app-stations', component: StationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
