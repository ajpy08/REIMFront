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
  totalRegistros = 0;
  camionesExcel = [];
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  displayedColumns = [
    'actions',
    'transportista.nombreComercial',
    'noEconomico',
    'placa',
    'vigenciaSeguro',
    'pdfSeguro'
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
    localStorage.removeItem('historyArray');
    this.usuarioLogueado = this.usuarioService.usuario;
    this.cargarCamiones();

    this.socket.on('new-camion', function (data: any) {
      this.cargarCamiones();
    }.bind(this));

    this.socket.on('update-camion', function (data: any) {
      if (data.data._id) {
        this.cargarCamiones();
      }
    }.bind(this));

    this.socket.on('delete-camion', function (data: any) {
      this.cargarCamiones();
    }.bind(this));
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
    } else {
      console.error('Error al filtrar el dataSource de Camiones');
    }
  }

  cargarCamiones() {
    this.cargando = true;

    if (
      this.usuarioLogueado.role === ROLES.ADMIN_ROLE ||
      this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE
    ) {
      this._camionService.getCamiones().subscribe(camiones => {
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
    } else {
      if (this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE) {
        this._camionService
          .getCamiones(this.usuarioLogueado.empresas[0]._id)
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
        this._camionService.borrarCamion(camion._id).subscribe(borrado => {
          this.socket.emit('deletecamion', camion);
          // this.cargarCamiones();
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
}
