import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatEmployeesComponent } from './cat-employees/cat-employees.component';
import { EmployeListComponent } from './cat-employees/employe-list/employe-list.component';
import { CatModelsComponent } from './cat-models/cat-models.component';
import { ModelsListComponent } from './cat-models/models-list/models-list.component';
import { CatRoutesComponent } from './cat-routes/cat-routes.component';
import { RoutesListComponent } from './cat-routes/routes-list/routes-list.component';
import { CatVehiclesComponent } from './cat-vehicles/cat-vehicles.component';
import { VehiclesListComponent } from './cat-vehicles/vehicles-list/vehicles-list.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { StationsComponent } from './stations/stations.component';
import { AuthGuard } from './shared/auth.guard';
import {AdminAuthGuard} from './shared/admin-auth.guard'
import { ToursComponent } from './tours/tours.component';
import { GlobalEmissionsComponent } from './reports/global-emissions/global-emissions.component';
import { RealEmissionsComponent } from './reports/real-emissions/real-emissions.component';
import { RealFuelComponent } from './reports/real-fuel/real-fuel.component';


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
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path : 'app-cat-employees', component:CatEmployeesComponent, canActivate:[AdminAuthGuard]},
  {path : 'app-cat-vehicles', component:CatVehiclesComponent, canActivate:[AdminAuthGuard]},
  {path: 'app-cat-models', component: CatModelsComponent, canActivate:[AdminAuthGuard]},
  {path:'app-stations', component: StationsComponent, canActivate:[AdminAuthGuard]},
  {path:'app-routes-list', component:CatRoutesComponent, canActivate:[AdminAuthGuard]},
  {path:'tour',component:ToursComponent, canActivate:[AuthGuard]},
  {path:'app-global-emissions',component:GlobalEmissionsComponent, canActivate:[AuthGuard]},
  {path:'app-real-emissions',component:RealEmissionsComponent, canActivate:[AuthGuard]},
  {path:'app-real-fuel',component:RealFuelComponent, canActivate:[AuthGuard]}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
