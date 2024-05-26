import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, PipeTransform, TemplateRef } from '@angular/core';
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
  search!: string;

  @Input({ required: false }) employees!: Employee[];
  @Input({ required: false }) content!: TemplateRef<any>;

  @Output() onAddClick = new EventEmitter<String>();
  @Output() onUpdateClick = new EventEmitter<Employee>();
  @Output() onRemoveClick = new EventEmitter<Employee>();
  @Output() onUserClick = new EventEmitter<Employee>();
  
  public i = 1;

  employees_: Observable<Employee[]> | undefined;
  filter = new FormControl('', { nonNullable: true });
  employee_list: Employee[] | undefined;

 public totalItems: number = 0;
 public page: number = 1;
 public  showPagination: boolean = true;

  constructor(pipe: DecimalPipe ,public employee_service: EmployeeService){
    this.employees_ = this.filter.valueChanges.pipe(
			startWith(''),
			map((text) => search(text, pipe)),
		);
    this.totalItems = this.employee_service.employee_list.length;
   
  }
  ngOnInit(): void {
    this.employee_service.getEmployees();
   
  }
  
  filterTable(){
    
    console.log(this.search)
    this.page = 1;
    if(this.search != ""){
      let match_employees = this.employee_service.employee_list.filter(employee => employee.name.toUpperCase().includes(this.search.toUpperCase()));
      this.employee_service.employee_list_page = match_employees.slice(
        (this.page - 1) * this.employee_service.pageSize,
        (this.page - 1) * this.employee_service.pageSize + this.employee_service.pageSize,
      );
    }else {
      this.refreshEmployees()
    }
    
  }

  refreshEmployees() {
    
		this.employee_service.employee_list_page = this.employee_service.employee_list.slice(
			(this.page - 1) * this.employee_service.pageSize,
			(this.page - 1) * this.employee_service.pageSize + this.employee_service.pageSize,
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

  public emitUpdate(employee:Employee){
    ;
    this.employee_service.selected_employee = employee;
    this.onUpdateClick.emit(employee);
  }

  public emitRemove(employee:Employee){
    this.onRemoveClick.emit(employee);
  }

  public emitUser(employee:Employee){
    this.onUserClick.emit(employee);
  }

  

}

