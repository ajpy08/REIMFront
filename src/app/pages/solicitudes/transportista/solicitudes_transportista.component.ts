import { Component, OnInit, ViewChild } from '@angular/core';
import { ManiobraService, UsuarioService } from '../../../services/service.index';
import { MatTableDataSource, MatSort, MatPaginator, MatTabGroup, MatTabChangeEvent } from '@angular/material';



@Component({
  selector: 'app-solicitudes.transportista',
  templateUrl: './solicitudes_transportista.component.html',
  styles: [],
  providers: [],
})

export class SolicitudesTransportistaComponent implements OnInit {
  maniobras: any[] = [];
  maniobrasCarga: any[] = [];
  cargando = true;
  totalRegistros = 0;
  totalRegistrosCargas = 0;
  usuarioLogueado: any;

  displayedDescargasColumns = ['actions', 'folio', 'contenedor', 'tipo','peso','cliente','agencia','operador','camion'];
  dataSourceDescargas: any;

  displayedCargasColumns = ['actions', 'folio', 'contenedor', 'tipo','peso','cliente','agencia','operador','camion'];
  dataSourceCargas: any;

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;




  constructor(private _maniobraService: ManiobraService, private _usuarioService: UsuarioService, ) { }

  ngOnInit() {
    this.usuarioLogueado = this._usuarioService.usuario;
    this.cargarManiobras();
    let indexTAB = localStorage.getItem("AprobSolicitudes");
    if (indexTAB) {
      this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
    }
  }

  cargarManiobras() {
    this.cargando = true;
    if (this.usuarioLogueado.role === 'TRANSPORTISTA_ROLE') {
      this._maniobraService.getManiobras('D', 'TRANSITO', this.usuarioLogueado.empresas[0]._id, null, null,'VACIO_IMPORT,LLENO_IMPORT,LLENO_EXPORT')
        .subscribe(maniobras => {
          // this.totalRegistros = maniobras.total;
          // this.maniobras = maniobras.maniobras;
          this.dataSourceDescargas = new MatTableDataSource(maniobras.maniobras);
          this.dataSourceDescargas.sort = this.sort;
          this.dataSourceDescargas.paginator = this.paginator;
          this.totalRegistros = maniobras.total;
        });
      this._maniobraService.getManiobras('C', 'TRANSITO', this.usuarioLogueado.empresas[0]._id, null, null, 'VACIO_EXPORT,LLENO_IMPORT,LLENO_EXPORT')
        .subscribe(maniobras => {
          // this.totalRegistrosCargas = maniobras.total;
          // this.maniobrasCarga = maniobras.maniobras;
          this.dataSourceCargas = new MatTableDataSource(maniobras.maniobras);
          this.dataSourceCargas.sort = this.sort;
          this.dataSourceCargas.paginator = this.paginator;
          this.totalRegistrosCargas = maniobras.total;
        });
      this.cargando = false;
    }

    if (this.usuarioLogueado.role === 'ADMIN_ROLE') {
      this._maniobraService.getManiobras('D', 'TRANSITO', null, null, null, 'VACIO_IMPORT,LLENO_IMPORT,LLENO_EXPORT')
        .subscribe(maniobras => {
          // this.totalRegistros = maniobras.total;
          // this.maniobras = maniobras.maniobras;
          this.dataSourceDescargas = new MatTableDataSource(maniobras.maniobras);
          this.dataSourceDescargas.sort = this.sort;
          this.dataSourceDescargas.paginator = this.paginator;
          this.totalRegistros = maniobras.total;
        });
      this._maniobraService.getManiobras('C', 'TRANSITO', null, null, null, 'VACIO_EXPORT,LLENO_IMPORT,LLENO_EXPORT')
        .subscribe(maniobras => {
          // this.totalRegistrosCargas = maniobras.total;
          // this.maniobrasCarga = maniobras.maniobras;
          this.dataSourceCargas = new MatTableDataSource(maniobras.maniobras);
          this.dataSourceCargas.sort = this.sort;
          this.dataSourceCargas.paginator = this.paginator;
          this.totalRegistrosCargas = maniobras.total;
        });
      this.cargando = false;
    }
  }


  applyFilterDescargas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSourceDescargas.filter = filterValue;
    this.totalRegistros = this.dataSourceDescargas.filteredData.length;
  }

  onLinkClick(event: MatTabChangeEvent) {

    localStorage.setItem("AprobSolicitudes", event.index.toString());
  }

  applyFilterCargas(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSourceCargas.filter = filterValue;
    this.totalRegistrosCargas = this.dataSourceCargas.filteredData.length;
  }

}
