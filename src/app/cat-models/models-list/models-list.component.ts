import { DecimalPipe } from '@angular/common';
import { Component, inject, Input, OnInit, PipeTransform, TemplateRef } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';
import { Model } from 'src/app/models/models';
import { Vehicle } from 'src/app/models/vehicles';
import { ModelService } from 'src/app/services/model.service';

function search(this: any, text: string, pipe: PipeTransform): Model[] {
  return this.models.filter((model: { model_year: string; model_name: any; }) => {
    const term = text.toLowerCase();
    return (
      model.model_name.toLowerCase().includes(term) ||
      pipe.transform(model.model_year).includes(term)
    );
  });
}

@Component({
  selector: 'app-models-list',
  templateUrl: './models-list.component.html',
  styleUrls: ['./models-list.component.css']
})
export class ModelsListComponent implements OnInit{

  private modalService = inject(NgbModal);
  closeResult = '';

  @Input({ required: false }) models!: Model[];
  models_: Observable<Model[]> | undefined;
  filter = new FormControl('', { nonNullable: true });
  modelsForm!: NgForm

  public totalItems: number = 0;
  public page: number = 1;
	pageSize = 4;
  public  showPagination: boolean = true;

  constructor(pipe: DecimalPipe, public model_service:ModelService){

    debugger;
    this.models_ = this.filter.valueChanges.pipe(
			startWith(''),
			map((text) => search(text, pipe)),
		);
    this.totalItems = this.model_service.models_list.length;
   

  }

  ngOnInit(): void {
    this.model_service.getModels();
    debugger
   
  }

  onEdit(model: Model) {
    this.model_service.selected_model = Object.assign({}, model);
  
  }

  onDelete(model_id: number) {
    if(confirm('Are you sure you want to delete it?')) {
     this.model_service.deleteModel(model_id);
      //this.toastr.warning('Deleted Successfully', 'Product Removed');
    }
  }

  refreshEmployees() {
		this.model_service.models_list = this.model_service.models_list.map((model_name, i) => ({ id: i + 1, ...model_name })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
	}

  open(content: TemplateRef<any>, model?:Model) {

    if (model != undefined)
    this.onEdit(model);
    else
    this.model_service.selected_model = new Model;

		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
				this.closeResult = `Closed with: ${result}`;
        debugger;
        model = this.model_service.selected_model;
        if(model.model_id == null)
        this.model_service.saveModel(model);
        else
        this.model_service.updateModel(model);
        this.resetList();
			},
			(reason: any) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  resetList()
  {
    this.model_service.selected_model = new Model();  
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
