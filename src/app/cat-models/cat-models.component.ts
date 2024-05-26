import { Component, inject, OnInit, Output, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Model } from '../models/models';
import { ModelService } from '../services/model.service';

@Component({
  selector: 'app-cat-models',
  templateUrl: './cat-models.component.html',
  styleUrls: ['./cat-models.component.css']
})
export class CatModelsComponent implements OnInit {

  @Output() modelsForm!: NgForm
  private modalService = inject(NgbModal);
  closeResult = '';

  constructor(public models_service: ModelService) {

  }

  ngOnInit(): void {
    this.models_service.getModels();
  }

  onSubmit(modelsForm: NgForm)
  { 
    if(modelsForm.value.vehicle_id == null)
      this.models_service.saveModel(modelsForm.value);
    else{
      this.models_service.updateModel(modelsForm.value)

    }
  }

  resetForm(vehicleForm?: NgForm)
  {
    if(vehicleForm != null)
    vehicleForm.reset();
    this.models_service.selected_model = new Model();  
  }

  onDelete(model: Model) {
    if(confirm('Are you sure you want to delete it?')) {
     this.models_service.deleteModel(model.model_id);
      //this.toastr.warning('Deleted Successfully', 'Product Removed');
    }
  }

  onEdit(model: Model) {
    this.models_service.selected_model = Object.assign({}, model);
  
  }

  test(event:any){
    
    console.log(event)
  }

  public open(content: TemplateRef<any>, model?:Model) {
    
    if (model != undefined)
    this.onEdit(model);
    else
    this.models_service.selected_model = new Model;

		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
				this.closeResult = `Closed with: ${result}`;
        
        model = this.models_service.selected_model;
        if(model.model_id == null)
        this.models_service.saveModel(model);
        else
        this.models_service.updateModel(model);
        this.resetModel();
			},
			(reason: any) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  resetModel()
  {
    this.models_service.selected_model = new Model();  
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
