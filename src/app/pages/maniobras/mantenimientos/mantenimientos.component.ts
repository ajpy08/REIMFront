import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import * as io from 'socket.io-client';
import { MantenimientoService, ExcelService } from '../../../services/service.index';

declare var swal: any;
@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
})
export class MantenimientosComponent implements OnInit, OnDestroy {
  mantenimientosExcel = [];

  cargandoR: boolean = true;
  incluirFinalizadosR: boolean = false;
  cargandoL: boolean = true;
  incluirFinalizadosL: boolean = false;
  cargandoA: boolean = true;
  incluirFinalizadosA: boolean = false;


  totalReparaciones = 0;
  totalLavados = 0;
  totalAcondicionamientos = 0;

  tablaCargarR = false;
  tablaCargarL = false;
  tablaCargarA = false;

  activo = false;

  acttrue = false;

  displayedColumnsReparaciones = ['actions', 'observacionesCompleto', 'maniobra.contenedor', 'maniobra.tipo', 'maniobra.peso', 'finalizado'];
  displayedColumnsLavados = ['actions', 'observacionesCompleto', 'maniobra.contenedor', 'maniobra.tipo', 'maniobra.peso'];
  displayedColumnsAcondicionamientos = ['actions', 'observacionesCompleto', 'maniobra.contenedor', 'maniobra.tipo', 'maniobra.peso'];

  dtReparaciones: any;
  dtLavados: any;
  dtAcondicionamientos: any;

  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('pagReparaciones', { read: MatPaginator }) pagReparaciones: MatPaginator;
  @ViewChild('pagLavados', { read: MatPaginator }) pagLavados: MatPaginator;
  @ViewChild('pagAcondicionamientos', { read: MatPaginator }) pagAcondicionamientos: MatPaginator;
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sortReparaciones') sortReparaciones: MatSort;
  @ViewChild('sortLavados') sortLavados: MatSort;
  @ViewChild('sortAcondicionamientos') sortAcondicionamientos: MatSort;

  constructor(
    private _mantenimientoService: MantenimientoService,
    private _excelService: ExcelService
  ) { }

  ngOnInit() {
    localStorage.removeItem('historyArray');
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
      if (this.dtReparaciones.filteredData.length === 0) {
        this.tablaCargarR = true;
      } else {
        this.tablaCargarR = false;
      }
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
      if (this.dtLavados.filteredData.length === 0) {
        this.tablaCargarL = true;
      } else {
        this.tablaCargarL = false;
      }
    } else {
      console.error('No se puede filtrar en un datasource vacío');
    }

    this.dtLavados.filter = filterValue;
    this.totalLavados = this.dtLavados.filteredData.length;
  }

  Filtro(): (data: any, filter: string) => boolean {
    const filterFunction = function (data, filter): boolean {
      const dataStr =
        data.observacionesCompleto.toLowerCase() +
        (data.contenedor ? data.contenedor.toLowerCase() : '') +
        (data.maniobra ? data.maniobra.contenedor.toLowerCase() : '') +
        (data.maniobra ? data.maniobra.tipo.toLowerCase() : '') +
        (data.maniobra ? data.maniobra.peso.toLowerCase() : '');
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
      if (this.dtAcondicionamientos.filteredData.length === 0) {
        this.tablaCargarA = true;
      } else {
        this.tablaCargarA = false;
      }
    } else {
      console.error('No se puede filtrar en un datasource vacío');
    }

    this.dtAcondicionamientos.filter = filterValue;
    this.totalAcondicionamientos = this.dtAcondicionamientos.filteredData.length;
  }


  cargarReparaciones() {
    this.cargandoR = true;
    this._mantenimientoService.getMantenimientosxTipo("REPARACION", this.incluirFinalizadosR ? "TODOS" : "PENDIENTES").subscribe(mant => {
      this.dtReparaciones = new MatTableDataSource(mant.mantenimientos);
      if (mant.mantenimientos.length === 0)
        this.tablaCargarR = true;
      else
        this.tablaCargarR = false;
      this.dtReparaciones.sort = this.sortReparaciones;
      this.dtReparaciones.paginator = this.pagReparaciones;
      this.dtReparaciones.filterPredicate = this.Filtro();
      this.totalReparaciones = mant.mantenimientos.length;
      this.cargandoR = false;
    });

  }

  cargarLavados() {
    this.cargandoL = true;
    this._mantenimientoService.getMantenimientosxTipo("LAVADO", "PENDIENTES").subscribe(mant => {
      this.dtLavados = new MatTableDataSource(mant.mantenimientos);
      if (mant.mantenimientos.length === 0)
        this.tablaCargarL = true;
      else
        this.tablaCargarL = false;
      this.dtLavados.sort = this.sortLavados;
      this.dtLavados.paginator = this.pagLavados;
      this.dtLavados.filterPredicate = this.Filtro();
      this.totalLavados = mant.mantenimientos.length;
      this.cargandoL = false;
    });
    
  }

  cargarAcondicionamientos() {
    this.cargandoA = true;
    this._mantenimientoService.getMantenimientosxTipo("ACONDICIONAMIENTO", "PENDIENTES").subscribe(mant => {
      this.dtAcondicionamientos = new MatTableDataSource(mant.mantenimientos);
      if (mant.mantenimientos.length === 0)
        this.tablaCargarA = true;
      else
        this.tablaCargarA = false;
      this.dtAcondicionamientos.sort = this.sortAcondicionamientos;
      this.dtAcondicionamientos.paginator = this.pagAcondicionamientos;
      this.dtAcondicionamientos.filterPredicate = this.Filtro();
      this.totalAcondicionamientos = mant.mantenimientos.length;
      this.cargandoA = false;
    });
    
  }

  eliminaMantenimiento(id) {
    this._mantenimientoService.eliminaMantenimiento(id).subscribe(mantenimientos => {
      this.cargarReparaciones();
    });

  }


  onLinkClick(event: MatTabChangeEvent) {
    localStorage.setItem('MantenimientosTabs', event.index.toString());
  }

  onChangeCheckReparaciones (event) {
    this.cargarReparaciones();
  }

  CreaDatosExcel(datos) {
    datos.forEach(b => {
      const buque = {
        // Id: b._id,
        Buque: b.nombre,
        Naviera: b.naviera.nombreComercial,
        UsuarioAlta: b.usuarioAlta.nombre,
        FAlta: b.fAlta.substring(0, 10)
      };
      this.mantenimientosExcel.push(buque);
    });
  }

  exportAsXLSX(): void {
    this.CreaDatosExcel(this.dtAcondicionamientos.filteredData);
    if (this.mantenimientosExcel) {
      this._excelService.exportAsExcelFile(this.mantenimientosExcel, 'Mantenimientos');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
}
