import { Component, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Model } from 'src/app/models/models';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.css']
})
export class ModelFormComponent {

  @Output() modelsForm!: NgForm

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

}
