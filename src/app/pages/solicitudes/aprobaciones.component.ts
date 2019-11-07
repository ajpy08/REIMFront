import { Component, OnInit, ViewChild } from '@angular/core';
import { Solicitud } from './solicitud.models';
import { SolicitudService } from '../../services/service.index';
import { MatTabGroup, MatTabChangeEvent, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

declare var swal: any;

@Component({
  selector: 'app-aprobaciones',
  templateUrl: './aprobaciones.component.html',
  styles: []
})
export class AprobacionesComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator; //descargas
  @ViewChild('pagCargas', { read: MatPaginator }) pagCargas: MatPaginator; //cargas
  
  @ViewChild(MatSort) sort: MatSort; //descargas
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
    this.cargaSolicitudes();
    let indexTAB = localStorage.getItem("AprobSolicitudes");
    if (indexTAB) {
      this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
    }
  }

  cargaSolicitudes() {
    this.cargando = true;
    this._solicitudesService.getSolicitudes('D')
      .subscribe(resp => {

        this.dtDescargas = new MatTableDataSource(resp.solicitudes);
        this.dtDescargas.sortingDataAccessor = (item, property) => {
          if (property.includes('.')) return property.split('.').reduce((o, i) => o ? o[i] : undefined, item)
          return item[property];
        };
        this.dtDescargas.sort = this.sort;
        this.dtDescargas.paginator = this.paginator;
        this.totalRegistrosDescargas = resp.total;
        //this.dtDescargas.filterPredicate  = this.Filtro();
        this.cargando = false;
      });
    this.cargando = true;
    this._solicitudesService.getSolicitudes('C')
      .subscribe(resp => {
        //this.dtCargas = resp.solicitudes;
        this.dtCargas = new MatTableDataSource(resp.solicitudes);
        this.dtCargas.sortingDataAccessor = (item, property) => {
          if (property.includes('.')) return property.split('.').reduce((o, i) => o ? o[i] : undefined, item)
          return item[property];
        };
        this.dtCargas.sort = this.sortCargas;
        this.dtCargas.paginator = this.pagCargas;
        this.totalRegistrosCargas = resp.total;
        //this.dtCargas.filterPredicate  = this.Filtro();
        this.cargando = false;
      });
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
    localStorage.setItem("AprobSolicitudes", event.index.toString());
  }

  borrarSolicitud(sol: Solicitud) {
    swal({ title: '¿Esta seguro?', text: 'Esta apunto de borrar la solicitud.', icon: 'warning', buttons: true, dangerMode: true, })
      .then(borrar => {
        if (borrar) {
          this._solicitudesService.borrarSolicitud(sol._id)
            .subscribe(borrado => {
              this.cargaSolicitudes();
            });
        }
      });
  }

  Filtro(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      const dataStr = data.contenedor.toLowerCase() +
        (data.folio ? data.folio : '') +
        data.tipo.toLowerCase() +
        data.peso.toLowerCase() +
        (data.viaje ? data.viaje.viaje.toLowerCase() : '') +
        (data.cliente ? data.cliente.nombreComercial.toLowerCase() : '') +
        (data.viaje ? data.viaje.buque.nombre.toLowerCase() : '') +
        (data.agencia ? data.agencia.nombreComercial.toLowerCase() : '');
      return dataStr.indexOf(filter) != -1;
    }
    return filterFunction;
  }
}
