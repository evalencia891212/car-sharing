import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject, Input, OnInit, PipeTransform, TemplateRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ModalDismissReasons, NgbHighlight, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { CatEmployeesComponent } from '../cat-employees.component';

function search(this: any, text: string, pipe: PipeTransform): Employee[] {
  return this.employees.filter((employee: { name: string; last_name: any; mother_lastname: any; }) => {
    const term = text.toLowerCase();
    return (
      employee.name.toLowerCase().includes(term) ||
      pipe.transform(employee.last_name).includes(term) ||
      pipe.transform(employee.mother_lastname).includes(term)
    );
  });
}

@Component({
  selector: 'app-employe-list',
  templateUrl: './employe-list.component.html',
  styleUrls: ['./employe-list.component.css']
})
export class EmployeListComponent implements OnInit {

  private modalService = inject(NgbModal);
	closeResult = '';

  @Input({ required: false }) employees!: Employee[];
  @Input({ required: false }) content!: TemplateRef<any>;
  
  public i = 1;

  employees_: Observable<Employee[]> | undefined;
  filter = new FormControl('', { nonNullable: true });

 public totalItems: number = 0;
  public page: number = 1;
	pageSize = 4;
 public  showPagination: boolean = true;

  constructor(pipe: DecimalPipe ,public employeService: EmployeeService){
    debugger;
    this.employees_ = this.filter.valueChanges.pipe(
			startWith(''),
			map((text) => search(text, pipe)),
		);
    this.totalItems = this.employeService.employee_list.length;
   
  }
  ngOnInit(): void {
    debugger
    this.employeService.getEmployees();
   
  }
  

  onEdit(employe: Employee) {
    this.employeService.selected_employee = Object.assign({}, employe);
  }

  onDelete(employee_id: number) {
    if(confirm('Are you sure you want to delete it?')) {
     this.employeService.deleteEmployee(employee_id);
      //this.toastr.warning('Deleted Successfully', 'Product Removed');
    }
  }

  refreshEmployees() {
		this.employeService.employee_list = this.employeService.employee_list.map((name, i) => ({ id: i + 1, ...name })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
	}

  open(content: TemplateRef<any>,employe:Employee) {

    debugger
    if (employe != undefined)
    this.onEdit(employe);
    else
    this.employeService.selected_employee = new Employee;

		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
				this.closeResult = `Closed with: ${result}`;
        debugger;
        employe = this.employeService.selected_employee;
        if(employe.employee_id == null)
        this.employeService.saveEmployee(employe);
        else
        this.employeService.updateEmployee(employe);
        this.resetList();
			},
			(reason: any) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  resetList()
  {
    this.employeService.selected_employee = new Employee();  
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

