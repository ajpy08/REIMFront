import { Component, OnInit, ViewChild } from '@angular/core';
import { Operador } from './operador.models';
import {
  OperadorService,
  UsuarioService,
  ExcelService
} from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from '../usuarios/usuario.model';
import { ROLES } from 'src/app/config/config';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';
declare var swal: any;
@Component({
  selector: 'app-operadores',
  templateUrl: './operadores.component.html',
  styles: []
})
export class OperadoresComponent implements OnInit {
  operadores: Operador[] = [];
  cargando = true;
  totalRegistros = 0;
  usuarioLogueado: Usuario;
  operadoresExcel = [];

  displayedColumns = [
    'actions',
    'foto',
    'transportista.nombreComercial',
    'nombre',
    'vigenciaLicencia',
    'licencia',
    'activo'
  ];
  dataSource: any;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public _operadorService: OperadorService,
    private usuarioService: UsuarioService,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.cargarOperadores();
    this.socket.on('new-operador', function (data: any) {
      this.cargarOperadores();
    }.bind(this));

    this.socket.on('update-operador', function (data: any) {
      if (data.data._id) {
        this.cargarOperadores();
      }
    }.bind(this));

    this.socket.on('delete-operador', function (data: any) {
      this.cargarOperadores();
    }.bind(this));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalRegistros = this.dataSource.filteredData.length;
    } else {
      console.error('Error al filtrar el dataSource de Operadores');
    }
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.socket.removeListener('delete-operador');
    this.socket.removeListener('update-operador');
    this.socket.removeListener('new-operador');
  }

  cargarOperadores() {
    this.cargando = true;

    if (
      this.usuarioLogueado.role === ROLES.ADMIN_ROLE ||
      this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE
    ) {
      this._operadorService.getOperadores().subscribe(operadores => {
        this.dataSource = new MatTableDataSource(operadores.operadores);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = operadores.operadores.length;
      });
    } else {
      if (this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE) {
        this._operadorService
          .getOperadores(this.usuarioLogueado.empresas[0]._id)
          .subscribe(operadores => {
            this.dataSource = new MatTableDataSource(operadores.operadores);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalRegistros = operadores.operadores.length;
          });
      }
    }
    this.cargando = false;
  }

  habilitaDeshabilitaOperador(operador, event) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de deshabilitar a ' + operador.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._operadorService
          .habilitaDeshabilitaOperador(operador, event.checked)
          .subscribe(borrado => {
            this.cargarOperadores();
          });
      } else {
        event.source.checked = !event.checked;
      }
    });
  }

  borrarOperador(operador: Operador) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + operador.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._operadorService
          .borrarOperador(operador._id)
          .subscribe(borrado => {
            this.socket.emit('deleteoperador', operador);
          });
      }
    });
  }

  crearDatosExcel(datos) {
    datos.forEach(d => {
      const operadores = {
        Nombre_comercial: d.transportista.nombreComercial,
        Nombre: d.nombre,
        VigenciaLicencia: d.vigenciaLicencia,
        Licencia: d.licencia,
        Activo: d.activo
      };
      this.operadoresExcel.push(operadores);
    });
  }

  exportarXLSX(): void {
    this.crearDatosExcel(this.dataSource.filteredData);
    if (this.operadoresExcel) {
      this.excelService.exportAsExcelFile(this.operadoresExcel, 'Operadores');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
}
