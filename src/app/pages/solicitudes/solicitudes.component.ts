import { Agencia } from './../agencias/agencia.models';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Solicitud } from './solicitud.models';
import {
  SolicitudService,
  UsuarioService,
  ExcelService
} from '../../services/service.index';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatTabGroup,
  MatTabChangeEvent
} from '@angular/material';
import * as _moment from 'moment';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import { balancePreviousStylesIntoKeyframes } from '@angular/animations/browser/src/util';
import { ROLES } from 'src/app/config/config';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';
declare var swal: any;

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: ['l', 'L']
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styles: [],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' }
  ]
})
export class SolicitudesComponent implements OnInit {
  fIni = moment()
    .local()
    .startOf('day')
    .subtract(1, 'month');
  fFin = moment()
    .local()
    .startOf('day');
  SolicitudesExcel = [];
  @ViewChild(MatPaginator) paginator: MatPaginator; // descargas
  @ViewChild(MatSort) sort: MatSort; // descargas
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('pagCargas', { read: MatPaginator }) pagCargas: MatPaginator; // cargas
  @ViewChild('sortCargas') sortCargas: MatSort; // cargas

  cargando = true;
  displayedColumnsDescarga = [
    'actions',
    'fAlta',
    'agencia.nombreComercial',
    'naviera.nombreComercial',
    'cliente.nombreComercial',
    'viaje.viaje',
    'buque.nombre',
    'observaciones',
    'contenedores',
    'estatus'
  ];

  displayedColumnsCarga = [
    'actions',
    'fAlta',
    'blBooking',
    'agencia.nombreComercial',
    'cliente.nombreComercial',
    'observaciones',
    'solicitado',
    'estatus'
  ];

  dtCargas: any;
  dtDescargas: any;
  totalRegistrosDescargas = 0;
  totalRegistrosCargas = 0;
  usuarioLogueado: any;


  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  constructor(
    public _solicitudService: SolicitudService,
    private _usuarioService: UsuarioService,
    private excelService: ExcelService,
  ) { }
  ngOnInit() {
    this.usuarioLogueado = this._usuarioService.usuario;
    this.cargarSolicitudes('D');
    this.cargarSolicitudes('C');
    const indexTAB = localStorage.getItem('AprobSolicitudes');
    if (indexTAB) {
      // tslint:disable-next-line: radix
      this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
    }

    this.socket.on('new-solicitud', function (data: any) {
      if ((data.data.agencia === this.usuarioLogueado.empresas[0]._id && this.usuarioLogueado.role === ROLES.AA_ROLE) ||
      (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
        this.cargarSolicitudes(data.data.tipo);
      }
    }.bind(this));


    this.socket.on('update-solicitud', function (data: any) {
      if ((data.data.agencia === this.usuarioLogueado.empresas[0]._id && this.usuarioLogueado.role === ROLES.AA_ROLE) ||
      (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
        if (data.data._id) {
          this.cargarSolicitudes(data.data.tipo);
        }
      }
    }.bind(this));

    this.socket.on('delete-solicitud', function (data: any) {
      if ((data.data.agencia._id === this.usuarioLogueado.empresas[0]._id && this.usuarioLogueado.role === ROLES.AA_ROLE) ||
      (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
        this.cargarSolicitudes(data.data.tipo);
      }
    }.bind(this));

    this.socket.on('aprobar-solicitud', function (data: any) {
       if ((data.data.agencia === this.usuarioLogueado.empresas[0]._id && this.usuarioLogueado.role === ROLES.AA_ROLE) ||
        (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
        this.cargarSolicitudes(data.data.tipo);
      }
    }.bind(this));


  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.socket.removeListener('aprobar-solicitud');
    this.socket.removeListener('delete-solicitud');
    this.socket.removeListener('update-solicitud');
    this.socket.removeListener('new-solicitud');
  }

  cargarSolicitudes(CD: string) {
    console.log('CARGUE A:' + this.usuarioLogueado.nombre);
    this.cargando = true;
    if (
      this.usuarioLogueado.role === ROLES.ADMIN_ROLE ||
      this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE
    ) {
      if (CD === 'D') {
        this._solicitudService
          .getSolicitudes(
            'D',
            null,
            this.fIni ? this.fIni.utc().format('DD-MM-YYYY') : '',
            this.fFin ? this.fFin.utc().format('DD-MM-YYYY') : ''
          )
          .subscribe(res => {
            this.totalRegistrosDescargas = res.total;
            this.dtDescargas = new MatTableDataSource(res.solicitudes);
            this.dtDescargas.sort = this.sort;
            this.dtDescargas.paginator = this.paginator;
          });
      } else if (CD === 'C') {
        this._solicitudService
          .getSolicitudes(
            'C',
            null,
            this.fIni ? this.fIni.utc().format('DD-MM-YYYY') : '',
            this.fFin ? this.fFin.utc().format('DD-MM-YYYY') : ''
          )
          .subscribe(res => {
            this.totalRegistrosCargas = res.total;
            this.dtCargas = new MatTableDataSource(res.solicitudes);
            this.dtCargas.sort = this.sortCargas;
            this.dtCargas.paginator = this.pagCargas;
            this.cargando = false;
          });
      }
    } else {
      let agencias = '';
      this.usuarioLogueado.empresas.forEach(emp => {
        agencias = agencias + emp._id + ',';
      });
      agencias = agencias.slice(0, -1);
      if (CD === 'D') {
        this._solicitudService
          .getSolicitudes(
            'D',
            null,
            this.fIni ? this.fIni.utc().format('DD-MM-YYYY') : '',
            this.fFin ? this.fFin.utc().format('DD-MM-YYYY') : '',
            agencias
          )
          .subscribe(res => {
            this.totalRegistrosDescargas = res.total;
            this.dtDescargas = new MatTableDataSource(res.solicitudes);
            this.dtDescargas.sort = this.sort;
            this.dtDescargas.paginator = this.paginator;
          });
      } else if (CD === 'C') {
        this._solicitudService
          .getSolicitudes(
            'C',
            null,
            this.fIni ? this.fIni.utc().format('DD-MM-YYYY') : '',
            this.fFin ? this.fFin.utc().format('DD-MM-YYYY') : '',
            agencias
          )
          .subscribe(res => {
            this.totalRegistrosCargas = res.total;
            this.dtCargas = new MatTableDataSource(res.solicitudes);
            this.dtCargas.sort = this.sortCargas;
            this.dtCargas.paginator = this.pagCargas;
            this.cargando = false;
          });
      }
    }
  }

  applyFilterCargas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    if (this.dtCargas && this.dtCargas.data.length > 0) {
      this.dtCargas.filter = filterValue;
      this.totalRegistrosCargas = this.dtCargas.filteredData.length;
    } else {
      console.error('Error al filtrar el dataSource de Aprobaciones Cargas');
    }

    // this.dtCargas.filter = filterValue;
    // this.totalRegistrosCargas = this.dtCargas.filteredData.length;
  }

  applyFilterDescargas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    if (this.dtDescargas && this.dtDescargas.data.length > 0) {
      this.dtDescargas.filter = filterValue;
      this.totalRegistrosDescargas = this.dtDescargas.filteredData.length;
    } else {
      console.error('Error al filtrar el dataSource de Aprobaciones Descargas');
    }

    // this.dtDescargas.filter = filterValue;
    // this.totalRegistrosDescargas = this.dtDescargas.filteredData.length;
  }

  onLinkClick(event: MatTabChangeEvent) {
    localStorage.setItem('AprobSolicitudes', event.index.toString());
  }

  borrarSolicitud(sol: Solicitud) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar la solicitud.',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this._solicitudService.borrarSolicitud(sol._id).subscribe(borrado => {
          this.socket.emit('deletesolicitud', sol);
        });
      }
    });
  }

  cargarDatosExcelD(datos) {
    this.SolicitudesExcel = [];
    datos.forEach(d => {
      let contenedoresDescarga = '';

      d.contenedores.forEach(x => {
        contenedoresDescarga +=
          'Contenedor: ' + x.contenedor + ' Tipo:' + x.tipo + '\n ,';
      });
      const solicitudes = {
        Fecha_Alta: d.fAlta.substring(0, 10),
        Agencia:
          d.agencia &&
          d.agencia.nombreComercial &&
          d.agencia.nombreComercial !== undefined &&
          d.agencia.nombreComercial !== '' &&
          d.agencia.nombreComercial,
        Cliente:
          d.cliente &&
          d.cliente.nombreComercial &&
          d.cliente.nombreComercial !== undefined &&
          d.cliente.nombreComercial !== '' &&
          d.cliente.nombreComercial,
        Viaje:
          d.viaje &&
            d.viaje.viaje &&
            d.viaje.viaje !== undefined &&
            d.viaje.viaje !== ''
            ? d.viaje.viaje
            : '' && d.viaje.viaje,
        Nombre_Buque:
          d.buque &&
            d.buque.nombre &&
            d.buque.nombre !== undefined &&
            d.buque.nombre !== ''
            ? d.buque.nombre
            : '' && d.buque.nombre,
        Observaciones: d.observaciones,
        Contenedores: contenedoresDescarga,
        Estatus: d.estatus
      };
      this.SolicitudesExcel.push(solicitudes);
    });
  }

  exportAsXLSXD(dtDescargas, nombre: string): void {
    this.cargarDatosExcelD(dtDescargas.filteredData);
    if (this.SolicitudesExcel) {
      this.excelService.exportAsExcelFile(this.SolicitudesExcel, nombre);
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  cargarDatosExcelC(datos) {
    datos.forEach(d => {
      let contendoresSolicitados = '';

      d.contenedores.forEach(c => {
        contendoresSolicitados +=
          'Tipo: ' + c.tipo + ' Grado: ' + c.grado + '\n';
      });

      const solicitudes = {
        Fecha_Alta: d.fAlta.substring(0, 10),
        Agencia:
          d.agencia &&
          d.agencia.nombreComercial &&
          d.agencia.nombreComercial !== undefined &&
          d.agencia.nombreComercial !== '' &&
          d.agencia.nombreComercial,
        Cliente:
          d.cliente &&
          d.cliente.nombreComercial &&
          d.cliente.nombreComercial !== undefined &&
          d.cliente.nombreComercial !== '' &&
          d.cliente.nombreComercial,
        Observaciones: d.observaciones,
        Solicitado: contendoresSolicitados,
        Estatus: d.estatus
      };
      this.SolicitudesExcel.push(solicitudes);
    });
  }

  exportAsXLSXC(dtCargas, nombre: string): void {
    this.cargarDatosExcelC(dtCargas.filteredData);
    if (this.SolicitudesExcel) {
      this.excelService.exportAsExcelFile(this.SolicitudesExcel, nombre);
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
}
