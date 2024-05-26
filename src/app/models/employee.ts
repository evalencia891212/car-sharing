import { Injectable } from "@angular/core";

@Injectable()
export class Employee {
    public employee_id!: number;
    public user_id!: number;
    public employee_number!: string;
    public name!: string;
    public last_name!: string;
    public mother_lastname!: string ;
    public neighborhood!: string ;
    public city!: string; 
    public street_name!: string;
    public outdoor_number!: string;
    public interior_number!: string;
    public vehicle_id!:number;
    public vehicle_status!:number;
    public company_mail!: string;
    public personal_mail!: string;
    public location!: string;
    public place_id!:string;
    public office_distance!:number;
    public active: string = "1";
}
//11 Entradas

