import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MapDirectionsService } from '@angular/google-maps';
import { environment } from '@env/environment';
import { flatMap, map, Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { Office } from '../models/office';
import { StationService } from './station.service';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  constructor(private httpClient: HttpClient,public mapDirectionsService: MapDirectionsService, public station_service: StationService) { }

  office!: Office;
  officeMarkerOptions: google.maps.MarkerOptions[] = [];

  markerOfficePositions: google.maps.LatLngLiteral[] = [];
  directionsResults$: Observable<google.maps.DirectionsResult | undefined> | undefined;

  office_lat_lng:any;

  getOffice() 
  {
    
    this.httpClient.get(environment.apiHost + '/office').pipe(
      map(data => data as Office)
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
        
        this.office = respose[0];
        let lat_lng = this.getLatLngFromPlaceRow(this.office);
        this.office_lat_lng = lat_lng;
        this.markerOfficePositions.push({lat:lat_lng[0],lng:lat_lng[1]});
        this.officeMarkerOptions.push( {title:this.office.office_name, icon:'http://maps.gstatic.com/mapfiles/ms2/micons/rangerstation.png', draggable:true});
    });
  }

  getLatLngFromPlaceRow(place:any){
    let lat_lng = place.location.split(',',2);
    lat_lng[0]=parseFloat(lat_lng[0]);
    lat_lng[1]=parseFloat(lat_lng[1]);
    return lat_lng;
 }


 getEmployeeDistanceToOffice(employee:Employee): Promise<any>{
  
    let employee_lat_lng = this.getLatLngFromPlaceRow(employee);
    const request: google.maps.DirectionsRequest = {
      destination: {lat: this.office_lat_lng[0], lng: this.office_lat_lng[1]},
      origin: {lat: employee_lat_lng[0], lng: employee_lat_lng[1]},
      travelMode: google.maps.TravelMode.DRIVING
    };
 
    this.mapDirectionsService.route
   
    const {TravelMode, DirectionsService, DirectionsStatus} = google.maps;
    const directionsService = new DirectionsService;

    return new Promise((resolve, reject) => {
     

      const {TravelMode, DirectionsService, DirectionsStatus} = google.maps;


      directionsService.route(request, (response, status) => {
         
          if(status === DirectionsStatus.OK && response != null) {
              let distances = response.routes[0].legs[0].distance?.value
              
              return resolve(distances);
          } else {
              return reject(new Error(status));
          }
      });
  })

}

lastStationToOffice(){
  
  var directionsRenderer = new google.maps.DirectionsRenderer();

  
  //var lastStationLatLng = this.station_service.markerStationPositions[ this.station_service.markerStationPositions.length - 1];
  var lastStationLatLng = this.station_service.markerStationPositionsByRute[this.station_service.markerStationPositionsByRute.length - 1];
  
  const request: google.maps.DirectionsRequest = {
    destination: {lat: this.office_lat_lng[0], lng: this.office_lat_lng[1]},
    origin: {lat: lastStationLatLng.lat, lng: lastStationLatLng.lng},
    travelMode: google.maps.TravelMode.DRIVING
  };

  const {TravelMode, DirectionsService, DirectionsStatus} = google.maps;
  const directionsService = new DirectionsService;

  return new Promise((resolve, reject) => {
    
    const {TravelMode, DirectionsService, DirectionsStatus} = google.maps;
    directionsService.route(request, (response, status) => {
       
        if(status === DirectionsStatus.OK && response != null) {
            let distances = response.routes[0].legs[0].distance?.value
            //directionsRenderer.setDirections(response);
            return resolve(response);
        } else {
            return reject(new Error(status));
        }
    });
})

}
  twoStationsPath(origin:any,destination:any){
    
  var directionsRenderer = new google.maps.DirectionsRenderer();

  
  //var lastStationLatLng = this.station_service.markerStationPositions[ this.station_service.markerStationPositions.length - 1];
  var lastStationLatLng = this.station_service.markerStationPositionsByRute[this.station_service.markerStationPositionsByRute.length - 1];
  
  const request: google.maps.DirectionsRequest = {
    destination:origin,
    origin: destination,
    travelMode: google.maps.TravelMode.DRIVING
  };

  const {TravelMode, DirectionsService, DirectionsStatus} = google.maps;
  const directionsService = new DirectionsService;

  return new Promise((resolve, reject) => {
    
    const {TravelMode, DirectionsService, DirectionsStatus} = google.maps;
    directionsService.route(request, (response, status) => {
       
        if(status === DirectionsStatus.OK && response != null) {
            let distances = response.routes[0].legs[0].distance?.value
            //directionsRenderer.setDirections(response);
            return resolve(response);
        } else {
            return reject(new Error(status));
        }
    });
})
  }
}



  // calculateDistance(employee:Employee) {
  // return new Promise((resolve, reject) => {
  //     if(addresses.length < 2) {
  //         return reject(new Error(`Distance calculation requires at least 2 stops, got ${addresses.length}`));
  //     }

  //     const {TravelMode, DirectionsService, DirectionsStatus} = google.maps;

  //     const directionsService = new DirectionsService;
  //     const origin = addresses.shift();
  //     const destination = addresses.pop();
  //     const waypoints = addresses.map(stop => ({location: stop}));

  //     directionsService.route({
  //         origin,
  //         waypoints,
  //         destination,
  //         travelMode: TravelMode.DRIVING,
  //     }, (response, status) => {
  //         if(status === DirectionsStatus.OK) {
  //             let distances = _.flatMap(response.routes, route => _.flatMap(route.legs, leg => leg.distance.value));

  //             return resolve(_.sum(distances));
  //         } else {
  //             return reject(new Error(status));
  //         }
  //     });
  // })
//}


