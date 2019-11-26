import { Component, OnInit, ViewChild } from '@angular/core';
import { Solicitud } from './solicitud.models';
import { SolicitudService } from '../../services/service.index';
import { MatTabGroup, MatTabChangeEvent, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
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
  selector: 'app-aprobaciones',
  templateUrl: './aprobaciones.component.html',
  styles: [],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
  ],
})
export class AprobacionesComponent implements OnInit {

  fIni = moment().local().startOf('day').subtract(1, 'month');
  fFin = moment().local().startOf('day');

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  // @ViewChild(MatPaginator) paginator: MatPaginator; //descargas
  // @ViewChild(MatSort) sort: MatSort; //descargas

  @ViewChild('pagDescargas', { read: MatPaginator }) pagDescargas: MatPaginator; //cargas
  @ViewChild('sortDescargas') sortDescargas: MatSort; //cargas

  @ViewChild('pagCargas', { read: MatPaginator }) pagCargas: MatPaginator; //cargas
  @ViewChild('sortCargas') sortCargas: MatSort; //cargas

  cargando = true;

  displayedColumnsDescarga = ['actions', 'fAlta', 'tipo', 'agencia.nombreComercial', 'naviera.nombreComercial', 'cliente.nombreComercial', 'viaje.viaje', 'buque.nombre',
    'observaciones', 'estatus'];

  displayedColumnsCarga = ['actions', 'fAlta', 'tipo', 'agencia.nombreComercial', 'cliente.nombreComercial', 'observaciones', 'estatus'];

  dtCargas: any;
  dtDescargas: any;
  totalRegistrosDescargas = 0;
  totalRegistrosCargas = 0;

  constructor(public _solicitudesService: SolicitudService) { }

  ngOnInit() {
    this.cargaSolicitudes('D');
    this.cargaSolicitudes('C');
    let indexTAB = localStorage.getItem("AprobacionTabs");
    if (indexTAB) {
      this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
    }
  }

  cargaSolicitudes(CD: string) {
    if (CD == 'D') {
      this.cargando = true;
      this._solicitudesService.getSolicitudes('D', null,
        this.fIni ? this.fIni.utc().format('DD-MM-YYYY') : '',
        this.fFin ? this.fFin.utc().format('DD-MM-YYYY') : '')
        .subscribe(resp => {
          this.dtDescargas = new MatTableDataSource(resp.solicitudes);
          // this.dtDescargas.sortingDataAccessor = (item, property) => {
          //   if (property.includes('.')) return property.split('.').reduce((o, i) => o ? o[i] : undefined, item)
          //   return item[property];
          // };
          this.dtDescargas.sort = this.sortDescargas;
          this.dtDescargas.paginator = this.pagDescargas;
          this.totalRegistrosDescargas = resp.total;
          //this.dtDescargas.filterPredicate  = this.Filtro();
          this.cargando = false;
        });
    } else if (CD == 'C') {
      this.cargando = true;
      this._solicitudesService.getSolicitudes('C', null,
        this.fIni ? this.fIni.utc().format('DD-MM-YYYY') : '',
        this.fFin ? this.fFin.utc().format('DD-MM-YYYY') : '')
        .subscribe(resp => {
          //this.dtCargas = resp.solicitudes;
          this.dtCargas = new MatTableDataSource(resp.solicitudes);
          // this.dtCargas.sortingDataAccessor = (item, property) => {
          //   if (property.includes('.')) return property.split('.').reduce((o, i) => o ? o[i] : undefined, item)
          //   return item[property];
          // };
          this.dtCargas.sort = this.sortCargas;
          this.dtCargas.paginator = this.pagCargas;
          this.totalRegistrosCargas = resp.total;
          //this.dtCargas.filterPredicate  = this.Filtro();
          this.cargando = false;
        });
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

  onLinkClick(event: MatTabChangeEvent) {
    //console.log(event.index);
    localStorage.setItem("AprobacionTabs", event.index.toString());
  }

  borrarSolicitud(sol: Solicitud) {
    swal({ title: '¿Esta seguro?', text: 'Esta apunto de borrar la solicitud.', icon: 'warning', buttons: true, dangerMode: true, })
      .then(borrar => {
        if (borrar) {
          this._solicitudesService.borrarSolicitud(sol._id)
            .subscribe(borrado => {
              this.cargaSolicitudes(sol.tipo);
            });
        }
      });
  }

  // Filtro(): (data: any, filter: string) => boolean {
  //   let filterFunction = function (data, filter): boolean {
  //     const dataStr = data.contenedor.toLowerCase() +
  //       (data.folio ? data.folio : '') +
  //       data.tipo.toLowerCase() +
  //       data.peso.toLowerCase() +
  //       (data.viaje ? data.viaje.viaje.toLowerCase() : '') +
  //       (data.cliente ? data.cliente.nombreComercial.toLowerCase() : '') +
  //       (data.viaje ? data.viaje.buque.nombre.toLowerCase() : '') +
  //       (data.agencia ? data.agencia.nombreComercial.toLowerCase() : '');
  //     return dataStr.indexOf(filter) != -1;
  //   }
  //   return filterFunction;
  // }
}
