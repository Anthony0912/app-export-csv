import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-export-csv';
  public data:any;
  public error:any;

  constructor(private http: HttpClient, private _FileSaverService: FileSaverService) {
    this.getDataAPI();
  }

  ngOnInit() { }
  
  public exportCSV(filename="MONGE_PAY_HISTORIAL"):void {
    let csvData = this.convertToCSV(this.data?.files, Object.keys(this.data?.files[0]));
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
    
  }

  private convertToCSV(objArray:any, headerList:any):any {
    
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    console.log(array);
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
        row += headerList[index] + ',';
        
      }
      row = row.slice(0, -1);
      str += row + '\r\n';
      for (let i = 0; i < array.length; i++) {
        let line = (i+1)+'';
        for (let index in headerList) {
          let head = headerList[index];
          
          line += typeof(array[i][head]) != 'undefined' ? ',' + array[i][head] :',';
          console.log(line);
        }
        str += line + '\r\n';
    }
    return str;
}


  private getDataAPI():void { 
    const url:string = 'https://archive.org/metadata/TheAdventuresOfTomSawyer_201303';
    this.http.get(url).subscribe(apiData => (this.data = apiData));
    
  }
}
