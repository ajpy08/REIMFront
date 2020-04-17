import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ManiobraService,
  UsuarioService
} from '../../../services/service.index';
import {
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatTabGroup,
  MatTabChangeEvent
} from '@angular/material';
import { ROLES } from 'src/app/config/config';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import * as io from 'socket.io-client';
import swal from 'sweetalert';
@Component({
  selector: 'app-solicitudes.transportista',
  templateUrl: './solicitudes_transportista.component.html',
  styles: [],
  providers: []
})
export class SolicitudesTransportistaComponent implements OnInit {
  cargando = false;
  maniobras: any[] = [];
  maniobrasCarga: any[] = [];
  totalRegistros = 0;
  totalRegistrosCargas = 0;
  usuarioLogueado: any;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);
  displayedDescargasColumns = ['actions', 'folio', 'contenedor', 'tipo', 'peso', 'cliente', 'agencia', 'operador', 'camion'];
  dataSourceDescargas: any;
  dataSourceDescargasTMP: any;

  displayedCargasColumns = ['actions', 'folio', 'contenedor', 'tipo', 'peso', 'cliente', 'agencia', 'operador', 'camion'];
  dataSourceCargas: any;
  dataSourceCargasTMP: any;

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('MatPaginatorCarga', { read: MatPaginator })
  MatPaginatorCarga: MatPaginator;
  @ViewChild('MatSortCarga') MatSortCarga: MatSort;

  constructor(
    private _maniobraService: ManiobraService,
    private _usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.usuarioLogueado = this._usuarioService.usuario;

    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
      this.cargarManiobrasAdmin('D');
      this.cargarManiobrasAdmin('C');
    } else {
      this.cargarManiobras('D');
      this.cargarManiobras('C');
    }

    const indexTAB = localStorage.getItem('TrasportistaTabs');
    if (indexTAB) {
      // tslint:disable-next-line: radix
      this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
    }

    this.socket.on('update-papeleta', function (data: any) {

      if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
        if (data.data._id) {
          this.cargarManiobrasAdmin(data.data.tipo);
        }
      } else {
        this.usuarioLogueado.empresas.forEach(empresa => {
          if ((empresa.transportista === this.usuarioLogueado.empresas._id && this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE)) {
            if (data.data._id) {
              this.cargarManiobras(data.data.cargaDescarga);
            }
          }
        });
      }
    }.bind(this));

    this.socket.on('aprobar-solicitud', function (data: any) {
      if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
        if (data.data._id) {
          this.cargarManiobrasAdmin(data.data.tipo);
        }
      } else {
        this.usuarioLogueado.empresas.forEach(empresa => {
          data.data.contenedores.forEach(t => {
            if ((t.transportista === empresa._id && this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE)) {
              this.cargarManiobras(data.data.tipo);
            }
          });
        });
      }
    }.bind(this));

    this.socket.on('delete-solicitud', function (data: any) {
      if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
        if (data.data._id) {
          this.cargarManiobrasAdmin(data.data.tipo);
        }
      } else {
        this.usuarioLogueado.empresas.forEach(empresa => {
          data.data.contenedores.forEach(t => {
            if ((t.transportista === empresa._id && this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE)) {
              if (data.data._id) {
                this.cargarManiobras(data.data.tipo);
              }
            }
          });
        });
      }
    }.bind(this));

    this.socket.on('delete-maniobra-descarga', function (data: any) {
      if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
        if (data.data.maniobra._id) {
          this.cargarManiobrasAdmin(data.data.maniobra.cargaDescarga);
        }
      } else {
        this.usuarioLogueado.empresas.forEach(empresa => {
          if (empresa._id === data.data.maniobra.transportista && this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE) {
            if (data.data.maniobra._id) {
              this.cargarManiobras(data.data.maniobra.cargaDescarga);
            }
          }
        });
      }
    }.bind(this));

    this.socket.on('delete-maniobra', function (data: any) {
      if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
        if (data.data._id) {
          this.cargarManiobrasAdmin(data.data.tipo);
        }
      } else {
        this.usuarioLogueado.empresas.forEach(empresa => {
            if ((data.data.transportista === empresa._id && this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE)) {
              if (data.data._id) {
                this.cargarManiobras(data.data.cargaDescarga);
              }
            }

        });
      }
    }.bind(this));
  }

  cargarManiobras(CD: string) {
       this.usuarioLogueado.empresas.forEach(empresa => {
        if (CD === 'D') {
          this._maniobraService.getManiobras('D', 'TRANSITO', empresa._id, null, null, 'VACIO_IMPORT,LLENO_IMPORT,LLENO_EXPORT').subscribe(maniobras => {
            this.maniobras = [];
            if (maniobras.maniobras.length > 0) {
              maniobras.maniobras.forEach(m => {
                this.maniobras.push(m);
              });
            }
            this.agregaMatTable(CD);
          });
        } else if (CD === 'C') {
          this._maniobraService.getManiobras('C', 'TRANSITO', empresa._id, null, null, 'VACIO_EXPORT,LLENO_IMPORT,LLENO_EXPORT').subscribe(maniobras => {
            this.maniobrasCarga = [];
            if (maniobras.maniobras.length > 0) {
              maniobras.maniobras.forEach(m => {
                this.maniobrasCarga.push(m);
              });
            }
            this.agregaMatTable(CD);
          });
        }
      });
     }

  cargarManiobrasAdmin(CD: string) {
    if (CD === 'D') {
      this._maniobraService
        .getManiobras(
          'D',
          'TRANSITO',
          null,
          null,
          null,
          'VACIO_IMPORT,LLENO_IMPORT,LLENO_EXPORT'
        )
        .subscribe(maniobras => {
          // this.totalRegistros = maniobras.total;
          // this.maniobras = maniobras.maniobras;
          this.dataSourceDescargas = new MatTableDataSource(
            maniobras.maniobras
          );
          this.dataSourceDescargas.sort = this.sort;
          this.dataSourceDescargas.paginator = this.paginator;
          this.totalRegistros = maniobras.total;
        });
    } else if (CD === 'C') {
      this._maniobraService
        .getManiobras(
          'C',
          'TRANSITO',
          null,
          null,
          null,
          'VACIO_EXPORT,LLENO_IMPORT,LLENO_EXPORT'
        )
        .subscribe(maniobras => {
          // this.totalRegistrosCargas = maniobras.total;
          // this.maniobrasCarga = maniobras.maniobras;
          this.dataSourceCargas = new MatTableDataSource(maniobras.maniobras);
          this.dataSourceCargas.sort = this.MatSortCarga;
          this.dataSourceCargas.paginator = this.MatPaginatorCarga;
          this.totalRegistrosCargas = maniobras.total;
        });
    }
  }

  agregaMatTable(CD: string) {
    if (this.maniobras && CD === 'D') {
      this.dataSourceDescargas = new MatTableDataSource(this.maniobras);
      this.totalRegistros = this.dataSourceDescargas.data.length;
      this.dataSourceDescargas.sort = this.sort;
      this.dataSourceDescargas.paginator = this.paginator;
    }

    if (this.maniobrasCarga && CD === 'C') {
      this.dataSourceCargas = new MatTableDataSource(this.maniobrasCarga);
      this.totalRegistrosCargas = this.dataSourceCargas.data.length;
      this.dataSourceCargas.sort = this.MatSortCarga;
      this.dataSourceCargas.paginator = this.MatPaginatorCarga;
    }
  }

  applyFilterDescargas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    if (this.dataSourceDescargas && this.dataSourceDescargas.data.length > 0) {
      this.dataSourceDescargas.filter = filterValue;
      this.totalRegistros = this.dataSourceDescargas.filteredData.length;
    } else {
      console.error('Error al filtrar el dataSource de Solicitudes Transportista Descargas');
    }

    // this.dataSourceDescargas.filter = filterValue;
    // this.totalRegistros = this.dataSourceDescargas.filteredData.length;
  }

  onLinkClick(event: MatTabChangeEvent) {
    localStorage.setItem('TrasportistaTabs', event.index.toString());
  }

  applyFilterCargas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

    if (this.dataSourceCargas && this.dataSourceCargas.data.length > 0) {
      this.dataSourceCargas.filter = filterValue;
      this.totalRegistrosCargas = this.dataSourceCargas.filteredData.length;
    } else {
      console.error('Error al filtrar el dataSource de Solicitudes Transportista Cargas');
    }

    // this.dataSourceCargas.filter = filterValue;
    // this.totalRegistrosCargas = this.dataSourceCargas.filteredData.length;
  }
}
