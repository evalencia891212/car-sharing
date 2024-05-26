import { Component } from '@angular/core';
import { RouteService } from 'src/app/services/route.service';

@Component({
  selector: 'app-route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.css']
})
export class RouteFormComponent {

  constructor(public route_service:RouteService){}

  onDelete(route_id: number) {
    if(confirm('Are you sure you want to delete it?')) {
     this.route_service.deleteRoute(route_id);
      //this.toastr.warning('Deleted Successfully', 'Product Removed');
    }
  }

  

}
