import { Component,ElementRef,inject,OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-cat-employees',
  templateUrl: './cat-employees.component.html',
  styleUrls: ['./cat-employees.component.css']
})
export class CatEmployeesComponent implements OnInit {

  model: any;
  search:any
  public employees: Employee[] = [];
  public employee: Employee = new Employee();
 
 

  constructor(
    public employe_service:EmployeeService,
   
  ){
    debugger;
  
  }

  ngOnInit() {

    this.employe_service.getEmployees();
    //this.resetForm();

  }

  public saveEmployee(){
    debugger;
    this.employe_service.saveEmployee(this.employee);
    this.resetForm();
  }



  onSubmit(employeeForm: NgForm)
  {
    debugger
    if(employeeForm.value.employee_id == null) {
      this.employe_service.saveEmployee(employeeForm.value);
     
    }
    else{
      this.employe_service.updateEmployee(employeeForm.value)
    } 
    this.resetForm();
   // this.productService.updateProduct(productForm.value);
    
    //this.resetForm(productForm);
    //this.toastr.success('Sucessful Operation', 'Product Registered');
  }


  resetForm(employeeForm?: NgForm)
  {
    if(employeeForm != null)
    employeeForm.reset();
    this.employe_service.selected_employee = new Employee();  
  }
  
  private modalService = inject(NgbModal);
	closeResult = '';

	open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
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
