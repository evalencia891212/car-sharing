import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounce, debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { Route } from '../models/route';
import { RouteSelect } from '../models/route-select';
import { RouteService } from '../services/route.service';
import { StationService } from '../services/station.service';

@Component({
  selector: 'app-station-form',
  templateUrl: './station-form.component.html',
  styleUrls: ['./station-form.component.css']
})
export class StationFormComponent implements OnInit, AfterViewInit {

  selected_route!:string;
  //public route_select_list:RouteSelect[]=[];
  public check:boolean = true;
  route_select_list:Route [] = [];
  active = 1;

 
  

  @ViewChild('route_search') route_search!: ElementRef;
  @ViewChild('routeSelectList') routeSelectList!: ElementRef;

  constructor(public station_service: StationService,
              public route_service:RouteService) {

    }

    ngOnInit() {
      //this.route_service.getRoutes();
      this.route_service._getRoutes().subscribe(respose => {
        this.route_service.route_selected=[];
        this.route_service.route_list = respose;
        this.route_service.route_list.forEach(route => {
          this.route_service.route_selected.push({route_id:route.route_id,route_name:route.route_name, selected:false}) 
         })
       let station_route:Route;
       let selected_station: any =this.station_service.selected_station;
       station_route = respose.filter(route=>route.route_id == selected_station.route_id)[0]; 
       this.selectRoutes(station_route);
      });
      
      this.station_service.check_in.hour =  Number.parseInt(this.station_service.selected_station.check_in.split(":")[0])
      this.station_service.check_in.minute =  Number.parseInt(this.station_service.selected_station.check_in.split(":")[1])
      
    }


    ngAfterViewInit() {
      this.setInputRoutesEvent();
    }

    setInputRoutesEvent() {
      
      fromEvent(this.route_search.nativeElement, 'keydown').pipe(
        map((event: any) => event) // return event
        , debounceTime(500)
        , distinctUntilChanged()
      ).subscribe((event: any) => {
        let search = event.target.value // get value
        if (search.trim().length > 0) {
          this.setListStyle(this.routeSelectList);
          if (event.key == "Tab" || event.key == "Enter") {
            if (this.route_service.route_list.length > 0) {
              this.selectRoutes(this.route_service.route_list[0])
            } else {
              this.inputRoute(search)
              //this.filterLocation(search);
            }
  
          } else if (event.key.length == 1 || event.key == "Backspace") {
            this.inputRoute(search);
            //this.filterLocation(search);
            this.removeStyle(this.routeSelectList,this.route_search);
           
          }
        } else {
          this.removeStyle(this.routeSelectList,this.route_search);
        }
      })
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

    selectRoutes(route:Route){
      
      this.station_service.selected_station.routes = [];
      this.station_service.selected_station.routes.push(route);
      this.selected_route = route.route_name;
      if(this.station_service.selected_station.marker_type == 'marker')
        this.station_service.selected_station.station_name = 'MRRID-' + route.route_id
      if(this.routeSelectList)this.routeSelectList.nativeElement.hidden = true;
  
    }


  
    inputRoute(search:any){
      
      //this.route_select_list = this.route_service.route_selected.filter(route=>route.route_name.toUpperCase().includes(search.toUpperCase()))
      this.route_select_list = this.route_service.route_list.filter(item => item.route_name.toUpperCase().includes(search.toUpperCase()));
  
    }

    setRouteSelectValue(route_id:number,select:boolean){
     
      this.route_service.route_selected.forEach(route=>{
        if(route.route_id==route_id) route.selected = !select
      })

    }

    getIfSelected(route_id:number){
      
      return true;
      //return this.route_service.route_selected.filter(item => item.route_id != route_id)[0].selected;
    }

    isStation(){
      if(this.station_service.selected_station.marker_type=='station')
       return true;
      else
       return false;
    }


    isUpdate() {
      if(this.station_service.selected_station.station_id!=0 || this.station_service.selected_station.station_id!=null )
        return true;
       else
        return false;
    }

    onChangeStationType(event:any){
      
      this.station_service.selected_station.marker_type = event.srcElement.defaultValue;
      if(event.srcElement.defaultValue == 'marker'){
        this.station_service.selected_station.station_name = "MR";
      }
    }

    isCompanyCourse() {
      if(this.station_service.selected_station.course==1)
      return true;
      else
      return false;
    }

    onChangeStationCourse(event:any) {
      
      this.station_service.selected_station.course = event.srcElement.defaultValue;

    }

   

}
