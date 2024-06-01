import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-real-fuel',
  templateUrl: './real-fuel.component.html',
  styleUrls: ['./real-fuel.component.css']
})
export class RealFuelComponent implements OnInit {

  start!:any;
  end!:any;
  global_fuel_acumulated:number = 0
  adjust_fuel_acumulated:number = 0
  total_fuel_acumulated:number = 0
  total_days!:number;

  constructor(public report_service:ReportsService){

  }


  ngOnInit(): void {
    this.total_fuel_acumulated = 0
  }

  formatSavedFuel(row:any){
    
    let way_fuel = (row.distance/row.performance);
    let total_fuel =way_fuel * 2
    if(row.tour_detail_id != 0)
      total_fuel=total_fuel*-1
    if(row.tour_vehicle!=0 && row.tour_detail_id == 0)
      total_fuel=total_fuel*-1
      
    //this.adjust_fuel_acumulated = this.adjust_fuel_acumulated + total_fuel;

    return total_fuel.toFixed(2);

  }

  calculateTotalSaved(){
    this.adjust_fuel_acumulated = 0
    this.report_service.tourInfo.forEach((row: { distance: number; performance: number; tour_detail_id: number; tour_vehicle: number; }) => {
      let way_fuel = (row.distance/row.performance);
      let total_fuel =way_fuel * 2
      if(row.tour_detail_id != 0)
        total_fuel=total_fuel*-1
      if(row.tour_vehicle!=0 && row.tour_detail_id == 0)
       total_fuel=total_fuel*-1
      
       this.adjust_fuel_acumulated = this.adjust_fuel_acumulated + total_fuel;
    });
  }

  
  calculateTotalGlobal(){
    this.report_service.globalCO2emissions.forEach((row: { distance: number; performance: number; tour_detail_id: number; tour_vehicle: number; }) => {
      let way_fuel = (row.distance/row.performance);
      let total_fuel =way_fuel * 2
    
      total_fuel=total_fuel * (this.total_days+1)
       this.global_fuel_acumulated = this.global_fuel_acumulated + total_fuel;
    });
  }

  formatFuelGlobal(row:any){
    //((e.office_distance/1000) / (m.performance)) * 2.31 as co2 
    let way_emissions = (row.distance/row.performance);
    let total_emissions =way_emissions * 2
  
     total_emissions=total_emissions * (this.total_days+1)
     
    return total_emissions.toFixed(2);

  }

  formatNumber(value:number){
    return value.toFixed(2);
  }

  getName(row:any){
    return row.name +' ' + row.last_name
  }

 
  searchInfo(){
    
    this.total_fuel_acumulated = 0;
    this.adjust_fuel_acumulated =0;
    this.global_fuel_acumulated=0;
    let start = this.start.year + "-" + ("0" + (this.start.month)).slice(-2) + "-" + ("0" + (this.start.day)).slice(-2);
    let end = this.end.year + "-" + ("0" + (this.end.month)).slice(-2) + "-" + ("0" + (this.end.day)).slice(-2);
    let start_ = new Date(start);
    let end_= new Date(end)
    this.total_days = this.calculateDaysDifference(start,end)
    this.report_service.getTourInfo(start, end ).subscribe(response=>{
      this.report_service.tourInfo=response;
      this.report_service.getGlobalEmissions().subscribe(respose => {
        this.report_service.globalCO2emissions = respose;
        this.calculateTotalGlobal()
    });
    this.calculateTotalSaved();
    });
  }

  


  downloadPDF() {
    // Extraemos el
    let DATA:any = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 4
    };

   
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
      //docResult.setDisplayMode(1, 'single', 'UseOutlines');
    });
  }


  calculateDaysDifference(startDate: string, endDate: string): number {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getStartDate(){
    return this.start.year + "-" + ("0" + (this.start.month)).slice(-2) + "-" + ("0" + (this.start.day)).slice(-2);
  }

  getEndDate(){
    return this.end.year + "-" + ("0" + (this.end.month)).slice(-2) + "-" + ("0" + (this.end.day)).slice(-2);
  }

}
