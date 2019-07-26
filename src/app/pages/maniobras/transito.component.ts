import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Maniobra } from '../../models/maniobra.models';
import { ManiobraService } from '../../services/service.index';
import { ExcelService } from '../../services/service.index';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import * as Moment from 'moment';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY MMM DD',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMMM DD',
  },
};

declare var jQuery: any;
@Component({
  selector: 'app-transito',
  templateUrl: './transito.component.html',
  styles: [],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class TransitoComponent implements OnInit {
  date = new FormControl(moment());
  maniobras: any[] = [];
  data: any = {fechaCreado: ''};
  cargando = true;
  totalRegistros = 0;
  desde = 0;

  constructor(public _maniobraService: ManiobraService, public _excelService: ExcelService) { }

  ngOnInit() {
    this.cargarManiobras();
  }

  cargarManiobras() {
    this.cargando = true;
    this._maniobraService.getManiobrasTransito()
    .subscribe(maniobras => {
        if (maniobras.code !== 200) {
          this.totalRegistros = maniobras.total;
          this.maniobras = maniobras.maniobras;
          this.cargando = false;
        }
      },
      error => {
          console.log(<any>error);
      }
    );
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarManiobras();
  }

  public exportpdf() {
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }

  exportAsXLSX(): void {
    this._excelService.exportAsExcelFile(this.maniobras, 'maniobras');
  }

  buscarManiobra(termino: string) {
    // if (termino.length <= 0) {
    //   this.cargarManiobras();
    //   return;
    // }
    // this.cargando = true;
    // this._maniobraService.getManiobrasTransito(termino)
    // .subscribe( maniobras =>  this.maniobras = maniobras.maniobras );
  }

}



