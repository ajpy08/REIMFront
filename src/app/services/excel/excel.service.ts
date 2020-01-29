
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import { URL_SERVICIOS } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor(public http: HttpClient) { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    //console.log(json)
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'datos': worksheet }, SheetNames: ['datos'] };
    

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  
  excelToJSON(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('xlsx', archivo, archivo.name);
    const url = URL_SERVICIOS + '/exceltojson';
    return this.http.put(url, formData)
      .pipe(map((resp: any) => {
        swal('Excel leido con exito', archivo.name, 'success');
        return resp.excel;
      }));
  }

}
