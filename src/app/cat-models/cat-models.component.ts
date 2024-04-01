import { Component, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Model } from '../models/models';
import { ModelService } from '../services/model.service';

@Component({
  selector: 'app-cat-models',
  templateUrl: './cat-models.component.html',
  styleUrls: ['./cat-models.component.css']
})
export class CatModelsComponent implements OnInit {

  @Output() modelsForm!: NgForm

  constructor(public models_service: ModelService) {

  }

  ngOnInit(): void {
    this.models_service.getModels();
  }

  onSubmit(modelsForm: NgForm)
  { 
    debugger
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

}
