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
    CatRoutesComponent
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
    GoogleMapsModule

  ],
  providers: [DecimalPipe,Employee],
  bootstrap: [AppComponent]
})
export class AppModule { }
