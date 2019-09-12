import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Maniobra } from '../../models/maniobra.models';
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
import { MatPaginator, MatSort, MatTableDataSource, MatCheckbox } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

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
  //maniobras: any[] = [];
  //maniobrasSeleccionadas: string[] = [];
  maniobrasSinFactura: any[] = [];
  data: any = { fechaCreado: '' };
  cargando = true;
  totalRegistros = 0;

  displayedColumns = ['select', 'contenedor', 'tipo', 'lavado', 'grado', 'fechaingreso', 'operador', 'placa', 'transportista', 'reparaciones', 'factura', 'viaje', 'buque', 'peso', 'cliente', 'agencia'];
  dataSource: any;
  selection = new SelectionModel<Maniobra>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  checked = true;
  factura: string;
  fechaFiltroViaje: Date;
  viajes: Viaje[] = [];
  viaje: string = undefined;

  constructor(public _maniobraService: ManiobraService, public _viajeService: ViajeService,
    public _excelService: ExcelService) { }

  ngOnInit() {
    this.cargarViajes(new Date().toString());
    this.cargarManiobras(this.viaje);
    // if(this.checked) {
    //   console.log("Entre a sin factura:" + this.checked)
    //   this.cargarManiobrasSinFactura(this.checked);
    // }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.totalRegistros = this.dataSource.filteredData.length;
  }

  cargarManiobras(viaje?: string) {
    this.cargando = true;
      this._maniobraService.getManiobrasGral(viaje, "VACIO", "D")
        .subscribe(maniobras => {
          this.dataSource = new MatTableDataSource(maniobras.vacios);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalRegistros = maniobras.total;

          // if(this.checked) {
          //   console.log("Entre a sin factura:" + this.checked)
          //   this.cargarManiobrasSinFactura(this.checked);
          // }
        });
    this.cargando = false;
  }

  cargarManiobrasSinFactura(sinFactura: boolean) {
    this.maniobrasSinFactura;
    if (sinFactura) {
      console.log("Entre a sin factura otra vez:" + sinFactura)
      this.dataSource.data.forEach(m => {
        if (!m.facturaManiobra) {
          this.maniobrasSinFactura.push(m);
        }
      });
      this.dataSource = new MatTableDataSource(this.maniobrasSinFactura);
      this.totalRegistros = this.dataSource.length;
    } else {
      console.log("Entre a cargar todas otra vez:" + sinFactura)
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

  // todo(c: boolean) {
  //   this.maniobrasSeleccionadas = [];
  //   this.checked = c;
  //   this.dataSource.forEach(value => { this.getManiobrasSeleccionadas(value._id, c) })
  // }

  asignarFactura() {
    if (this.selection) {
      if (this.factura) {
        this.selection.selected.forEach(maniobra => {
          this._maniobraService.asignaFacturaManiobra(maniobra._id, this.factura).subscribe((maniobra2) => {
            maniobra.facturaManiobra = this.factura;
          });
        });
        this.factura = "";
      } else {
        swal('No puedes asignar una factura vacía', '', 'error');
      }
    } else {
      swal('Debes seleccionar por lo menos un elemento para asignar una factura', '', 'error');
    }
  }

  // getManiobrasSeleccionadas(id: string, checked: boolean) {
  //   if (checked) {
  //     this.maniobrasSeleccionadas.push(id);
  //   } else {
  //     var i = this.maniobrasSeleccionadas.indexOf(id);

  //     if (i !== -1) {
  //       this.maniobrasSeleccionadas.splice(i, 1);
  //     }
  //   }
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
    this._excelService.exportAsExcelFile(this.dataSource, 'maniobras');
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
}



