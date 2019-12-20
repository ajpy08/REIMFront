import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { ManiobraService, UsuarioService, ExcelService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource, MatTabGroup, MatTabChangeEvent } from '@angular/material';
import { ETAPAS_MANIOBRA, ROLES } from '../../config/config';
import { Usuario } from '../usuarios/usuario.model';
import { Router, NavigationExtras } from '@angular/router';

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
  totalXAprobar = 0;


  displayedColumnsTransito = ['actions', 'cargaDescarga', 'folio', 'viaje.viaje', 'viaje.buque.nombre', 'solicitud.blBooking', 'transportista.nombreComercial', 'contenedor', 'tipo',
    'peso', 'cliente.nombreComercial', 'agencia.nombreComercial'];

  displayedColumnsEspera = ['actions', 'cargaDescarga', 'folio', 'viaje.viaje', 'viaje.buque.nombre', 'solicitud.blBooking', 'transportista.nombreComercial', 'contenedor', 'tipo',
    'peso', 'cliente.nombreComercial', 'agencia.nombreComercial'];

  displayedColumnsRevision = ['actions', 'descargaAutorizada', 'folio', 'viaje.viaje', 'viaje.buque.nombre', 'solicitud.blBooking', 'transportista.nombreComercial', 'contenedor', 'tipo',
    'peso', 'cliente.nombreComercial', 'agencia.nombreComercial', 'grado', 'lavado', 'fotosreparacion'];

  displayedColumnsLavadoReparacion = ['actions', 'contenedor', 'tipo', 'peso', 'cliente.nombreComercial', 'viaje.viaje', 'viaje.buque.nombre', 'solicitud.blBooking', 'agencia.nombreComercial', 'lavado', 'reparaciones', 'grado'];

  displayedColumnsXCargar = ['actions', 'folio', 'transportista.nombreComercial', 'grado', 'tipo', 'peso', 'cliente.nombreComercial', 'agencia.nombreComercial', 'solicitud.blBooking'];

  displayedColumnsXAprobar = ['actions', 'cargaDescarga', 'folio', 'viaje.viaje', 'viaje.buque.nombre', 'solicitud.blBooking', 'transportista.nombreComercial', 'contenedor', 'tipo',
    'peso', 'cliente.nombreComercial', 'agencia.nombreComercial'];
  
  dtTransito: any;
  dtEspera: any;
  dtRevision: any;
  dtLavadoReparacion: any;
  dtXCargar: any;
  dtXAprobar: any;
  maniobrasExcel = [];

  usuarioLogueado: Usuario;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('pagEspera', { read: MatPaginator }) pagEspera: MatPaginator;
  @ViewChild('pagRevision', { read: MatPaginator }) pagRevision: MatPaginator;
  @ViewChild('pagLR', { read: MatPaginator }) pagLR: MatPaginator;
  @ViewChild('pagXCargar', { read: MatPaginator }) pagXCargar: MatPaginator;
  @ViewChild('pagXAprobar', { read: MatPaginator }) pagXAprobar: MatPaginator;



  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('sortEspera') sortEspera: MatSort;
  @ViewChild('sortRevision') sortRevision: MatSort;
  @ViewChild('sortLR') sortLR: MatSort;
  @ViewChild('sortXCargar') sortXCargar: MatSort;
  @ViewChild('sortXAprobar') sortXAprobar: MatSort;


  constructor(public _maniobraService: ManiobraService, private usuarioService: UsuarioService,
    private router: Router, private excelService: ExcelService) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;

    if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.PATIOADMIN_ROLE) {
      this.displayedColumnsRevision = ['actions', 'descargaAutorizada', 'folio', 'viaje.viaje', 'viaje.buque.nombre', 'solicitud.blBooking', 'transportista.nombreComercial', 'contenedor', 'tipo',
        'peso', 'cliente.nombreComercial', 'agencia.nombreComercial', 'grado', 'lavado', 'fotosreparacion'];
    } else {
      this.displayedColumnsRevision = ['actions', 'folio', 'viaje.viaje', 'viaje.buque.nombre', 'solicitud.blBooking', 'transportista.nombreComercial', 'contenedor', 'tipo',
        'peso', 'cliente.nombreComercial', 'agencia.nombreComercial', 'grado', 'lavado', 'fotosreparacion'];
    }
    this.cargarManiobras();
    let indexTAB = localStorage.getItem("ManiobrasTabs");

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
  applyFilterXAprobar(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dtXAprobar.filter = filterValue;
    this.totalXAprobar = this.dtXAprobar.filteredData.length;
  }

  onLinkClick(event: MatTabChangeEvent) {
    localStorage.setItem("ManiobrasTabs", event.index.toString());
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
        this.dtXCargar.filterPredicate = this.Filtro();

      });

      this._maniobraService.getManiobras(null, ETAPAS_MANIOBRA.APROBACION)
      .subscribe(maniobras => {
        this.dtXAprobar = new MatTableDataSource(maniobras.maniobras);
        this.dtXAprobar.sortingDataAccessor = (item, property) => {
          if (property.includes('.')) return property.split('.').reduce((o, i) => o ? o[i] : undefined, item)
          return item[property];
        };
        this.dtXAprobar.sort = this.sortXAprobar;
        this.dtXAprobar.paginator = this.pagXAprobar;
        this.totalXAprobar = maniobras.total;
        this.dtXAprobar.filterPredicate = this.Filtro();
      });

    this.cargando = false;
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
      const dataStr = (data.contenedor ? data.contenedor.toLowerCase() : '') +
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

  open(id: string, tag: string) {
    var history;
    var array = [];
    //Si tengo algo en localStorage en la variable history lo obtengo
    if (localStorage.getItem('historyArray')) {
      //asigno a mi variable historyArray lo que obtengo de localStorage (historyArray)
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
    this.router.navigate(['/maniobras/maniobra/' + id + '/' + tag]);
  }

  crearDatosExcel(datos) {

    this.maniobrasExcel = [];
    datos.forEach(d => {
      var maniobras = {
        Carga_O_Descarga: d.cargaDescarga,
        Folio: d.folio,
        Viaje: d.viaje && d.viaje.viaje && d.viaje.viaje != undefined && d.viaje.viaje != '' ? d.viaje.viaje : '' && d.viaje.viaje,
        Nombre_Buque: d.viaje && d.viaje.buque.nombre && d.viaje.buque.nombre != undefined && d.viaje.buque.nombre != '' ? d.viaje.buque.nombre : '' && d.viaje.buque.nombre,
        Booking: d.solicitud && d.solicitud.blBooking && d.solicitud.blBooking != undefined && d.solicitud.blBooking != '' ? d.solicitud.blBooking : '' && d.solicitud.blBooking,
        Transportista: d.transportista && d.transportista.nombreComercial && d.transportista.nombreComercial != undefined && d.transportista.nombreComercial != '' && d.transportista.nombreComercial,
        Contenedor: d.contenedor,
        Tipo: d.tipo,
        Peso: d.peso,
        Cliente: d.cliente && d.cliente.nombreComercial && d.cliente.nombreComercial != undefined && d.cliente.nombreComercial != '' && d.cliente.nombreComercial,
        Agencia: d.agencia && d.agencia.nombreComercial && d.agencia.nombreComercial != undefined && d.agencia.nombreComercial != '' && d.agencia.nombreComercial,

      }
      this.maniobrasExcel.push(maniobras);
    });

  }
  exportAsXLSX(dtTransito, nombre: string): void {
    this.crearDatosExcel(dtTransito.filteredData);
    if (this.maniobrasExcel) {
      this.excelService.exportAsExcelFile(this.maniobrasExcel, nombre);
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  openFotos(id: string, tipo: string) {

    let navigationExtras: NavigationExtras = {
      queryParams: { 'opcion': tipo }
    };

    var history;
    var array = [];
    //Si tengo algo en localStorage en la variable historyArray lo obtengo
    if (localStorage.getItem('historyArray')) {
      //asigno a mi variable historyArray lo que obtengo de localStorage (historyArray)
      history = JSON.parse(localStorage.getItem('historyArray'));

      //realizo este ciclo para asignar los valores del JSON al Array
      for (var i in history) {
        array.push(history[i]);
      }
    }
    //Agrego mi nueva ruta a donde debo regresar al array
    array.push("/maniobras");

    //sobreescribo la variable historyArray de localStorage con el nuevo JSON que incluye ya, la nueva ruta.
    localStorage.setItem('historyArray', JSON.stringify(array));

    //Voy a pagina.
    this.router.navigate(['/fotos', id], navigationExtras);
  }


  exportAsXLSXespera(dtEspera, nombre: string): void {
    this.crearDatosExcel(dtEspera.filteredData);
    if (this.maniobrasExcel) {
      this.excelService.exportAsExcelFile(this.maniobrasExcel, nombre);
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  crearDatosExcelRevision(datos) {

    this.maniobrasExcel = [];
    datos.forEach(d => {
      var maniobras = {
        Descarga_Autorizada: d.descargaAutorizada,
        Folio: d.folio,
        Viaje: d.viaje && d.viaje.viaje && d.viaje.viaje != undefined && d.viaje.viaje != '' ? d.viaje.viaje : '' && d.viaje.viaje,
        Nombre_Buque: d.viaje && d.viaje.buque.nombre && d.viaje.buque.nombre != undefined && d.viaje.buque.nombre != '' ? d.viaje.buque.nombre : '' && d.viaje.buque.nombre,
        Booking: d.solicitud && d.solicitud.blBooking && d.solicitud.blBooking != undefined && d.solicitud.blBooking != '' ? d.solicitud.blBooking : '' && d.solicitud.blBooking,
        Transportista: d.transportista && d.transportista.nombreComercial && d.transportista.nombreComercial != undefined && d.transportista.nombreComercial != '' && d.transportista.nombreComercial,
        Contenedor: d.contenedor,
        Tipo: d.tipo,
        Peso: d.peso,
        Cliente: d.cliente && d.cliente.nombreComercial && d.cliente.nombreComercial != undefined && d.cliente.nombreComercial != '' && d.cliente.nombreComercial,
        Agencia: d.agencia && d.agencia.nombreComercial && d.agencia.nombreComercial != undefined && d.agencia.nombreComercial != '' && d.agencia.nombreComercial,
        Grado: d.grado,
        lavado: d.lavado,

      }
      this.maniobrasExcel.push(maniobras);
    });
  }

  exportAsXLSXRevision(dtRevision, nombre: string): void {
    this.crearDatosExcelRevision(dtRevision.filteredData);
    if (this.maniobrasExcel) {
      this.excelService.exportAsExcelFile(this.maniobrasExcel, nombre);
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  crearDatosExcelLavado(datos) {

    this.maniobrasExcel = [];
    datos.forEach(d => {
      var maniobras = {

        Contenedor: d.contenedor,
        Tipo: d.tipo,
        Peso: d.peso,
        Cliente: d.cliente && d.cliente.nombreComercial && d.cliente.nombreComercial != undefined && d.cliente.nombreComercial != '' && d.cliente.nombreComercial,
        Viaje: d.viaje && d.viaje.viaje && d.viaje.viaje != undefined && d.viaje.viaje != '' ? d.viaje.viaje : '' && d.viaje.viaje,
        Nombre_Buque: d.viaje.buque && d.viaje.buque != undefined && d.viaje.buque.nombre != '' ? d.viaje.buque.nombre : '' && d.viaje.buque.nombre,
        Booking: d.solicitud && d.solicitud.blBooking && d.solicitud.blBooking != undefined && d.solicitud.blBooking != '' ? d.solicitud.blBooking : '' && d.solicitud.blBooking,
        Agencia: d.agencia && d.agencia.nombreComercial && d.agencia.nombreComercial != undefined && d.agencia.nombreComercial != '' && d.agencia.nombreComercial,
        lavado: d.lavado,
        Reparacion: d.reparaciones,
        Grado: d.grado,
      }
      this.maniobrasExcel.push(maniobras);
    });
  }

  exportAsXLSXLavado(dtLavadoReparacion, nombre: string): void {
    this.crearDatosExcelLavado(dtLavadoReparacion.filteredData);
    if (this.maniobrasExcel) {
      this.excelService.exportAsExcelFile(this.maniobrasExcel, nombre);
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  crearDatosExcelX(datos) {

    this.maniobrasExcel = [];
    datos.forEach(d => {
      var maniobras = {
        Folio: d.folio,
        Transportista: d.transportista && d.transportista.nombreComercial && d.transportista.nombreComercial != undefined && d.transportista.nombreComercial != '' && d.transportista.nombreComercial,
        Grado: d.grado,
        Tipo: d.tipo,
        Peso: d.peso,
        Cliente: d.cliente && d.cliente.nombreComercial && d.cliente.nombreComercial != undefined && d.cliente.nombreComercial != '' && d.cliente.nombreComercial,
        Agencia: d.agencia && d.agencia.nombreComercial && d.agencia.nombreComercial != undefined && d.agencia.nombreComercial != '' && d.agencia.nombreComercial,
        Booking: d.solicitud && d.solicitud.blBooking && d.solicitud.blBooking != undefined && d.solicitud.blBooking != '' ? d.solicitud.blBooking : '' && d.solicitud.blBooking,
      }
      this.maniobrasExcel.push(maniobras);
    });
  }

  exportAsXLSXX(dtXCargar, nombre: string): void {
    this.crearDatosExcelX(dtXCargar.filteredData);
    if (this.maniobrasExcel) {
      this.excelService.exportAsExcelFile(this.maniobrasExcel, nombre);
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
}

