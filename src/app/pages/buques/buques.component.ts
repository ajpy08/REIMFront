import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Buque } from './buques.models';
import { BuqueService, ExcelService } from '../../services/service.index';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';

declare var swal: any;
@Component({
  selector: 'app-buques',
  templateUrl: './buques.component.html',
})
export class BuquesComponent implements OnInit, OnDestroy {
  buquesExcel = [];
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
    private _buqueService: BuqueService,
    private _excelService: ExcelService
  ) { }

  ngOnInit() {
    localStorage.removeItem('historyArray');
    this.filtrado(this.activo);

    this.socket.on('new-buque', function (data: any) {
      this.filtrado(this.activo);
    }.bind(this));

    this.socket.on('update-buque', function (data: any) {
      if (data.data._id) {
        this.filtrado(this.activo);
      }
    }.bind(this));

    this.socket.on('delete-buque', function (data: any) {
      this.filtrado(this.activo);
    }.bind(this));
  }

  filtrado(bool: boolean) {
    if (bool === false) {
      bool = true;
      this.cargarBuques(bool);
    } else if (bool === true) {
      bool = false;
      this.cargarBuques(bool);
    }

  }
  ngOnDestroy() {
    this.socket.removeListener('delete-buque');
    this.socket.removeListener('update-buque');
    this.socket.removeListener('new-buque');
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
  habilitarDesabilitarBuque(buque, event) {
    if (event.checked === false) {
      swal({
        title: '¿ Estas Seguro ?',
        text: 'Estas apunto de deshabilitar al buque ' + buque.nombre,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrado => {
        if (borrado) {
          this._buqueService.habilitaDeshabilitaBuque(buque, event.checked).subscribe(act => {
            this.acttrue = true;
            this.filtrado(this.acttrue);
          });
        } else {
          event.source.checked = !event.checked;
        }
      });
    } else {
      swal({
        title: '¿Estas Seguro?',
        text: 'Estas apunto de habilitar al Buque ' + buque.nombre,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrar => {
        if (borrar) {
          this._buqueService.habilitaDeshabilitaBuque(buque, event.checked).subscribe(borado => {
            this.acttrue = false;
            this.filtrado(this.acttrue);
          });
        } else {
          event.source.checked = !event.checked;
        }
      })
    }
  }

  cargarBuques(bool: boolean) {
    this.cargando = true;
    this._buqueService.getBuques(bool).subscribe(buques => {
      this.dataSource = new MatTableDataSource(buques.buques);
      if (buques.buques.length === 0) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = buques.buques.length;
    });
    this.cargando = false;
  }

  borrarBuque(buque: Buque) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + buque.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._buqueService
          .borrarBuque(buque).subscribe((res) => {
            this.socket.emit('deletebuque', res);

          }, (error) => {
            swal({
              title: 'No se permite eliminar el Buque',
              text: 'El Buque  ' + buque.nombre + '  cuenta con historial de registro en el sistema.' +
                '  La acción permitida es DESACTIVAR,  ¿  DESEA CONTINUAR ?',
              icon: 'warning',
              buttons: true,
              dangerMode: true
            }).then(borrado => {
              if (borrado) {
                this._buqueService.habilitaDeshabilitaBuque(buque, false).subscribe(() => {
                  swal('Correcto', 'Cambio de estado del Buque ' + buque.nombre + 'realizado con exito', 'success');
                  this.filtrado(this.acttrue);
                });
              }
            });
          });
      }
    });
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
      this.buquesExcel.push(buque);
    });
  }

  exportAsXLSX(): void {
    this.CreaDatosExcel(this.dataSource.filteredData);
    if (this.buquesExcel) {
      this._excelService.exportAsExcelFile(this.buquesExcel, 'Buques');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
}
