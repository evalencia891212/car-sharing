import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Vehicle } from 'src/app/models/vehicles';
import { ModelService } from 'src/app/services/model.service';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.css']
})
export class VehiclesListComponent {

  private modalService = inject(NgbModal);
  closeResult = '';

  public vehicles_: Vehicle[] = [];
  public vehicle: Vehicle = new Vehicle();

  @Input({ required: false }) vehicles!: Vehicle[];
  @Input({ required: false }) content!: TemplateRef<any>;

  @Output() onAddClick = new EventEmitter<String>();
  @Output() onUpdateClick = new EventEmitter<Vehicle>();
  @Output() onRemoveClick = new EventEmitter<Vehicle>();
  @Output() onIssueClick = new EventEmitter<Vehicle>();

  filter = new FormControl('', { nonNullable: true });

  //Pagination Variables
  public page: number = 1;
  //Filter Variables
  search!: string;

  constructor(pipe: DecimalPipe,public vehicle_service:VehicleService, public models_service: ModelService) {
    this.vehicle_service.getVehicles();
    this.models_service.getModels();
  }

  onDelete(employee_id: number) {
    if(confirm('Are you sure you want to delete it?')) {
     this.vehicle_service.deleteVehicle(employee_id);
      //this.toastr.warning('Deleted Successfully', 'Product Removed');
    }
  }

  onEdit(vehicle:Vehicle){
      this.vehicle_service.selected_vehicle = vehicle;
      this.vehicle_service.selected_model = this.models_service.getModelByID(vehicle.model_id);
  }

  open(content: TemplateRef<any>, vehicle?:Vehicle) {

    
    if (vehicle != undefined)
    this.onEdit(vehicle);
    else
    this.vehicle_service.selected_vehicle = new Vehicle;

		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
				this.closeResult = `Closed with: ${result}`;
        
        console.log(this.vehicle_service.selected_vehicle);
        this.vehicle_service.saveVehicle(this.vehicle_service.selected_vehicle);
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


  public emitAdd(){
    this.onAddClick.emit("new");
  }

  public emitUpdate(vehicle:Vehicle){
    
    this.onUpdateClick.emit(vehicle);
  }

  public emitRemove(vehicle:Vehicle){
    this.onRemoveClick.emit(vehicle);
  }

  emitIssue(vehicle:Vehicle){
    this.onIssueClick.emit(vehicle)
  }

  filterTable(){
    
    console.log(this.search)
    this.page = 1;
    if(this.search != ""){
      let match_vehicles = this.vehicle_service.vehicles_list.filter(vehicle => vehicle.licence_plate.toUpperCase().includes(this.search.toUpperCase()));
      this.vehicle_service.vehicles_list_page = match_vehicles.slice(
        (this.page - 1) * this.vehicle_service.pageSize,
        (this.page - 1) * this.vehicle_service.pageSize + this.vehicle_service.pageSize,
      );
    }else {
      this.refreshVehicles()
    }
    
  }
  

  refreshVehicles() {
		this.vehicle_service.vehicles_list_page = this.vehicle_service.vehicles_list.slice(
			(this.page - 1) * this.vehicle_service.pageSize,
			(this.page - 1) * this.vehicle_service.pageSize + this.vehicle_service.pageSize,
		);
    
	}

}
