import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthGoogleService } from '../auth-google.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public user!:string
  public password!:string;
  constructor(private authGoogleService: AuthGoogleService,private user_service:UserService, private router: Router,) { }

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

  onSubmit()
  {
    
    this.user_service.getUser(this.user,this.password);
  }

}
