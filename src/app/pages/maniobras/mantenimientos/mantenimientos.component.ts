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
  totalRegistros = 0;
  activo = false;
  tablaCargar = false;
  acttrue = false;
  displayedColumns = ['actions', 'activo', 'nombre', 'razonSocial', 'fAlta'];
  dataSource: any;
  
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _mantenimientoService: MantenimientoService,
    private _excelService: ExcelService
  ) { }

  ngOnInit() {
    localStorage.removeItem('historyArray');
    this.filtrado(this.activo);

    this.socket.on('new-mantenimiento', function (data: any) {
      this.filtrado(this.activo);
    }.bind(this));

    this.socket.on('update-mantenimiento', function (data: any) {
      if (data.data._id) {
        this.filtrado(this.activo);
      }
    }.bind(this));

    this.socket.on('delete-mantenimiento', function (data: any) {
      this.filtrado(this.activo);
    }.bind(this));
  }

  filtrado(bool: boolean) {
    if (bool === false) {
      bool = true;
      this.cargarMantenimientos(bool);
    } else if (bool === true) {
      bool = false;
      this.cargarMantenimientos(bool);
    }

  }
  ngOnDestroy() {
    this.socket.removeListener('delete-mantenimiento');
    this.socket.removeListener('update-mantenimiento');
    this.socket.removeListener('new-mantenimiento');
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalRegistros = this.dataSource.filteredData.length;
      if (this.dataSource.filteredData.length === 0 ) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
    } else {
      console.error('No se puede filtrar en un Datasource vacío');
    }
  }



  cargarMantenimientos(bool: boolean) {
    this.cargando = true;
    // this._buqueService.getBuques(bool).subscribe(buques => {
    //   this.dataSource = new MatTableDataSource(buques.buques);
    //   if (buques.buques.length === 0) {
    //     this.tablaCargar = true;
    //   } else {
    //     this.tablaCargar = false;
    //   }
    //   this.dataSource.sort = this.sort;
    //   this.dataSource.paginator = this.paginator;
    //   this.totalRegistros = buques.buques.length;
    // });
    this.cargando = false;
  }

  onLinkClick(event: MatTabChangeEvent) {
    localStorage.setItem('ManiobrasTabs', event.index.toString());
  }

  applyFilterReparacione(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    // if (this.dtXAprobar && this.dtXAprobar.data.length > 0) {
    //   this.dtXAprobar.filter = filterValue;
    //   this.totalXAprobar = this.dtXAprobar.filteredData.length;
    //   if (this.dtXAprobar.filteredData.length === 0 ) {
    //     this.tablaCargarD = true;
    //   } else {
    //     this.tablaCargarD = false;
    //   }
    // } else {
    //   console.error('No se puede filtrar en un datasource vacío');
    // }

    // this.dtXAprobar.filter = filterValue;
    // this.totalXAprobar = this.dtXAprobar.filteredData.length;
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
    this.CreaDatosExcel(this.dataSource.filteredData);
    if (this.mantenimientosExcel) {
      this._excelService.exportAsExcelFile(this.mantenimientosExcel, 'Mantenimientos');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
}
