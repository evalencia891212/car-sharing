import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public employee_service:EmployeeService,public user_service: UserService){

  }
  ngOnInit(): void {
    
    if(this.user_service.userType == 1){
      this.employee_service.getEmployeInfoVehicleByUser(this.user_service.current_usser.user_id)
    }else if(this.user_service.userType == 2) {
      this.employee_service.getEmployeInfoVehicleByUser(this.user_service.current_usser.user_id)
    }else {
      this.employee_service.getPassengerInfoVehicleByUser(this.user_service.current_usser.user_id);
    }
  }

}
