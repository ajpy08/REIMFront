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
  activo = false;
  acttrue = false;
  tablaCargar = false;
  totalRegistros = 0;
  usuarioLogueado: Usuario;
  operadoresExcel = [];

  displayedColumns = [
    'actions',
    'activo',
    'foto',
    'transportista.nombreComercial',
    'nombre',
    'vigenciaLicencia',
    'licencia'
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
    this.filtrado(this.activo);

    this.socket.on('new-operador', function () {
      this.filtrado(this.activo);
    }.bind(this));

    this.socket.on('update-operador', function (data: any) {
      if (data.data._id) {
        this.filtrado(this.activo);
      }
    }.bind(this));

    this.socket.on('delete-operador', function () {
      this.filtrado(this.activo);
    }.bind(this));
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
      console.error('No se puede filtrar en un datasource vacío');
    }
  }
  filtrado(bool: boolean) {
    if (bool === false) {
      bool = true;
        this.cargarOperadores(bool);
    } else if (bool === true) {
      bool = false;
      this.cargarOperadores(bool);
    }

  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.socket.removeListener('delete-operador');
    this.socket.removeListener('update-operador');
    this.socket.removeListener('new-operador');
  }

   cargarOperadores(bool: boolean) {
    this.cargando = true;

    if (
      this.usuarioLogueado.role === ROLES.ADMIN_ROLE ||
      this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE
    ) {
      this._operadorService.getOperadores(null, bool).subscribe(operadores => {
        this.dataSource = new MatTableDataSource(operadores.operadores);
        if (operadores.operadores.length === 0) {
          this.tablaCargar = true;
        } else {
          this.tablaCargar = false;
        }
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = operadores.operadores.length;
      });
    } else {
      if (this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE) {
        this._operadorService
          .getOperadores(this.usuarioLogueado.empresas[0]._id, bool)
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
    if (event.checked === false) {
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
            .subscribe(() => {
              this.cargarOperadores(true);
            });
        } else {
          event.source.checked = !event.checked;
        }
      });
    } else {
      swal({
        title: '¿Esta seguro?',
        text: 'Esta apunto de habilitar a ' + operador.nombre,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrar => {
        if (borrar) {
          this._operadorService
            .habilitaDeshabilitaOperador(operador, event.checked)
            .subscribe(() => {
              this.acttrue = false;
              this.cargarOperadores(true);
            });
        } else {
          event.source.checked = !event.checked;
        }
      });
    }
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
          .borrarOperador(operador)
          .subscribe(() => {
            this.socket.emit('deleteoperador', operador);
          }, () => {
            swal({
              title: 'No se puede eliminar al Operador',
              text: 'El operador  ' + operador.nombre + '  cuenta con historial en el sistema. ' +
              'La acción permitida es DESACTIVAR, \n¿ DESEA CONTINUAR ?',
              icon: 'warning',
              buttons: true,
              dangerMode: true
            }).then(borrado => {
              if (borrado) {
                this._operadorService.habilitaDeshabilitaOperador(operador, false).subscribe(() => {
                  this.filtrado(this.acttrue);
                });
              }
            });
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
