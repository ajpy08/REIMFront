import { Component, OnInit, ViewChild } from '@angular/core';
import { Camion } from './camion.models';
import {
  CamionService,
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
  selector: 'app-camiones',
  templateUrl: './camiones.component.html',
  styles: []
})
export class CamionesComponent implements OnInit {
  usuarioLogueado: Usuario;
  camiones: Camion[] = [];
  cargando = true;
  activo = false;
  acttrue = false;
  totalRegistros = 0;
  tablaCargar = false;
  camionesExcel = [];
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  displayedColumns = [
    'actions',
    'activo',
    'transportista.nombreComercial',
    'noEconomico',
    'placa',
    'vigenciaSeguro',
    'pdfSeguro',
  ];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public _camionService: CamionService,
    private usuarioService: UsuarioService,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;

    localStorage.removeItem('historyArray');
    this.filtrado(this.activo);

    this.socket.on('new-camion', function (data: any) {
      this.filtrado(this.activo);
    }.bind(this));

    this.socket.on('update-camion', function (data: any) {
      if (data.data._id) {
        this.filtrado(this.activo);
      }
    }.bind(this));

    this.socket.on('delete-camion', function (data: any) {
      this.filtrado(this.activo);
    }.bind(this));
  }

  filtrado(bool: boolean) {
    if (bool === false) {
      bool = true;
        this.cargarCamiones(bool);
    } else if (bool === true) {
      bool = false;
      this.cargarCamiones(bool);
    }
  }

  ngOnDestroy() {
    this.socket.removeListener('delete-camion');
    this.socket.removeListener('update-camion');
    this.socket.removeListener('new-camion');
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
      console.error('Error al filtrar el dataSource de Camiones');
    }
  }

  cargarCamiones(bool: boolean) {
    this.cargando = true;

    if (
      this.usuarioLogueado.role === ROLES.ADMIN_ROLE ||
      this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE
    ) {
      this._camionService.getCamiones(bool).subscribe(camiones => {
        this.dataSource = new MatTableDataSource(camiones.camiones);

        this.dataSource.sortingDataAccessor = (item, property) => {
          if (property.includes('.')) {
            return property.split('.').reduce((o, i) => o[i], item);
          }
          return item[property];
        };

        if (camiones.camiones.length === 0) {
          this.tablaCargar = true;
        } else {
          this.tablaCargar = false;
        }
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = camiones.camiones.length;
      });
    } else {
      if (this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE) {
        this._camionService
          .getCamiones(bool, this.usuarioLogueado.empresas[0]._id)
          .subscribe(camiones => {
            this.dataSource = new MatTableDataSource(camiones.camiones);

            this.dataSource.sortingDataAccessor = (item, property) => {
              if (property.includes('.')) {
                return property.split('.').reduce((o, i) => o[i], item);
              }
              return item[property];
            };

            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalRegistros = camiones.camiones.length;
          });
      }
    }
    this.cargando = false;
  }

  borrarCamion(camion: Camion) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + camion.noEconomico,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._camionService.borrarCamion(camion).subscribe(borrado => {
          this.acttrue = false;
          this.socket.emit('deletecamion', camion);
          // this.cargarCamiones();
        }, (error) => {
          swal({
            title: 'No se permite eliminar el camion',
            text: 'El camion ' + camion.noEconomico + ' cuenta con historial de registro en el sistema. ' +
              ' La acción permitida es DESACTIVAR,  ¿ DESEA CONTINUAR ?',
            icon: 'warning',
            buttons: true,
            dangerMode: true
          }).then(borrado => {
            if (borrado) {
              this._camionService.habilitaDeshabilitaCamion(camion, false).subscribe(() => {
                swal('Correcto', 'Cambio de estado del Camion con placa ' + camion.placa + 'realizado con exito', 'success');
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
      const camiones = {
        Nombre_Comercial: d.transportista.nombreComercial,
        No_Economico: d.noEconomico,
        Placa: d.placa,
        VigenciaSeguro: d.vigenciaSeguro
      };
      this.camionesExcel.push(camiones);
    });
  }

  exportarXLSX(): void {
    this.crearDatosExcel(this.dataSource.filteredData);
    if (this.camionesExcel) {
      this.excelService.exportAsExcelFile(this.camionesExcel, 'Camiones');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  habilitarDesabilitarCamion(camion, event) {
    if (event.checked === false) {
      swal({
        title: '¿Estas Seguro?',
        text: 'Estas apunto de deshabilitar al camion con placa ' + camion.placa,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrar => {
        if (borrar) {
          this._camionService.habilitaDeshabilitaCamion(camion, event.checked).subscribe(borado => {
            this.cargarCamiones(true);
          });
        } else {
          event.source.checked = !event.checked;
        }
      });
    } else {
      swal({
        title: '¿Estas Seguro?',
        text: 'Estas apunto de habilitar al camion con placa ' + camion.placa,
        icon: 'warning',
        buttons: true,
        dangerMode: true
      }).then(borrar => {
        if (borrar) {
          this._camionService.habilitaDeshabilitaCamion(camion, event.checked).subscribe(borado => {
            this.cargarCamiones(false);
          });
        } else {
          event.source.checked = !event.checked;
        }
      });
    }

  }
}
