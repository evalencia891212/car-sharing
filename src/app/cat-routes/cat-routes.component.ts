import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Route } from '../models/route';
import { RouteService } from '../services/route.service';

@Component({
  selector: 'app-cat-routes',
  templateUrl: './cat-routes.component.html',
  styleUrls: ['./cat-routes.component.css']
})
export class CatRoutesComponent implements OnInit {

  private modalService = inject(NgbModal);
  closeResult = '';

  constructor(public route_service: RouteService){

  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit(routesForm: NgForm)
  { 
    
    if(routesForm.value.vehicle_id == null)
      this.route_service.saveRoutes(routesForm.value);
    else{
      this.route_service.updateRoute(routesForm.value)
    }
  }

  resetForm(routesForm?: NgForm)
  {
    if(routesForm != null)
    routesForm.reset();
    this.route_service.selected_route = new Route();  
  }


  onEdit(route: Route) {
    this.route_service.selected_route = Object.assign({}, route);
  
  }

  open(content: TemplateRef<any>, route?:Route) {
    if (route != undefined)
    this.onEdit(route);
    else
    this.route_service.selected_route = new Route;

		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
				this.closeResult = `Closed with: ${result}`;
        route = this.route_service.selected_route;
        if(route.route_id == null)
        this.route_service.saveRoutes(route);
        else
        this.route_service.updateRoute(route);
			},
			(reason: any) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}


  private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

  onDelete(route: Route) {
    if(confirm('Are you sure you want to delete it?')) {
     this.route_service.deleteRoute(route.route_id);
      //this.toastr.warning('Deleted Successfully', 'Product Removed');
    }
  }




}
