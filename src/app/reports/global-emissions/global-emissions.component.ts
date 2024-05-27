import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-global-emissions',
  templateUrl: './global-emissions.component.html',
  styleUrls: ['./global-emissions.component.css']
})
export class GlobalEmissionsComponent implements OnInit {

  total_emision_acumulated:number = 0

  constructor(public report_service:ReportsService) {

  }

  ngOnInit(): void {
    this.report_service.getGlobalEmissions().subscribe(respose => {    
      this.report_service.globalCO2emissions = respose;
    });
    this.total_emision_acumulated = 0
    //this.downloadPDF();
  }

  public downloadPDFTest(): void {
    const doc = new jsPDF();

    doc.text('Hello world!', 10, 10);
    doc.save('hello-world.pdf');
  }

  formatEmitions(row:any){
    
    let way_emissions = (row.distance/row.performance) * 2.31;
    let total_emissions =way_emissions * 2
     this.total_emision_acumulated = this.total_emision_acumulated + total_emissions;

    return total_emissions.toFixed(2);

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


  calculateDaysDifference(startDate: Date, endDate: Date): number {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  formatNumber(value:number){
    return value.toFixed(2);
  }

}
