import { Component } from '@angular/core';
import { OfficeService } from './services/office.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eco-car-sharing';
  sidebarExpanded = true;

  constructor(public office_service: OfficeService,public employee_service:EmployeeService){

   this.office_service.getOffice();
  }

}
