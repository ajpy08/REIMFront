import { Component, OnInit, ViewChild } from '@angular/core';
import { Solicitud } from './solicitud.models';
import { SolicitudService, UsuarioService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as _moment from 'moment';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

declare var swal: any;

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: ['l', 'L'],
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styles: [],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
  ],
})
export class SolicitudesComponent implements OnInit {

  fIni = moment().local().startOf('day').subtract(1, 'month');
  fFin = moment().local().startOf('day');

  @ViewChild(MatPaginator) paginator: MatPaginator; //descargas
  @ViewChild(MatSort) sort: MatSort; //descargas

  @ViewChild('pagCargas', { read: MatPaginator }) pagCargas: MatPaginator; //cargas
  @ViewChild('sortCargas') sortCargas: MatSort; //cargas

  cargando = true;
  displayedColumnsDescarga = ['actions', 'fAlta', 'agencia.nombreComercial', 'naviera.nombreComercial', 'cliente.nombreComercial', 'viaje.viaje', 'buque.nombre',
    'observaciones', 'contenedores', 'estatus'];

  displayedColumnsCarga = ['actions', 'fAlta', 'agencia.nombreComercial', 'cliente.nombreComercial', 'observaciones', 'solicitado', 'estatus'];

  dtCargas: any;
  dtDescargas: any;
  totalRegistrosDescargas = 0;
  totalRegistrosCargas = 0;
  usuarioLogueado: any;

  constructor(public _solicitudService: SolicitudService, private _usuarioService: UsuarioService) { }
  ngOnInit() {
    this.usuarioLogueado = this._usuarioService.usuario;
    this.cargarSolicitudes('D');
    this.cargarSolicitudes('C');
  }
  cargarSolicitudes(CD: string) {
    this.cargando = true;
    if (this.usuarioLogueado.role === 'ADMIN_ROLE') {
      if (CD == 'D') {
        this._solicitudService.getSolicitudes('D', null,
          this.fIni ? this.fIni.utc().format('DD-MM-YYYY') : '',
          this.fFin ? this.fFin.utc().format('DD-MM-YYYY') : '')
          .subscribe(res => {
            this.totalRegistrosDescargas = res.total;
            this.dtDescargas = new MatTableDataSource(res.solicitudes);
            this.dtDescargas.sort = this.sort;
            this.dtDescargas.paginator = this.paginator;
          });
      } else if (CD == 'C') {
        this._solicitudService.getSolicitudes('C', null,
          this.fIni ? this.fIni.utc().format('DD-MM-YYYY') : '',
          this.fFin ? this.fFin.utc().format('DD-MM-YYYY') : '')
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
      if (CD == 'D') {
        this._solicitudService.getSolicitudes('D', null,
          this.fIni ? this.fIni.utc().format('DD-MM-YYYY') : '',
          this.fFin ? this.fFin.utc().format('DD-MM-YYYY') : '', agencias)
          .subscribe(res => {
            this.totalRegistrosDescargas = res.total;
            this.dtDescargas = new MatTableDataSource(res.solicitudes);
            this.dtDescargas.sort = this.sort;
            this.dtDescargas.paginator = this.paginator;
          });
      } else if (CD == 'C') {
        this._solicitudService.getSolicitudes('C', null,
          this.fIni ? this.fIni.utc().format('DD-MM-YYYY') : '',
          this.fFin ? this.fFin.utc().format('DD-MM-YYYY') : '', agencias)
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
    this.dtCargas.filter = filterValue;
    this.totalRegistrosCargas = this.dtCargas.filteredData.length;
  }

  applyFilterDescargas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dtDescargas.filter = filterValue;
    this.totalRegistrosDescargas = this.dtDescargas.filteredData.length;
  }

  borrarSolicitud(sol: Solicitud) {
    swal({ title: '¿Esta seguro?', text: 'Esta apunto de borrar la solicitud.', icon: 'warning', buttons: true, dangerMode: true, })
      .then(borrar => {
        if (borrar) {
          this._solicitudService.borrarSolicitud(sol._id)
            .subscribe(borrado => {
              this.cargarSolicitudes(sol.tipo);
            });
        }
      });
  }

}
