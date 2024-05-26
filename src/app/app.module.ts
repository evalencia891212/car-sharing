import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { WaitingCarComponent } from './waiting-car/waiting-car.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { CatVehiclesComponent } from './cat-vehicles/cat-vehicles.component';
import { CatEmployeesComponent } from './cat-employees/cat-employees.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeListComponent } from './cat-employees/employe-list/employe-list.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Employee } from './models/employee';
import { VehiclesListComponent } from './cat-vehicles/vehicles-list/vehicles-list.component';
import { CatModelsComponent } from './cat-models/cat-models.component';
import { ModelsListComponent } from './cat-models/models-list/models-list.component';
import { StationsComponent } from './stations/stations.component';
import { CatRoutesComponent } from './cat-routes/cat-routes.component';
import {GoogleMapsModule} from '@angular/google-maps';
import { RoutesListComponent } from './cat-routes/routes-list/routes-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StationsListComponent } from './stations-list/stations-list.component';
import { StationFormComponent } from './station-form/station-form.component';
import { StationSequenceComponent } from './station-sequence/station-sequence.component';
import { ModelFormComponent } from './cat-models/model-form/model-form.component';
import { EmployeeFormComponent } from './cat-employees/employee-form/employee-form.component';
import { EmployeesComponent } from './cat-employees/employees/employees.component';
import { RouteFormComponent } from './cat-routes/route-form/route-form.component';
import { VehiclesFormComponent } from './cat-vehicles/vehicles-form/vehicles-form.component';
import { ToursComponent } from './tours/tours.component';
import { GlobalEmissionsComponent } from './reports/global-emissions/global-emissions.component';
import { GlobalFuelComponent } from './reports/global-fuel/global-fuel.component';
import { RealEmissionsComponent } from './reports/real-emissions/real-emissions.component';
import { RealFuelComponent } from './reports/real-fuel/real-fuel.component';
import { VehicleEmployeesComponent } from './vehicle-employees/vehicle-employees.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    WaitingCarComponent,
    CatVehiclesComponent,
    CatEmployeesComponent,
    SidebarComponent,
    EmployeListComponent,
    VehiclesListComponent,
    CatModelsComponent,
    ModelsListComponent,
    StationsComponent,
    CatRoutesComponent,
    RoutesListComponent,
    StationsListComponent,
    StationFormComponent,
    StationSequenceComponent,
    ModelFormComponent,
    EmployeeFormComponent,
    EmployeesComponent,
    RouteFormComponent,
    VehiclesFormComponent,
    ToursComponent,
    GlobalEmissionsComponent,
    GlobalFuelComponent,
    RealEmissionsComponent,
    RealFuelComponent,
    VehicleEmployeesComponent   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    OAuthModule.forRoot(),
    HttpClientModule,
    NgbModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    DragDropModule
  ],
  providers: [DecimalPipe,Employee],
  bootstrap: [AppComponent]
})
export class AppModule { }
