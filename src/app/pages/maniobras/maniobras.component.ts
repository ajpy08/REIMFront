import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Maniobra } from '../../models/maniobras.models';
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
import { Router } from '@angular/router';
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
  selector: 'app-maniobras',
  templateUrl: './maniobras.component.html',
  styles: [],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ManiobrasComponent implements OnInit {
  date = new FormControl(moment());
   // tslint:disable-next-line:typedef-whitespace
   maniobras: Maniobra[] = [];
   data: any = {fechaCreado: ''};
   // tslint:disable-next-line:no-inferrable-types
   cargando: boolean = true;
   // tslint:disable-next-line:no-inferrable-types
   totalRegistros: number = 0;
   // tslint:disable-next-line:no-inferrable-types
   desde: number = 0;
   constructor(public _maniobraService: ManiobraService, public _excelService: ExcelService, private router: Router) { }

  ngOnInit() {
    this.cargarManiobras();
  }
  public exportpdf() {
    // tslint:disable-next-line:no-var-keyword
    // tslint:disable-next-line:prefer-const
    let data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      // tslint:disable-next-line:prefer-const
      let imgWidth = 208;
        // tslint:disable-next-line:prefer-const
      let pageHeight = 295;
        // tslint:disable-next-line:prefer-const
      let imgHeight = canvas.height * imgWidth / canvas.width;
        // tslint:disable-next-line:prefer-const
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
        // tslint:disable-next-line:prefer-const
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
        // tslint:disable-next-line:prefer-const
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }

  exportAsXLSX(): void {
    // console.log(this.data);
    this._excelService.exportAsExcelFile(this.maniobras, 'maniobras');
  }

  cargarManiobras() {
    this.cargando = true;
    this._maniobraService.cargarManiobras(this.desde)
    .subscribe(maniobras =>
      // this.totalRegistros = resp.total;
      this.maniobras = maniobras
    );
}

  cambiarDesde(valor: number) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    console.log(desde);
    if (desde >= this._maniobraService.totalManiobras) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarManiobras();

  }

  buscarManiobra(termino: string) {
    if (termino.length <= 0) {
      this.cargarManiobras();
      return;
    }
    this.cargando = true;
    this._maniobraService.buscarManiobra(termino)
    .subscribe( maniobras =>  this.maniobras = maniobras );
  }

  borrarManiobra( maniobras: Maniobra ) {

    this._maniobraService.borrarManiobra( maniobras._id )
            .subscribe( () =>  this.cargarManiobras() );

  }

  buscarManiobraFecha(fechaInicio: string, fechaFin: string) {
    console.log(fechaInicio);
    console.log(fechaFin);
    if (fechaInicio.length <= 0 || fechaFin.length <= 0) {
      this.cargarManiobras();
      return;
    }
    this.cargando = true;
    this._maniobraService.buscarManiobraFecha(fechaInicio, fechaFin)
    .subscribe( maniobras =>  this.maniobras = maniobras );
  }

  }



