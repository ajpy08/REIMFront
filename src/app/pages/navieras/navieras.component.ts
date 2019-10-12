import { Component, OnInit, ViewChild } from '@angular/core';
import { Naviera } from './navieras.models';
import { NavieraService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
declare var swal: any;
@Component({
  selector: 'app-navieras',
  templateUrl: './navieras.component.html'
})
export class NavierasComponent implements OnInit {

  navieras: Naviera[] = [];
  cargando = true;
  totalRegistros = 0;

  displayedColumns = ['actions', 'img', 'razonSocial', 'rfc', 'calle', 'noExterior', 'noInterior', 'colonia', 'municipio',
  'ciudad', 'estado', 'cp', 'formatoR1', 'correo', 'correoFac', 'credito', 'caat'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public _navieraService: NavieraService) { }

  ngOnInit() {
    this.cargarNavieras();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.totalRegistros = this.dataSource.filteredData.length;
  }

  cargarNavieras() {
    this.cargando = true;
    this._navieraService.getNavieras()
    .subscribe(navieras => {
      this.dataSource = new MatTableDataSource(navieras.navieras);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = navieras.navieras.length;
    });
    this.cargando = false;
  }


  borrarNaviera( naviera: Naviera ) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + naviera.razonSocial,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      })
      .then(borrar => {
        if (borrar) {
          this._navieraService.borrarNaviera(naviera._id)
          .subscribe(borrado => {
            this.cargarNavieras();
          });
        }
      });
  }
}
