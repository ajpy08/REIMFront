import { Component, OnInit, ViewChild } from '@angular/core';
import { ManiobraService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {ETAPAS_MANIOBRA} from '../../config/config';

@Component({
  selector: 'app-manibras',
  templateUrl: './maniobras.component.html',
  styles: ['./maniobras.component.css'],
  providers: [],
})
export class ManiobrasComponent implements OnInit {

  cargando = true;
  totalTransito = 0;
  totalEspera = 0;
  totalRevision = 0;
  totalLavadoReparacion = 0;
  totalXCargar = 0;


  displayedColumnsTransito = ['actions', 'cargaDescarga', 'folio', 'viaje', 'buque', 'transportista', 'contenedor', 'tipo',
  'peso', 'cliente', 'agencia'];

  displayedColumnsEspera = ['actions', 'cargaDescarga', 'folio', 'viaje', 'buque', 'transportista', 'contenedor', 'tipo',
  'peso', 'cliente', 'agencia'];

  displayedColumnsRevision = ['actions', 'folio', 'viaje', 'buque', 'transportista', 'contenedor', 'tipo',
  'peso', 'cliente', 'agencia', 'grado'];

  displayedColumnsLavadoReparacion = ['actions', 'contenedor', 'tipo', 'peso', 'cliente', 'agencia', 'lavado', 'reparaciones', 'grado'];

  displayedColumnsXCargar = ['actions', 'transportista', 'grado', 'tipo', 'peso', 'cliente', 'agencia'];

  dtTransito: any;
  dtEspera: any;
  dtRevision: any;
  dtLavadoReparacion: any;
  dtXCargar: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(public _maniobraService: ManiobraService) { }
  ngOnInit() {
    this.cargarManiobras();
  }

  applyFilterTransito(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dtTransito.filter = filterValue;
    this.totalTransito = this.dtTransito.filteredData.length;
  }

  applyFilterEspera(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dtEspera.filter = filterValue;
    this.totalEspera = this.dtEspera.filteredData.length;
  }

  applyFilterRevision(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dtRevision.filter = filterValue;
    this.totalRevision = this.dtRevision.filteredData.length;
  }

  applyFilterLavadoRevision(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dtLavadoReparacion.filter = filterValue;
    this.totalLavadoReparacion = this.dtLavadoReparacion.filteredData.length;
  }

  applyFilterXCargar(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dtXCargar.filter = filterValue;
    this.totalXCargar = this.dtXCargar.filteredData.length;
  }

  cargarManiobras() {
    this.cargando = true;
    this._maniobraService.getManiobras(null, ETAPAS_MANIOBRA.TRANSITO)
    .subscribe(maniobras => {
      this.dtTransito = new MatTableDataSource(maniobras.maniobras);
      this.dtTransito.sort = this.sort;
      this.dtTransito.paginator = this.paginator;
      this.totalTransito = maniobras.total;
    });
    this.cargando = false;

    this._maniobraService.getManiobras(null, ETAPAS_MANIOBRA.ESPERA)
    .subscribe(maniobras => {
      this.dtEspera = new MatTableDataSource(maniobras.maniobras);
      this.dtEspera.sort = this.sort;
      this.dtEspera.paginator = this.paginator;
      this.totalEspera = maniobras.total;
    });

    this.cargando = false;

    this._maniobraService.getManiobras(null, ETAPAS_MANIOBRA.REVISION)
      .subscribe(maniobras => {
        this.dtRevision = new MatTableDataSource(maniobras.maniobras);
        this.dtRevision.sort = this.sort;
        this.dtRevision.paginator = this.paginator;
        this.totalRevision = maniobras.total;
      });
      this.cargando = false;

    this._maniobraService.getManiobras(null, ETAPAS_MANIOBRA.LAVADO_REPARACION)
      .subscribe(maniobras => {
        this.dtLavadoReparacion = new MatTableDataSource(maniobras.maniobras);
        this.dtLavadoReparacion.sort = this.sort;
        this.dtLavadoReparacion.paginator = this.paginator;
        this.totalLavadoReparacion = maniobras.total;
      });
      this.cargando = false;
    this._maniobraService.getManiobras(null, ETAPAS_MANIOBRA.XCARGAR)
    .subscribe(maniobras => {
      this.dtXCargar = new MatTableDataSource(maniobras.maniobras);
      this.dtXCargar.sort = this.sort;
      this.dtXCargar.paginator = this.paginator;
      this.totalXCargar = maniobras.total;
    });
    this.cargando = false;      
  }
}



