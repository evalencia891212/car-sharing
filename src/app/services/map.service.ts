import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { event } from 'jquery';
import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map | undefined;
  style = `mapbox://styles/mapbox/streets-v11`;
  // Coordenadas de la localización donde queremos centrar el mapa
  lat = 23.240233839876034;
  lng = -106.3982591990835;
  zoom = 15;
  constructor() {
    debugger;
    // Asignamos el token desde las variables de entorno
    this.mapbox.accessToken = environment.mapBoxToken;
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat]
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.AttributionControl({
      customAttribution: 'Map design by me'
     }));
   
     // Initialize the m
   
debugger;
  const marker = new mapboxgl.Marker({
      color: "#FFFFFF",
      draggable: true
  }).setLngLat([this.lng,this.lat])
  .addTo(this.map);

    // Set an event listener
    const thisObject = this;
    this.map.on('click', (e) => {
      debugger;
      console.log(`A dblclick event has occurred at ${e.lngLat}`);
      this.addMarker(this,e.lngLat.lng,e.lngLat.lat);
    
    });

  
  }

  addMarker(thisObject:any,lng:any,lat:any) {
      const marker = new mapboxgl.Marker({
        color: "#FFFFFF",
        draggable: true
    }).setLngLat([this.lng,this.lat])
    .addTo(thisObject.map);
  }
  
}
