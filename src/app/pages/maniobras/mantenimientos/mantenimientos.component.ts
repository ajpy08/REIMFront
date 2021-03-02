import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import * as io from 'socket.io-client';
import { MantenimientoService, ExcelService } from '../../../services/service.index';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatSnackBar} from '@angular/material/snack-bar';
import { URL_SERVICIOS } from '../../../../environments/environment';

import * as _moment from 'moment';
import { Mantenimiento } from './mantenimiento.models';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: ['l', 'L'],
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


declare var swal: any;
@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  { provide: MAT_DATE_LOCALE, useValue: 'es-mx' }]
})
export class MantenimientosComponent implements OnInit, OnDestroy {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;


  mantenimientosExcel = [];
  
  incluirFinalizados: boolean;
  filtrarFechas: boolean;
  filtroFechaIni: _moment.Moment;
  filtroFechaFin: _moment.Moment;
  durationInSeconds: number = 4;

  cargandoR: boolean;
  cargandoL: boolean;
  cargandoA: boolean;

  totalReparaciones = 0;
  totalLavados = 0;
  totalAcondicionamientos = 0;

  tablaCargarR = false;
  tablaCargarL = false;
  tablaCargarA = false;

  activo = false;

  acttrue = false;

  displayedColumnsReparaciones = ['actions', 'folio','observacionesCompleto', 'maniobra.contenedor', 'maniobra.tipo', 'maniobra.peso', 'maniobra.grado','maniobra.viaje.buque.nombre','maniobra.viaje.viaje', 'fInicial', 'fFinal', 'finalizado'];
  displayedColumnsLavados = ['actions', 'folio', 'observacionesCompleto', 'tipoLavado','maniobra.contenedor', 'maniobra.tipo', 'maniobra.peso',  'maniobra.grado','maniobra.viaje.buque.nombre','maniobra.viaje.viaje','fInicial', 'fFinal', 'finalizado'];
  displayedColumnsAcondicionamientos = ['actions', 'folio', 'observacionesCompleto','cambioGrado','maniobra.contenedor', 'maniobra.tipo', 'maniobra.peso',  'maniobra.grado','maniobra.viaje.buque.nombre','maniobra.viaje.viaje', 'fInicial', 'fFinal', 'finalizado'];

  dtReparaciones: MatTableDataSource<any>;
  dtLavados: MatTableDataSource<any>;
  dtAcondicionamientos: MatTableDataSource<any>;

  socket = io(URL_SOCKET_IO, PARAM_SOCKET);
  
  
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  
  
  @ViewChild(MatSort) sort: MatSort;
 
  @ViewChild('pagReparaciones', {read: MatPaginator  }) pagReparaciones: MatPaginator;
  @ViewChild('pagLavados', { read: MatPaginator }) pagLavados: MatPaginator;
  @ViewChild('pagAcondicionamientos', { read: MatPaginator }) pagAcondicionamientos: MatPaginator;

  @ViewChild('sortReparaciones') sortReparaciones: MatSort;
  @ViewChild('sortLavados') sortLavados: MatSort;
  @ViewChild('sortAcondicionamientos') sortAcondicionamientos: MatSort;

  
  constructor(
    private _mantenimientoService: MantenimientoService,
    private _excelService: ExcelService,
    private _snackBar: MatSnackBar) {
    
    this.incluirFinalizados = false;
    this.filtroFechaIni = moment().local().startOf('day');
    this.filtroFechaFin = moment().local().startOf('day');
    this.filtrarFechas = false;
    
    this.cargandoR = true;
    this.cargandoL = true;
    this.cargandoA = true;
    
  }

  ngOnInit() {

    localStorage.removeItem('historyArray');
    const indexTAB = localStorage.getItem('MantenimientosTabs');
    if (localStorage.getItem('MantenimientosTabs')) 
      if (indexTAB) this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
      else this.tabGroup.selectedIndex = 1;
    if (localStorage.getItem('MantenimientosincluirFinalizados') && localStorage.getItem('MantenimientosincluirFinalizados')==="true") this.incluirFinalizados = true;
    if (localStorage.getItem('MantenimientosfiltrarFechas') && localStorage.getItem('MantenimientosfiltrarFechas')==="true") this.filtrarFechas = true;
    if (localStorage.getItem('MantenimientosfiltroFechaIni')) this.filtroFechaIni = moment(localStorage.getItem('MantenimientosfiltroFechaIni'));
    if (localStorage.getItem('MantenimientosfiltroFechaFin')) this.filtroFechaFin = moment(localStorage.getItem('MantenimientosfiltroFechaFin'));

    this.cargarReparaciones();
    this.cargarLavados();
    this.cargarAcondicionamientos();

    // this.socket.on('new-mantenimiento', function (data: any) {
    //   this.filtrado(this.activo);
    // }.bind(this));

    // this.socket.on('update-mantenimiento', function (data: any) {
    //   if (data.data._id) {
    //     this.filtrado(this.activo);
    //   }
    // }.bind(this));

    // this.socket.on('delete-mantenimiento', function (data: any) {
    //   this.filtrado(this.activo);
    // }.bind(this));
  }



  ngOnDestroy() {
    // this.socket.removeListener('delete-mantenimiento');
    // this.socket.removeListener('update-mantenimiento');
    // this.socket.removeListener('new-mantenimiento');
  }


  applyFilterReparaciones(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dtReparaciones && this.dtReparaciones.data.length > 0) {
      this.dtReparaciones.filter = filterValue;
      this.totalReparaciones = this.dtReparaciones.filteredData.length;
      this.tablaCargarR = this.dtReparaciones.filteredData.length === 0 ? true : false;
    } else {
      console.error('No se puede filtrar en un datasource vacío');
    }
    this.dtReparaciones.filter = filterValue;
    this.totalReparaciones = this.dtReparaciones.filteredData.length;
  }

  applyFilterLavados(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    if (this.dtLavados && this.dtLavados.data.length > 0) {
      this.dtLavados.filter = filterValue;
      this.totalLavados = this.dtLavados.filteredData.length;
      this.tablaCargarL = this.dtLavados.filteredData.length === 0 ? true : false;
    } else {
      console.error('No se puede filtrar en un datasource vacío');
    }
    this.dtLavados.filter = filterValue;
    this.totalLavados = this.dtLavados.filteredData.length;
  }

  Filtro(): (data: any, filter: string) => boolean {
    const filterFunction = function (data, filter): boolean {
      const dataStr =
        data.folio ? data.folio.toLowerCase() : '' +
        data.observacionesCompleto.toLowerCase() +
        data.tipoLavado ? data.tipoLavado.toLowerCase() : '' +
        (data.maniobra ? data.maniobra.contenedor.toLowerCase() +  data.maniobra.tipo.toLowerCase() + data.maniobra.peso.toLowerCase()+ data.maniobra.grado.toLowerCase() : '') +
        (data.maniobra.viaje ? data.maniobra.viaje.buque.nombre.toLowerCase() + data.maniobra.viaje.viaje.toLowerCase() : '');
      return dataStr.indexOf(filter) !== -1;
    };
    
    return filterFunction;
  }

  applyFilterAcondicionamientos(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    if (this.dtAcondicionamientos && this.dtAcondicionamientos.data.length > 0) {
      this.dtAcondicionamientos.filter = filterValue;
      this.totalLavados = this.dtAcondicionamientos.filteredData.length;
      this.tablaCargarA = this.dtAcondicionamientos.filteredData.length === 0 ? true : false;
    } else {
      console.error('No se puede filtrar en un datasource vacío');
    }

    this.dtAcondicionamientos.filter = filterValue;
    this.totalAcondicionamientos = this.dtAcondicionamientos.filteredData.length;
  }


  cargarReparaciones() {
    this.cargandoR = true;
    this._mantenimientoService.getMantenimientosxTipo("REPARACION", this.incluirFinalizados ? "TODOS" : "PENDIENTES", this.filtrarFechas ? this.filtroFechaIni.utc().format('DD-MM-YYYY') : null, this.filtrarFechas ? this.filtroFechaFin.utc().format('DD-MM-YYYY') : null).subscribe(mant => {
      
      this.dtReparaciones = new MatTableDataSource(mant.mantenimientos);
      this.tablaCargarR = mant.mantenimientos.length === 0? true : false;
      this.dtReparaciones.sortingDataAccessor = (item, property) => {
        if (property.includes('.')) {
          return property
            .split('.')
            .reduce((o, i) => (o ? o[i] : undefined), item);
        }
        return item[property];
      };
      this.dtReparaciones.filterPredicate = this.Filtro();
      this.totalReparaciones = mant.mantenimientos.length;
      setTimeout(() => {this.dtReparaciones.paginator = this.pagReparaciones,this.dtReparaciones.sort = this.sortReparaciones});
      this.cargandoR = false;
    });
  }

  cargarLavados() {
    this.cargandoL = true;
    this._mantenimientoService.getMantenimientosxTipo("LAVADO", this.incluirFinalizados ? "TODOS" : "PENDIENTES", this.filtrarFechas ? this.filtroFechaIni.utc().format('DD-MM-YYYY') : null, this.filtrarFechas ? this.filtroFechaFin.utc().format('DD-MM-YYYY') : null).subscribe(mant => {
      this.dtLavados = new MatTableDataSource(mant.mantenimientos);
      this.tablaCargarL = mant.mantenimientos.length === 0? true : false;
      this.dtLavados.sortingDataAccessor = (item, property) => {
        if (property.includes('.')) {
          return property
            .split('.')
            .reduce((o, i) => (o ? o[i] : undefined), item);
        }
        return item[property];
      };
      this.dtLavados.filterPredicate = this.Filtro();
      this.totalLavados = mant.mantenimientos.length;
      setTimeout(() => {this.dtLavados.paginator = this.pagLavados,this.dtLavados.sort = this.sortLavados});
      this.cargandoL = false;
    });

  }

  cargarAcondicionamientos() {
    this.cargandoA = true;
    this._mantenimientoService.getMantenimientosxTipo("ACONDICIONAMIENTO", this.incluirFinalizados ? "TODOS" : "PENDIENTES", this.filtrarFechas ? this.filtroFechaIni.utc().format('DD-MM-YYYY') : null, this.filtrarFechas ? this.filtroFechaFin.utc().format('DD-MM-YYYY') : null).subscribe(mant => {
      this.dtAcondicionamientos = new MatTableDataSource(mant.mantenimientos);
      this.tablaCargarA = mant.mantenimientos.length === 0? true : false;
      this.dtAcondicionamientos.sortingDataAccessor = (item, property) => {
        if (property.includes('.')) {
          return property
            .split('.')
            .reduce((o, i) => (o ? o[i] : undefined), item);
        }
        return item[property];
      };
      this.dtAcondicionamientos.filterPredicate = this.Filtro();
      this.totalAcondicionamientos = mant.mantenimientos.length;
      setTimeout(() => {this.dtAcondicionamientos.paginator = this.pagAcondicionamientos,this.dtAcondicionamientos.sort = this.sortAcondicionamientos});
      this.cargandoA = false;
    });

  }


  onLinkClick(event: MatTabChangeEvent) {
    localStorage.setItem('MantenimientosTabs', event.index.toString());
  }

  onChangeCheckFinalizados(event) {
    this.cargarReparaciones();
    this.cargarLavados();
    this.cargarAcondicionamientos();
    localStorage.setItem('MantenimientosincluirFinalizados', event.checked);
    
  }
  onChangeFiltroFechas(event) {
    this.cargarReparaciones();
    this.cargarLavados();
    this.cargarAcondicionamientos();
    localStorage.setItem('MantenimientosfiltrarFechas', event.checked);
  }
  onChangeDate(tipo:string,event: MatDatepickerInputEvent<Date>) {
    //this.events.push(`${type}: ${event.value}`);
    this.cargarReparaciones();
    this.cargarLavados();
    this.cargarAcondicionamientos();
    if (tipo==="fInicial") localStorage.setItem('MantenimientosfiltroFechaIni', event.value.toString());
    else localStorage.setItem('MantenimientosfiltroFechaFin', event.value.toString());

  }
  
  eliminaMantenimiento(tipo:string,id) {
    this._mantenimientoService.eliminaMantenimiento(id).subscribe(mantenimientos => {
      if (tipo==="reparaciones") this.cargarReparaciones();
      if (tipo==="lavados") this.cargarLavados();
      if (tipo==='acondicionamientos') this.cargarAcondicionamientos();
      this.openSnackBar(mantenimientos.mensaje,'Cerrar');
    }, error => {
      this.openSnackBar(error.error.mensaje,'Cerrar');
      // this.mensajeError = error.error.mensaje;
      // this.mensajeExito = '';
      
    });

  }

  
  onChangeFinaliza(event , idMantenimiento: string) {
  swal({
      title: '¿Esta seguro de esta acción?',
      text: event.checked ? 'El mantenimiento sera finalizado y el contenedor estara disponible ' : 'El mantenimiento quedara de nuevo en proceso y el contenedor ya no estará disponible',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(ok => {
      if (ok) {
        this._mantenimientoService
          .finalizaMantenimiento(idMantenimiento, event.checked).subscribe(res => {
            this.openSnackBar(res.mensaje,'');
            // this.mensajeExito = res.mensaje;
            // this.mensajeError = '';
            
          }, error => {
            this.openSnackBar(error.error.mensaje,'');
            // this.mensajeError = error.error.mensaje;
            // this.mensajeExito = '';
            event.source.checked = !event.checked;
          });
      }
      else {
        event.source.checked = !event.checked;
      }
    });
  }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration:this.durationInSeconds * 2000,
    });
  }

  
  abrePDF(idMantenimiento: string, nameFolio: string)
  {
    return URL_SERVICIOS + '/mantenimientos/mantenimiento/'+ idMantenimiento + "/descarga_pdf_folio/" + nameFolio;
  }

  CreaDatosExcel(datos) {
    datos.forEach(b => {
      const reg = {
        Folio: b.folio,
        Observaciones: b.observacionesCompleto,
        Contenedor: b.maniobra.contenedor,
        Tipo: b.maniobra.tipo,
        Peso: b.maniobra.peso,
        Grado: b.maniobra.grado,
        Buque: b.maniobra.viaje ? b.maniobra.viaje.buque.nombre : '',
        Viaje: b.maniobra.viaje ? b.maniobra.viaje.viaje : '',
        Inicio: b.fInicial ? b.fInicial.substring(0, 10):"",
        Fin: b.fFinal ? b.fFinal.substring(0, 10):"",
        Finalizado: b.finalizado? "Listo":""
      };
      this.mantenimientosExcel.push(reg);
    });
  }
  
  exportAsXLSX(datos,tipo:string): void {
    this.CreaDatosExcel(datos.filteredData);
    if (this.mantenimientosExcel) this._excelService.exportAsExcelFile(this.mantenimientosExcel, 'Mantenimientos:'+tipo);
    else 
      swal('No se puede exportar un excel vacio', '', 'error');
  }
}
