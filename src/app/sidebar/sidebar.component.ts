import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public user_service:UserService) { 
  }

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

}
