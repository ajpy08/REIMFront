import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Maniobra } from '../../models/maniobra.models';
import { ManiobraService, ViajeService } from '../../services/service.index';
import { ExcelService } from '../../services/service.index';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import * as Moment from 'moment';
import swal from 'sweetalert';
import { Viaje } from '../viajes/viaje.models';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  MatDialogConfig,
  MatTabChangeEvent,
  MatTabGroup
} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AsignarFacturaComponent } from './asignar-factura/asignar-factura.component';
import { Router } from '@angular/router';
import { FacturacionService } from '../facturacion/facturacion.service';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY MMM DD',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMMM DD'
  }
};

@Component({
  selector: 'app-vacios',
  templateUrl: './vacios.component.html',
  styles: [],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class VaciosComponent implements OnInit {
  date = new FormControl(moment());
  // maniobras: any[] = [];
  // maniobrasSeleccionadas: string[] = [];
  maniobrasSinFacturaVacios: any[] = [];
  maniobrasSinFacturaLavadoVacios: any[] = [];
  maniobrasSinFacturaReparacionVacios: any[] = [];

  maniobrasVaciosDescagadas: any[] = [];
  maniobrasVaciosLavadoDescagadas: any[] = [];
  maniobrasVaciosReparacionDescagadas: any[] = [];

  ManiobrasVaciosExcel = [];
  ManiobrasVaciosLavadoExcel = [];
  ManiobrasVaciosReparacionExcel = [];
  data: any = { fechaCreado: '' };
  cargando = true;
  totalRegistrosVacios = 0;
  totalRegistrosLavadoVacios = 0;
  totalRegistrosReparacionVacios = 0;

  displayedColumns = [
    'select',
    'actions',
    'cargaDescarga',
    'contenedor',
    'tipo',
    'lavado',
    'grado',
    'fLlegada',
    'operador',
    'placa',
    'transportista',
    'reparaciones',
    'facturaManiobra',
    'viaje',
    'buque',
    'peso',
    'cliente',
    'agencia',
    'estatus',
    'hDescarga',
    'hFinLavado'
  ];

  displayedColumnsLavado = [
    'select',
    'actions',
    'cargaDescarga',
    'contenedor',
    'tipo',
    'lavado',
    'grado',
    'fLlegada',
    'operador',
    'placa',
    'transportista',
    'reparaciones',
    'facturaManiobra',
    'viaje',
    'buque',
    'peso',
    'cliente',
    'agencia',
    'estatus',
    'hDescarga',
    'hFinLavado'
  ];

  displayedColumnsReparacion = [
    'select',
    'actions',
    'cargaDescarga',
    'contenedor',
    'tipo',
    'lavado',
    'grado',
    'fLlegada',
    'operador',
    'placa',
    'transportista',
    'reparaciones',
    'facturaManiobra',
    'viaje',
    'buque',
    'peso',
    'cliente',
    'agencia',
    'estatus',
    'hDescarga',
    'hFinLavado'
  ];

  dataSourceVacios: any;
  dataSourceLavadoVacios: any;
  dataSourceReparacionVacios: any;
  selectionVacios = new SelectionModel<Maniobra>(true, []);
  selectionLavadoVacios = new SelectionModel<Maniobra>(true, []);
  selectionReparacionVacios = new SelectionModel<Maniobra>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('MatPaginatorLavado', { read: MatPaginator })
  MatPaginatorLavado: MatPaginator;
  @ViewChild('MatSortLavado') MatSortLavado: MatSort;

  @ViewChild('MatPaginatorReparacion', { read: MatPaginator })
  MatPaginatorReparacion: MatPaginator;
  @ViewChild('MatSortReparacion') MatSortReparacion: MatSort;

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  checkedVacios = true;
  checkedHDescargaVacios = true;
  checkedYaLavados = false;

  checkedLavadoVacios = true;
  checkedHDescagaL = true;
  checkedYaLavadosL = false;
  checkedConReparacion = false;

  checkedReparacionVacios = true;
  checkedHDescagaR = true;
  checkedYaLavadosR = false;

  facturaVacios: string;
  facturaLavadoVacios: string;
  facturaReparacionVacios: string;
  fechaFiltroViaje: Date;
  viajes: Viaje[] = [];
  viaje: string = undefined;
  viajeLavado: string = undefined;
  viajeReparacion: string = undefined;
  CD: string = undefined;
  // filtrarCD = new FormControl(false);
  // animal: string;
  // name: string;

  constructor(
    public _maniobraService: ManiobraService,
    public _viajeService: ViajeService,
    public _excelService: ExcelService,
    public matDialog: MatDialog,
    private router: Router,
    private facturacionService: FacturacionService
  ) { }

  ngOnInit() {
    this.cargarViajes(new Date().toString());

    this.consulta();

    const indexTAB = localStorage.getItem('VacioTabs');
    if (indexTAB) {
      // tslint:disable-next-line: radix
      this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
    }
  }

  consulta() {
    this.consultaManiobrasDescargaVacios();

    this.consultaManiobrasDescargaVaciosLavado();

    this.consultaManiobrasDescargaVaciosReparacion();
  }

  consultaManiobrasDescargaVacios() {
    const cargaDescarga = 'D';
    this._maniobraService
      .getManiobrasVacios(
        cargaDescarga,
        this.viaje,
        'VACIO',
        false,
        null,
        this.checkedVacios,
        this.checkedHDescargaVacios,
        this.checkedYaLavados
      )
      .subscribe(maniobras => {
        this.dataSourceVacios = new MatTableDataSource(maniobras.maniobras);
        this.dataSourceVacios.sort = this.sort;
        this.dataSourceVacios.paginator = this.paginator;
        this.totalRegistrosVacios = maniobras.total;
      });
  }

  consultaManiobrasDescargaVaciosLavado() {
    const cargaDescarga = 'D';
    this._maniobraService
      .getManiobrasVacios(
        cargaDescarga,
        this.viaje,
        'VACIO',
        true,
        this.checkedConReparacion,
        this.checkedLavadoVacios,
        this.checkedHDescagaL,
        this.checkedYaLavadosL
      )
      .subscribe(maniobras => {
        this.dataSourceLavadoVacios = new MatTableDataSource(
          maniobras.maniobras
        );
        this.dataSourceLavadoVacios.sort = this.MatSortLavado;
        this.dataSourceLavadoVacios.paginator = this.MatPaginatorLavado;
        this.totalRegistrosLavadoVacios = maniobras.total;
      });
  }

  consultaManiobrasDescargaVaciosReparacion() {
    const cargaDescarga = 'D';
    this._maniobraService
      .getManiobrasVacios(
        cargaDescarga,
        this.viaje,
        'VACIO',
        false,
        true,
        this.checkedReparacionVacios,
        this.checkedHDescagaR,
        this.checkedYaLavadosR
      )
      .subscribe(maniobras => {
        this.dataSourceReparacionVacios = new MatTableDataSource(
          maniobras.maniobras
        );
        this.dataSourceReparacionVacios.sort = this.MatSortReparacion;
        this.dataSourceReparacionVacios.paginator = this.MatPaginatorReparacion;
        this.totalRegistrosReparacionVacios = maniobras.total;
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    if (this.dataSourceVacios && this.dataSourceVacios.data.length > 0) {
      this.dataSourceVacios.filter = filterValue;
      this.totalRegistrosVacios = this.dataSourceVacios.filteredData.length;
    } else {
      console.error('Error al filtrar el dataSource de Vacios');
    }

    // this.dataSourceVacios.filter = filterValue;
    // this.totalRegistrosVacios = this.dataSourceVacios.filteredData.length;
  }

  applyFilterLavados(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    if (
      this.dataSourceLavadoVacios &&
      this.dataSourceLavadoVacios.data.length > 0
    ) {
      this.dataSourceLavadoVacios.filter = filterValue;
      this.totalRegistrosLavadoVacios = this.dataSourceLavadoVacios.filteredData.length;
    } else {
      console.error('Error al filtrar el dataSource de Lavado Vacios');
    }

    // this.dataSourceLavadoVacios.filter = filterValue;
    // this.totalRegistrosLavadoVacios = this.dataSourceLavadoVacios.filteredData.length;
  }

  applyFilterReparaciones(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    if (this.dataSourceReparacionVacios && this.dataSourceReparacionVacios.data.length > 0) {
      this.dataSourceReparacionVacios.filter = filterValue;
      this.totalRegistrosReparacionVacios = this.dataSourceReparacionVacios.filteredData.length;
    } else {
      console.error('Error al filtrar el dataSource de Reparaciones Vacios');
    }

    // this.dataSourceReparacionVacios.filter = filterValue;
    // this.totalRegistrosReparacionVacios = this.dataSourceReparacionVacios.filteredData.length;
  }

  cargarViajes(anio: string) {
    this.cargando = true;
    this._viajeService.getViajesA(anio).subscribe(viajes => {
      this.viajes = viajes.viajes;
      this.cargando = false;
    });
  }

  public exportpdf() {
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }

  CreaDatosVaciosExcel(datos, tipo) {
    datos.forEach(m => {
      let reparaciones = '';

      m.reparaciones.forEach(r => {
        reparaciones += r.reparacion + ', ';
      });
      reparaciones = reparaciones.substring(0, reparaciones.length - 2);

      const maniobra = {
        cargaDescarga: m.cargaDescarga,
        contenedor: m.contenedor,
        tipo: m.tipo,
        lavado: m.lavado,
        lavadoObservacion: m.lavadoObservacion,
        grado: m.grado,
        fLlegada: m.fLlegada !== undefined ? m.fLlegada.substring(0, 10) : '',
        Operador:
          m.operador &&
            m.operador.nombre &&
            m.operador.nombre !== undefined &&
            m.operador.nombre &&
            m.operador.nombre !== ''
            ? m.operador.nombre
            : '' && m.operador.nombre,
        placa: m.camion !== undefined ? m.camion.placa : '',
        Transportista:
          m.transportista &&
            m.transportista.nombreComercial &&
            m.transportista.nombreComercial !== undefined &&
            m.transportista.nombreComercial !== ''
            ? m.transportista.nombreComercial
            : '' && m.transportista.nombreComercial,
        reparaciones: reparaciones,
        reparacionesObservacion: m.reparacionesObservacion,
        facturaManiobra: m.facturaManiobra,
        Viaje:
          m.viaje &&
            m.viaje.viaje &&
            m.viaje.viaje !== undefined &&
            m.viaje.viaje !== ''
            ? m.viaje.viaje
            : '' && m.viaje.viaje,
        Buque:
          m.viaje &&
            m.viaje !== undefined &&
            m.viaje.buque &&
            m.viaje.buque &&
            m.viaje.buque !== undefined &&
            m.viaje.buque.nombre !== ''
            ? m.viaje.buque.nombre
            : '' && m.viaje.buque.nombre,
        peso: m.peso,
        Cliente:
          m.cliente &&
          m.cliente.nombreComercial &&
          m.cliente.nombreComercial !== undefined &&
          m.cliente.nombreComercial !== '' &&
          m.cliente.nombreComercial,
        Agencia:
          m.agencia &&
          m.agencia.nombreComercial &&
          m.agencia.nombreComercial !== undefined &&
          m.agencia.nombreComercial !== '' &&
          m.agencia.nombreComercial,
        estatus: m.estatus,
        hDescarga: m.hDescarga,
        fFinLavado: m.fFinLavado,
        fAlta: m.fAlta.substring(0, 10)

        // folio: m.folio,
        // camion: m.camion,
        // destinatario: m.destinatario,
        // hLlegada: m.hLlegada,
        // hEntrada: m.hEntrada,
        // facturarA: m.facturarA,
        // correoFac: m.correoFac,
        // correoOp: m.correoOp,
        // solicitud: m.solicitud,
        // hSalida: m.hSalida,
        // descargaAutorizada: m.descargaAutorizada,
        // fTerminacionLavado: m.fTerminacionLavado,
        // hTerminacionLavado: m.hTerminacionLavado,
        // fTerminacionReparacion: m.fTerminacionReparacion,
        // hTerminacionReparacion: m.hTerminacionReparacion,
        // maniobraAsociada: m.maniobraAsociada,
        // fAsignacionPapeleta: m.fAsignacionPapeleta,
        // fExpiracionPapeleta: m.fExpiracionPapeleta,
        // usuarioAlta: m.usuarioAlta,
      };

      if (tipo === 'Vacios') {
        this.ManiobrasVaciosExcel.push(maniobra);
      } else {
        if (tipo === 'VaciosLavado') {
          this.ManiobrasVaciosLavadoExcel.push(maniobra);
        } else {
          if (tipo === 'VaciosReparacion') {
            this.ManiobrasVaciosReparacionExcel.push(maniobra);
          }
        }
      }
    });
  }

  exportAsXLSXVacios(): void {
    this.CreaDatosVaciosExcel(this.dataSourceVacios.data, 'Vacios');
    if (this.ManiobrasVaciosExcel) {
      this._excelService.exportAsExcelFile(
        this.ManiobrasVaciosExcel,
        'Maniobras de Vacios Descarga'
      );
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  exportAsXLSXVaciosLavado(): void {
    this.CreaDatosVaciosExcel(this.dataSourceLavadoVacios.data, 'VaciosLavado');
    if (this.ManiobrasVaciosLavadoExcel) {
      this._excelService.exportAsExcelFile(
        this.ManiobrasVaciosLavadoExcel,
        'Maniobras de Vacios Lavado'
      );
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  exportAsXLSXVaciosReparacion(): void {
    this.CreaDatosVaciosExcel(
      this.dataSourceReparacionVacios.data,
      'VaciosReparacion'
    );
    if (this.ManiobrasVaciosReparacionExcel) {
      this._excelService.exportAsExcelFile(
        this.ManiobrasVaciosReparacionExcel,
        'Maniobras de Vacios Reparación'
      );
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedVacios() {
    const numSelected = this.selectionVacios.selected.length;
    const numRows = this.dataSourceVacios.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleVacios() {
    this.isAllSelectedVacios()
      ? this.selectionVacios.clear()
      : this.dataSourceVacios.data.forEach(row =>
        this.selectionVacios.select(row)
      );
  }

  isAllSelectedLavadoVacios() {
    const numSelected = this.selectionLavadoVacios.selected.length;
    const numRows = this.dataSourceLavadoVacios.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleLavadoVacios() {
    this.isAllSelectedLavadoVacios()
      ? this.selectionLavadoVacios.clear()
      : this.dataSourceLavadoVacios.data.forEach(row =>
        this.selectionLavadoVacios.select(row)
      );
  }

  isAllSelectedReparacionVacios() {
    const numSelected = this.selectionReparacionVacios.selected.length;
    const numRows = this.dataSourceReparacionVacios.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleReparacionVacios() {
    this.isAllSelectedReparacionVacios()
      ? this.selectionReparacionVacios.clear()
      : this.dataSourceReparacionVacios.data.forEach(row =>
        this.selectionReparacionVacios.select(row)
      );
  }

  openDialogVacios() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.selectionVacios;
    const dialogRef = this.matDialog.open(AsignarFacturaComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectionVacios = new SelectionModel<Maniobra>(true, []);
      }
    });
  }

  openDialogVaciosLavado() {
    // console.log("Entre Lavado")
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.selectionLavadoVacios;
    const dialogRef = this.matDialog.open(AsignarFacturaComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // if (this.checkedLavadoVacios) {
        this.selectionLavadoVacios = new SelectionModel<Maniobra>(true, []);
        // this.filtraManiobrasDescargaVaciosLavado(this.checkedLavadoVacios);
        // if (this.checkedHDescagaL && this.dataSourceLavadoVacios.data.length > 0) {
        //   this.cargarManiobrasDescargadosVaciosLavados(this.checkedHDescagaL);
        // }
        // }
      }
    });
  }

  openDialogVaciosReparacion() {
    // console.log("Entre Reparacion")
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.selectionReparacionVacios;
    const dialogRef = this.matDialog.open(AsignarFacturaComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // if (this.checkedReparacionVacios) {
        this.selectionReparacionVacios = new SelectionModel<Maniobra>(true, []);
        // this.filtraManiobrasDescargaVaciosReparacion(this.checkedReparacionVacios);
        // if (this.checkedHDescagaR && this.dataSourceReparacionVacios.data.length > 0) {
        //   this.cargarManiobrasDescargadosVaciosReparaciones(this.checkedHDescagaR);
        // }
        // }
      }
    });
  }
  onLinkClick(event: MatTabChangeEvent) {
    localStorage.setItem('VacioTabs', event.index.toString());
  }
  corregirContenedor(id) {
    this._maniobraService.corrigeContenedor(id).subscribe(res => {
      id.contenedor = res.contenedor;
    });
  }

  // detalle(id: string) {
  //   localStorage.setItem('history', '/vacios');

  //   this.router.navigate(['/maniobras/maniobra/' + id + '/detalle']);
  // }

  open(id: string) {
    let history;
    const array = [];
    // Si tengo algo en localStorage en la variable history lo obtengo
    if (localStorage.getItem('historyArray')) {
      // asigno a mi variable history lo que obtengo de localStorage (historyArray)
      history = JSON.parse(localStorage.getItem('historyArray'));

      // realizo este ciclo para asignar los valores del JSON al Array
      // tslint:disable-next-line: forin
      for (const i in history) {
        array.push(history[i]);
      }
    }
    // Agrego mi nueva ruta al array
    array.push('/vacios');

    // sobreescribo la variable historyArray de localStorage con el nuevo JSON que incluye ya, la nueva ruta.
    localStorage.setItem('historyArray', JSON.stringify(array));

    // Voy a pagina.
    this.router.navigate(['/maniobras/maniobra/' + id + '/detalle']);
  }

  facturar() {
    if (this.validaClienteViaje(this.selectionVacios.selected)) {
      //////////////// DATOS GENERALES ////////////////
    // Serie (default)
    // Folio (default)
    // Sucursal (default)
    // Forma de Pago (default)
    // Moneda (default)
    this.facturacionService.IE = 'I';
    // Fecha (default)
    /////////////////////////////////////////////////

    /////////////////// RECEPTOR ////////////////////
    this.facturacionService.receptor = this.selectionVacios.selected[0].naviera;
    this.facturacionService.tipo = 'Descarga';
    /////////////////////////////////////////////////

    /////////////////// CONCEPTOS ///////////////////
    // this.facturacionService.productoServ = '5e876ada96bb521c1429f763';
    this.facturacionService.productoServ = '5e876b2396bb521c1429f765';
    this.selectionVacios.selected.forEach(m => {
      this.facturacionService.maniobras.push(m._id);
    });
    // this.facturacionService.maniobras = this.selectionVacios.selected;
    /////////////////////////////////////////////////

    this.router.navigate(['/cfdi/nuevo']);
    } else {
      swal('Las maniobras seleccionadas son de diferente NAVIERA o distinto VIAJE', '', 'error');
    }
  }

  validaClienteViaje(maniobras) {
    let naviera;
    let viaje;
    let ok = true;
    maniobras.forEach(m => {
      if (naviera === undefined) {
        naviera = m.naviera;
      } else {
        if (naviera !== m.naviera) {
          ok = false;
        }
      }

      if (viaje === undefined) {
        viaje = m.viaje._id;
      } else {
        if (viaje !== m.viaje._id) {
          ok = false;
        }
      }
    });
    return ok;
  }
}
