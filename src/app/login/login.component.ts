import { AfterViewInit, Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthGoogleService } from '../auth-google.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  public user!:string
  public password!:string;
  private modalService = inject(NgbModal);
  closeResult = '';

  @ViewChild('content') content!: TemplateRef<any>;
  constructor(private authGoogleService: AuthGoogleService,private user_service:UserService, private router: Router,) { 

  }
  ngAfterViewInit(): void {
   this.open(this.content)
  }

  login() {
    this.authGoogleService.login();
  }



  userLogin(){
    
    this.user_service.getUser(this.user,this.password).pipe(
      map(data => data as User)
    ).pipe(
      map(message => message as any)
    ).subscribe(respose => {
      if(respose.length > 0){
        this.user_service.current_usser = respose[0];
        this.user_service.isAuthenticated = true;
        this.user_service.userType = this.user_service.current_usser.typer_id;
        this.router.navigate(['home']);
      }  
     

    });
  }


  public open(content: TemplateRef<any>) {
    
   

		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' ,size: 'lg', backdrop: 'static' ,windowClass:'my-class'}).result.then(
			(result: any) => {
        this.userLogin()
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

  onSubmit()
  {
    
    this.user_service.getUser(this.user,this.password);
  }

}
