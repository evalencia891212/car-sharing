import { DecimalPipe } from '@angular/common';
import { Component, inject, Input, TemplateRef } from '@angular/core';
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

  filter = new FormControl('', { nonNullable: true });


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

  }

  open(content: TemplateRef<any>, vehicle:Vehicle) {

    this.onEdit(vehicle);

		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
				this.closeResult = `Closed with: ${result}`;
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

}
