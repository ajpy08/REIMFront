import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator,MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import * as io from 'socket.io-client';
import { MantenimientoService,ExcelService } from '../../../services/service.index';

declare var swal: any;
@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
})
export class MantenimientosComponent implements OnInit, OnDestroy {
  mantenimientosExcel = [];
  cargando = true;
  
  totalReparaciones = 0;
  totalLavados = 0;
  totalAcondicionamientos = 0;

  tablaCargarR = false;
  tablaCargarL = false;
  tablaCargarA = false;

  activo = false;
  
  acttrue = false;
  
  displayedColumnsReparaciones = ['actions','tipoMantenimiento' ,'observacionesCompleto', 'maniobra.contenedor','maniobra.tipo','maniobra.peso'];
  displayedColumnsLavados = ['actions','tipoMantenimiento' ,'observacionesCompleto', 'maniobra.contenedor','maniobra.tipo','maniobra.peso'];
  displayedColumnsAcondicionamientos = ['actions','tipoMantenimiento' ,'observacionesCompleto', 'maniobra.contenedor','maniobra.tipo','maniobra.peso'];

  dtReparaciones: any;
  dtLavados: any;
  dtAcondicionamientos: any;
  
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _mantenimientoService: MantenimientoService,
    private _excelService: ExcelService
  ) { }

  ngOnInit() {
    localStorage.removeItem('historyArray');
    this.cargarReparaciones();
    this.cargarLavados();

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
      if (this.dtReparaciones.filteredData.length === 0 ) {
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
      if (this.dtLavados.filteredData.length === 0 ) {
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

  applyFilterAcondicionamientos(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    if (this.dtAcondicionamientos && this.dtAcondicionamientos.data.length > 0) {
      this.dtAcondicionamientos.filter = filterValue;
      this.totalLavados = this.dtAcondicionamientos.filteredData.length;
      if (this.dtAcondicionamientos.filteredData.length === 0 ) {
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
    this.cargando = true;
    this._mantenimientoService.getMantenimientosxTipo("REPARAR").subscribe(mant => {
      this.dtReparaciones = new MatTableDataSource(mant.mantenimientos);
      console.log(this.dtReparaciones)
      if (mant.mantenimientos.length === 0) 
        this.tablaCargarR = true;
      else 
        this.tablaCargarR = false;
      this.dtReparaciones.sort = this.sort;
      this.dtReparaciones.paginator = this.paginator;
      this.totalReparaciones = mant.mantenimientos.length;
    });
    this.cargando = false;
  }

  cargarLavados() {
    this.cargando = true;
    this._mantenimientoService.getMantenimientosxTipo("LAVADO").subscribe(mant => {
      this.dtLavados = new MatTableDataSource(mant.mantenimientos);
      console.log(this.dtLavados)
      if (mant.mantenimientos.length === 0) 
        this.tablaCargarL = true;
      else 
        this.tablaCargarL = false;
      this.dtLavados.sort = this.sort;
      this.dtLavados.paginator = this.paginator;
      this.totalLavados = mant.mantenimientos.length;
    });
    this.cargando = false;
  }

  cargarAcondicionamientos() {
    this.cargando = true;
    this._mantenimientoService.getMantenimientosxTipo("ACONDICIONAMIENTO").subscribe(mant => {
      this.dtAcondicionamientos = new MatTableDataSource(mant.mantenimientos);
      console.log(this.dtAcondicionamientos)
      if (mant.mantenimientos.length === 0) 
        this.tablaCargarA = true;
      else 
        this.tablaCargarA = false;
      this.dtAcondicionamientos.sort = this.sort;
      this.dtAcondicionamientos.paginator = this.paginator;
      this.totalAcondicionamientos = mant.mantenimientos.length;
    });
    this.cargando = false;
  }

  onLinkClick(event: MatTabChangeEvent) {
    localStorage.setItem('MantenimientosTabs', event.index.toString());
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
