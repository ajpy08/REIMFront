import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { ManiobraService, UsuarioService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource, MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { ETAPAS_MANIOBRA, ROLES } from '../../config/config';
import { Usuario } from '../usuarios/usuario.model';
import { Router } from '@angular/router';

declare var swal: any;

@Component({
  selector: 'app-manibras',
  templateUrl: './maniobras.component.html',
  providers: [],
})
export class ManiobrasComponent implements OnInit {

  cargando = true;
  totalTransito = 0;
  totalEspera = 0;
  totalRevision = 0;
  totalLavadoReparacion = 0;
  totalXCargar = 0;


  displayedColumnsTransito = ['actions', 'cargaDescarga', 'folio', 'viaje.viaje', 'viaje.buque.nombre', 'transportista.nombreComercial', 'contenedor', 'tipo',
    'peso', 'cliente.nombreComercial', 'agencia.nombreComercial'];

  displayedColumnsEspera = ['actions', 'cargaDescarga', 'folio', 'viaje.viaje', 'viaje.buque.nombre', 'transportista.nombreComercial', 'contenedor', 'tipo',
    'peso', 'cliente.nombreComercial', 'agencia.nombreComercial'];

  displayedColumnsRevision = ['actions', 'descargaAutorizada', 'folio', 'viaje.viaje', 'viaje.buque.nombre', 'transportista.nombreComercial', 'contenedor', 'tipo',
    'peso', 'cliente.nombreComercial', 'agencia.nombreComercial', 'grado', 'lavado', 'fotosreparacion'];

  displayedColumnsLavadoReparacion = ['actions', 'contenedor', 'tipo', 'peso', 'cliente.nombreComercial', 'viaje.viaje', 'viaje.buque.nombre', 'agencia.nombreComercial', 'lavado', 'reparaciones', 'grado'];

  displayedColumnsXCargar = ['actions', 'folio', 'transportista.nombreComercial', 'grado', 'tipo', 'peso', 'cliente.nombreComercial', 'agencia.nombreComercial'];

  dtTransito: any;
  dtEspera: any;
  dtRevision: any;
  dtLavadoReparacion: any;
  dtXCargar: any;

  usuarioLogueado: Usuario;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('pagEspera', { read: MatPaginator }) pagEspera: MatPaginator;
  @ViewChild('pagRevision', { read: MatPaginator }) pagRevision: MatPaginator;
  @ViewChild('pagLR', { read: MatPaginator }) pagLR: MatPaginator;
  @ViewChild('pagXCargar', { read: MatPaginator }) pagXCargar: MatPaginator;



  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sortEspera') sortEspera: MatSort;
  @ViewChild('sortRevision') sortRevision: MatSort;
  @ViewChild('sortLR') sortLR: MatSort;
  @ViewChild('sortXCargar') sortXCargar: MatSort;


  constructor(public _maniobraService: ManiobraService, private usuarioService: UsuarioService,
    private router: Router) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;

    if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.PATIOADMIN_ROLE) {
      this.displayedColumnsRevision = ['actions', 'descargaAutorizada', 'folio', 'viaje.viaje', 'viaje.buque.nombre', 'transportista.nombreComercial', 'contenedor', 'tipo',
        'peso', 'cliente.nombreComercial', 'agencia.nombreComercial', 'grado', 'lavado', 'fotosreparacion'];
    } else {
      this.displayedColumnsRevision = ['actions', 'folio', 'viaje.viaje', 'viaje.buque.nombre', 'transportista.nombreComercial', 'contenedor', 'tipo',
        'peso', 'cliente.nombreComercial', 'agencia.nombreComercial', 'grado', 'lavado', 'fotosreparacion'];
    }
    this.cargarManiobras();
    let indexTAB = localStorage.getItem("AprobSolicitudes");
    if (indexTAB) {
      this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
    }
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

  onLinkClick(event: MatTabChangeEvent) {
    localStorage.setItem("AprobSolicitudes", event.index.toString());
  }

  cargarManiobras() {
    this.cargando = true;
    this._maniobraService.getManiobras(null, ETAPAS_MANIOBRA.TRANSITO)
      .subscribe(maniobras => {
        this.dtTransito = new MatTableDataSource(maniobras.maniobras);
        this.dtTransito.sortingDataAccessor = (item, property) => {
          if (property.includes('.')) return property.split('.').reduce((o, i) => o ? o[i] : undefined, item)
          return item[property];
        };
        this.dtTransito.sort = this.sort;
        this.dtTransito.paginator = this.paginator;
        this.totalTransito = maniobras.total;
        this.dtTransito.filterPredicate = this.Filtro();
      });


    this._maniobraService.getManiobras(null, ETAPAS_MANIOBRA.ESPERA)
      .subscribe(maniobras => {
        this.dtEspera = new MatTableDataSource(maniobras.maniobras);
        this.dtEspera.sortingDataAccessor = (item, property) => {
          if (property.includes('.')) return property.split('.').reduce((o, i) => o ? o[i] : undefined, item)
          return item[property];
        };
        this.dtEspera.sort = this.sortEspera;
        this.dtEspera.paginator = this.pagEspera;
        this.totalEspera = maniobras.total;
        this.dtEspera.filterPredicate = this.Filtro();

      });

    this._maniobraService.getManiobras(null, ETAPAS_MANIOBRA.REVISION)
      .subscribe(maniobras => {
        this.dtRevision = new MatTableDataSource(maniobras.maniobras);
        this.dtRevision.sortingDataAccessor = (item, property) => {
          if (property.includes('.')) return property.split('.').reduce((o, i) => o ? o[i] : undefined, item)
          return item[property];
        };
        this.dtRevision.sort = this.sortRevision;
        this.dtRevision.paginator = this.pagRevision;
        this.totalRevision = maniobras.total;
        this.dtRevision.filterPredicate = this.Filtro();
      });

    this._maniobraService.getManiobras(null, ETAPAS_MANIOBRA.LAVADO_REPARACION)
      .subscribe(maniobras => {
        this.dtLavadoReparacion = new MatTableDataSource(maniobras.maniobras);

        this.dtLavadoReparacion.sortingDataAccessor = (item, property) => {
          if (property.includes('.')) return property.split('.').reduce((o, i) => o ? o[i] : undefined, item)
          return item[property];
        };

        this.dtLavadoReparacion.sort = this.sortLR;
        this.dtLavadoReparacion.paginator = this.pagLR;
        this.totalLavadoReparacion = maniobras.total;
        this.dtLavadoReparacion.filterPredicate = this.Filtro();

      });
    this._maniobraService.getManiobras(null, ETAPAS_MANIOBRA.XCARGAR)
      .subscribe(maniobras => {
        this.dtXCargar = new MatTableDataSource(maniobras.maniobras);
        this.dtXCargar.sortingDataAccessor = (item, property) => {
          if (property.includes('.')) return property.split('.').reduce((o, i) => o ? o[i] : undefined, item)
          return item[property];
        };
        this.dtXCargar.sort = this.sortXCargar;
        this.dtXCargar.paginator = this.pagXCargar;
        this.totalXCargar = maniobras.total;
        this.dtEspera.filterPredicate = this.Filtro();
        this.cargando = false;
      });

  }

  habilitaDeshabilitaPermisoDescargaManiobra(maniobra, event) {

    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de cambiar el permiso de Descarga del contenedor ' + maniobra.contenedor,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(resp => {
        if (resp) {
          this._maniobraService.habilitaDeshabilitaDescargaAutorizada(maniobra, event.checked)
            .subscribe(borrado => {
              this._maniobraService.getManiobras(null, ETAPAS_MANIOBRA.REVISION)
                .subscribe(maniobras => {
                  this.dtRevision = new MatTableDataSource(maniobras.maniobras);
                  this.dtRevision.sort = this.sort;
                  this.dtRevision.paginator = this.paginator;
                  this.totalRevision = maniobras.total;
                });
            });
        } else {
          event.source.checked = !event.checked;
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

  // edit(id: string) {
  //   localStorage.setItem('history', '/maniobras');

  //   this.router.navigate(['/maniobras/maniobra/' + id + '/termina_lavado_reparacion']);
  // }

  open(id: string) {
    var history;
    var array = [];
    //Si tengo algo en localStorage en la variable history lo obtengo       
    if (localStorage.getItem('historyArray')) {
      //asigno a mi variable history lo que obtengo de localStorage (historyArray)
      history = JSON.parse(localStorage.getItem('historyArray'));

      //realizo este ciclo para asignar los valores del JSON al Array
      for (var i in history) {
        array.push(history[i]);
      }
    }    
    //Agrego mi nueva ruta al array
    array.push("/maniobras");


    ////sobreescribo la variable historyArray de localStorage con el nuevo JSON que incluye ya, la nueva ruta.
    localStorage.setItem('historyArray', JSON.stringify(array));

    //Voy a pagina.
    this.router.navigate(['/maniobras/maniobra/' + id + '/termina_lavado_reparacion']);
  }

}



