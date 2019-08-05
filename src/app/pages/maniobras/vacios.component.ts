import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Maniobra } from './maniobra.models';
import { ManiobraService, ViajeService } from '../../services/service.index';
import { ExcelService } from '../../services/service.index';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import * as Moment from 'moment';
import swal from 'sweetalert';
import { Viaje } from '../viajes/viaje.models';

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
  selector: 'app-vacios',
  templateUrl: './vacios.component.html',
  styles: [],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class VaciosComponent implements OnInit {
  date = new FormControl(moment());
  maniobras: any[] = [];
  maniobrasSeleccionadas: string[] = [];
  maniobrasSinFactura: any[] = [];
  data: any = { fechaCreado: '' };
  cargando = true;
  totalRegistros = 0;
  desde = 0;
  checked = false;
  factura: string;
  fechaFiltroViaje: Date;
  viajes: Viaje[] = [];
  viaje: string = undefined;

  constructor(public _maniobraService: ManiobraService, public _viajeService: ViajeService, 
    public _excelService: ExcelService) { }

  ngOnInit() {
    this.fechaFiltroViaje = new Date();
    this.fechaFiltroViaje.setHours(0, 0, 0);
    //console.log('La fecha es: ' + this.fechaFiltroViaje.toString());
    this.cargarViajes(this.fechaFiltroViaje.toString());
    this.cargarManiobras(this.viaje);
  }

  cargarManiobras(viaje?: string) {
    this.cargando = true;
    this._maniobraService.getManiobrasGral(viaje, "VACIO", "D")
      .subscribe(maniobras => {
        this.totalRegistros = maniobras.total;
        this.maniobras = maniobras.vacios;
        this.cargando = false;
      });
  }

  cargarManiobrasSinFactura(sinFactura: boolean){    
    this.maniobrasSinFactura;
    if(sinFactura){
      this.maniobras.forEach(m => {
        if(!m.facturaManiobra){
          this.maniobrasSinFactura.push(m);
        }
      });
      this.maniobras = this.maniobrasSinFactura;
      this.totalRegistros = this.maniobras.length;
    } else {
      this.cargarManiobras(this.viaje);
    }
  }

  cargarViajes(anio: string) {
    this.cargando = true;
    this._viajeService.getViajesA(anio)
      .subscribe(viajes => {
        this.viajes = viajes.viajes;
        this.cargando = false;
      });
  }

  todo(c: boolean) {
    this.maniobrasSeleccionadas = [];
    this.checked = c;
    this.maniobras.forEach(value => { this.getManiobrasSeleccionadas(value._id, c) })

    // console.log(c)
    // console.log(this.maniobrasSeleccionadas)
  }

  asignarFactura() {
    if (this.maniobrasSeleccionadas) {
      if (this.factura) {
        this.maniobrasSeleccionadas.forEach(maniobra => {
          //console.log(maniobra)
          this._maniobraService.asignaFacturaManiobra(maniobra, this.factura).subscribe((maniobra) => { });
        });
        this.factura = "";
        //this.cargarManiobras(this.viaje);
      } else {
        swal('No puedes asignar una factura vacía', '', 'error');
      }
    } else {
      swal('Debes seleccionar por lo menos un elemento para asignar una factura', '', 'error');
    }
  }

  getManiobrasSeleccionadas(id: string, checked: boolean) {
    if (checked) {
      this.maniobrasSeleccionadas.push(id);
    } else {
      var i = this.maniobrasSeleccionadas.indexOf(id);

      if (i !== -1) {
        this.maniobrasSeleccionadas.splice(i, 1);
      }
    }
    // console.log(checked)
    // console.log(this.maniobrasSeleccionadas)
  }


  // cambiarDesde(valor: number) {
  //   const desde = this.desde + valor;
  //   if (desde >= this.totalRegistros) {
  //     return;
  //   }
  //   if (desde < 0) {
  //     return;
  //   }
  //   this.desde += valor;
  //   this.cargarManiobras();
  // }

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



