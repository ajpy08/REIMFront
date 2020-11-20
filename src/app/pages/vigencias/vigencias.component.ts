import { UsuarioService } from './../usuarios/usuario.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Vigencia } from './vigencia.models';
import { VigenciaService, ExcelService } from '../../services/service.index';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';
import { Usuario } from '../usuarios/usuario.model';

declare var swal: any;
@Component({
  selector: 'app-vigencias',
  templateUrl: './vigencias.component.html',
  styleUrls: ['./vigencias.component.css']
})
export class VigenciasComponent implements OnInit, OnDestroy {
  usuarioLogueado = new Usuario;
  vigenciasExcel = [];
  cargando = true;
  totalRegistros = 0;
  activo = false;
  tablaCargar = false;
  acttrue = false;
  displayedColumns = ['actions', 'activo', 'contenedor', 'fManufactura', 'fVencimiento', 'observaciones', 'fAlta'];
  dataSource: any;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private vigenciaService: VigenciaService,
    private excelService: ExcelService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;

    localStorage.removeItem('historyArray');
    this.filtrado(this.activo);

    this.socket.on('new-vigencia', function (data: any) {
      this.filtrado(this.activo);
    }.bind(this));

    this.socket.on('update-vigencia', function (data: any) {
      if (data.data._id) {
        this.filtrado(this.activo);
      }
    }.bind(this));

    this.socket.on('delete-vigencia', function (data: any) {
      this.filtrado(this.activo);
    }.bind(this));
  }

  filtrado(bool: boolean) {
    if (bool === false) {
      bool = true;
      this.cargarVigencias(bool);
    } else if (bool === true) {
      bool = false;
      this.cargarVigencias(bool);
    }

  }

  ngOnDestroy() {
    this.socket.removeListener('delete-vigencia');
    this.socket.removeListener('update-vigencia');
    this.socket.removeListener('new-vigencia');
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalRegistros = this.dataSource.filteredData.length;
      if (this.dataSource.filteredData.length === 0) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
    } else {
      console.error('No se puede filtrar en un datasource vacío');
    }
  }
  habilitarDesabilitarVigencia(vigencia, event) {
    if (event.checked === false) {
      swal({
        title: '¿ Estas Seguro ?',
        text: 'Estas apunto de deshabilitar al contenedor ' + vigencia.contenedor,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrado => {
        if (borrado) {
          this.vigenciaService.habilitaDeshabilitaVigencia(vigencia, event.checked).subscribe(act => {
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
        text: 'Estas apunto de habilitar al contenedor ' + vigencia.contenedor,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrar => {
        if (borrar) {
          this.vigenciaService.habilitaDeshabilitaVigencia(vigencia, event.checked).subscribe(act => {
            this.acttrue = false;
            this.filtrado(this.acttrue);
          });
        } else {
          event.source.checked = !event.checked;
        }
      })
    }
  }

  cargarVigencias(bool: boolean) {
    this.cargando = true;
    this.vigenciaService.getVigencias(bool).subscribe(vigencias => {
      this.dataSource = new MatTableDataSource(vigencias.vigencias);
      if (vigencias.vigencias.length === 0) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = vigencias.vigencias.length;
    });
    this.cargando = false;
  }

  borrarVigencia(vigencia: Vigencia) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + vigencia.contenedor,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this.vigenciaService
          .borrarVigencia(vigencia).subscribe((res) => {
            this.socket.emit('deletevigencia', res);
          });
      }
    });
  }

  CreaDatosExcel(datos) {
    datos.forEach(v => {
      const vigencia = {
        // Id: v._id,
        Contenedor: v.contenedor,
        FechaManufactura: v.fManufactura.substring(0, 10),
        FechaVencimiento: v.fVencimiento.substring(0, 10),
        Observaciones: v.observaciones,
        UsuarioAlta: v.usuarioAlta.nombre,
        FAlta: v.fAlta.substring(0, 10)
      };
      this.vigenciasExcel.push(vigencia);
    });
  }

  exportAsXLSX(): void {
    this.CreaDatosExcel(this.dataSource.filteredData);
    if (this.vigenciasExcel) {
      this.excelService.exportAsExcelFile(this.vigenciasExcel, 'Vigencias');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

}
