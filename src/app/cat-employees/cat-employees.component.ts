import { AfterViewInit, Component,ElementRef,inject,OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { Employee } from '../models/employee';
import { User } from '../models/user';
import { Vehicle } from '../models/vehicles';
import { EmployeeService } from '../services/employee.service';
import { UserService } from '../services/user.service';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-cat-employees',
  templateUrl: './cat-employees.component.html',
  styleUrls: ['./cat-employees.component.css']
})
export class CatEmployeesComponent implements OnInit, AfterViewInit {

  @ViewChild('vehicle_search') vehicle_search!: ElementRef;
  @ViewChild('vehicleSearchList') vehicleSearchList!: ElementRef;

  model: any;
  search:any
  public employees: Employee[] = [];
  public employee: Employee = new Employee();

  private modalService = inject(NgbModal);
	closeResult = '';
 
  selected_vehicle:string ='';
  available_vehicle_list : Vehicle[] = [];

  constructor(
    public employe_service:EmployeeService,
    public vehicle_service:VehicleService,
    public user_service:UserService
   
  ){
    
  
  }

  ngOnInit() {

    this.employe_service.getEmployees();
    this.vehicle_service.getVehicles();
    this.vehicle_service.getVehiclesAvailables();
    //this.resetForm();

  }

  ngAfterViewInit() {
    this.setInputVehicleEvent();
  }

  public saveEmployee(){
    
    this.employe_service.saveEmployee(this.employee);
    this.resetForm();
  }

 
  setInputVehicleEvent() {
    fromEvent(this.vehicle_search.nativeElement, 'keydown').pipe(
      map((event: any) => event) // return event
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((event: any) => {
      let search = event.target.value // get value
      if (search.trim().length > 0) {
        this.setListStyle(this.vehicleSearchList);
        if (event.key == "Tab" || event.key == "Enter") {
          if (this.vehicle_service.available_vehicles_list.length > 0) {
            this.selectVehicle(this.vehicle_service.available_vehicles_list[0])
          } else {
            this.inputVehicle(search)
            //this.filterLocation(search);
          }

        } else if (event.key.length == 1 || event.key == "Backspace") {
          this.inputVehicle(search);
          //this.filterLocation(search);
          this.removeStyle(this.vehicleSearchList,this.vehicle_search);
         
        }
      } else {
        this.removeStyle(this.vehicleSearchList,this.vehicle_search);
      }
    })
  }

  onSubmit(employeeForm: NgForm)
  {
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

  onEdit(employee: Employee) {
    this.employe_service.selected_employee = Object.assign({}, employee);
    this.vehicle_service.setVehicleFromList(employee)
  }

  open(content: TemplateRef<any>,employe?:Employee) {
    if (employe != undefined)
    this.onEdit(employe);
    else
    this.employe_service.selected_employee = new Employee;

		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
				this.closeResult = `Closed with: ${result}`;
        employe = this.employe_service.selected_employee;
        if(employe.employee_id == null)
        this.employe_service.saveEmployee(employe);
        else
        this.employe_service.updateEmployee(employe);
        this.resetEmployee();
			},
			(reason: any) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  editUser() {

  }

  openUser(content: TemplateRef<any>,employee:Employee) {
    
    if(employee.user_id) this.editUser();
    else
    this.user_service.selected_employee_usser = new User();


		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
				this.closeResult = `Closed with: ${result}`;
        let user = this.user_service.selected_employee_usser
        
        this.user_service.createUser(user,employee.employee_id);
        
			},
			(reason: any) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  onDelete(employee: Employee) {
    if(confirm('Desea eliminar a este empleado?')) {
     this.employe_service.deleteEmployee(employee.employee_id);
      //this.toastr.warning('Deleted Successfully', 'Product Removed');
    }
  }

  isTourDetail(){
    
  }

  resetEmployee()
  {
    this.employe_service.selected_employee = new Employee();  
  }
  


  private setListStyle(searchList: ElementRef) {
    searchList.nativeElement.style.cssText = "position: absolute; z-index: 999; cursor: pointer;width: 305px; max-height: 150px; margin-bottom: 10px;  overflow:scroll;  -webkit-overflow-scrolling: touch;"
    searchList.nativeElement.hidden = false;
  }

  private removeStyle(searchList: ElementRef, searchInput: ElementRef) {
    if (searchInput.nativeElement.value == "") {
      searchList.nativeElement.style.cssText = "position: absolute; z-index: 999; cursor: pointer; "
      searchList.nativeElement.hidden = true;
    }
  }

  selectVehicle(vehicle:Vehicle) {
    
    this.vehicle_service.selected_vehicle_plate = vehicle.licence_plate;
    this.employe_service.selected_employee.vehicle_id = vehicle.vehicle_id;
    this.vehicleSearchList.nativeElement.hidden = true;
  }

  private inputVehicle(search:any) {
    
    this.available_vehicle_list = this.vehicle_service.available_vehicles_list.filter(item => item.licence_plate.toUpperCase().includes(search.toUpperCase()));
  }

}
