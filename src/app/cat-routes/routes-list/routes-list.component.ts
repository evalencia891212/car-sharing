import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Route } from 'src/app/models/route';
import { RouteService } from 'src/app/services/route.service';

@Component({
  selector: 'app-routes-list',
  templateUrl: './routes-list.component.html',
  styleUrls: ['./routes-list.component.css']
})
export class RoutesListComponent implements OnInit {

  private modalService = inject(NgbModal);
  closeResult = '';
  @Input({ required: false }) models!: Route[];
  models_: Observable<Route[]> | undefined;
  filter = new FormControl('', { nonNullable: true });

  @Output() onAddClick = new EventEmitter<String>();
  @Output() onUpdateClick = new EventEmitter<Route>();
  @Output() onRemoveClick = new EventEmitter<Route>();
  routesForm!: NgForm

  constructor(pipe: DecimalPipe,public route_service:RouteService){

  }

  ngOnInit(): void {
    this.route_service.getRoutes();
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
        this.resetList();
			},
			(reason: any) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}
  
  onEdit(route: Route) {
    this.route_service.selected_route = Object.assign({}, route);
  
  }

  onDelete(route_id: number) {
    if(confirm('Are you sure you want to delete it?')) {
     this.route_service.deleteRoute(route_id);
      //this.toastr.warning('Deleted Successfully', 'Product Removed');
    }
  }

  resetList()
  {
    this.route_service.selected_route = new Route();  
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

  public emitAdd(){
    this.onAddClick.emit("new");
  }

  public emitUpdate(route:Route){
    
    this.onUpdateClick.emit(route);
  }

  public emitRemove(route:Route){
    this.onRemoveClick.emit(route);
  }


}
