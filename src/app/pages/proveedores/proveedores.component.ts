import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Proveedor } from './proveedor.models';
import { ProveedorService } from './proveedor.service';
import { ExcelService } from '../../services/service.index';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';

declare var swal: any;
@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
})
export class ProveedoresComponent implements OnInit, OnDestroy {
  proveedoresExcel = [];
  cargando = true;
  totalRegistros = 0;
  activo = false;
  tablaCargar = false;
  acttrue = false;
  displayedColumns = ['actions', 'activo', 'rfc', 'razonSocial', 'fAlta','usuarioAlta'];
  dataSource: any;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _proveedorService: ProveedorService,
    private _excelService: ExcelService
  ) { }

  ngOnInit() {
    localStorage.removeItem('historyArray');
    this.filtrado(this.activo);

    this.socket.on('new-proveedor', function (data: any) {
      this.filtrado(this.activo);
    }.bind(this));

    this.socket.on('update-proveedor', function (data: any) {
      if (data.data._id) {
        this.filtrado(this.activo);
      }
    }.bind(this));

    this.socket.on('delete-proveedor', function (data: any) {
      this.filtrado(this.activo);
    }.bind(this));
  }

  filtrado(bool: boolean) {
    if (bool === false) {
      bool = true;
      this.cargarProveedores(bool);
    } else if (bool === true) {
      bool = false;
      this.cargarProveedores(bool);
    }

  }
  ngOnDestroy() {
    this.socket.removeListener('delete-proveedor');
    this.socket.removeListener('update-proveedor');
    this.socket.removeListener('new-proveedor');
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
      console.error('Error al filtrar el dataSource de Buques');
    }
  }
  habilitarDesabilitarProveedor(proveedor, event) {
    if (event.checked === false) {
      swal({
        title: '¿ Estas Seguro ?',
        text: 'Estas apunto de deshabilitar al Proveedor ' + proveedor.razonSocial,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrado => {
        if (borrado) {
          this._proveedorService.habilitaDeshabilitaProveedor(proveedor, event.checked).subscribe(act => {
            //this.acttrue = true;
            this.filtrado(this.acttrue);
          });
        } else {
          event.source.checked = !event.checked;
        }
      });
    } else {
      swal({
        title: '¿Estas Seguro?',
        text: 'Estas apunto de habilitar al Proveedor ' + proveedor.razonSocial,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrar => {
        if (borrar) {
          this._proveedorService.habilitaDeshabilitaProveedor(proveedor, event.checked).subscribe(borado => {
            //this.acttrue = false;
            this.filtrado(this.acttrue);
          });
        } else {
          event.source.checked = !event.checked;
        }
      })
    }
  }

  cargarProveedores(bool: boolean) {
    this.cargando = true;
    this._proveedorService.getProveedores(bool).subscribe(proveedores => {
      this.dataSource = new MatTableDataSource(proveedores.proveedores);
      if (proveedores.proveedores.length === 0) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = proveedores.proveedores.length;
    });
    this.cargando = false;
  }

  borrarProveedor(proveedor: Proveedor) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + proveedor.razonSocial,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._proveedorService
          .borrarProveedor(proveedor).subscribe((res) => {
            this.socket.emit('deletebuque', res);
            this.filtrado(this.acttrue);

          }, (error) => {
            swal({
              title: 'No se permite eliminar el proveedor',
              text: 'El proveedor  ' + proveedor.razonSocial + '  cuenta con historial de registro en el sistema.' +
                '  La acción permitida es DESACTIVAR,  ¿  DESEA CONTINUAR ?',
              icon: 'warning',
              buttons: true,
              dangerMode: true
            }).then(borrado => {
              if (borrado) {
                this._proveedorService.habilitaDeshabilitaProveedor(proveedor, false).subscribe(() => {
                  swal('Correcto', 'Cambio de estado del proveedor ' + proveedor.razonSocial + 'realizado con exito', 'success');
                  this.filtrado(this.acttrue);
                });
              }
            });
          });
        // .subscribe(() => this.cargarBuques());
      }
    });
  }

  CreaDatosExcel(datos) {
    datos.forEach(b => {
      const proveedor = {
        // Id: b._id,
        rfc: b.rfc,
        razonSocial: b.razonSocial,
        UsuarioAlta: b.usuarioAlta.nombre,
        FAlta: b.fAlta.substring(0, 10)
      };
      this.proveedoresExcel.push(proveedor);
    });
  }

  exportAsXLSX(): void {
    this.CreaDatosExcel(this.dataSource.filteredData);
    if (this.proveedoresExcel) {
      this._excelService.exportAsExcelFile(this.proveedoresExcel, 'Proveedores');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
}
