import { Component, OnInit, ViewChild } from '@angular/core';
import { Agencia } from './agencia.models';
import { AgenciaService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
declare var swal: any;
@Component({
  selector: 'app-agencias',
  templateUrl: './agencias.component.html',
  styles: []
})
export class AgenciasComponent implements OnInit {
  agencias: Agencia[] = [];
  cargando = true;
  totalRegistros = 0;

  displayedColumns = ['actions', 'img', 'rfc', 'razonSocial', 'nombreComercial', 'calle', 'noExterior', 'noInterior', 'colonia', 'municipio', 
  'ciudad', 'estado', 'cp', 'formatoR1', 'correo', 'correoFac', 'credito', 'patente'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public _agenciaService: AgenciaService) { }

  ngOnInit() {
    this.cargarAgencias();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.totalRegistros = this.dataSource.filteredData.length;
  }

  cargarAgencias() {
    this.cargando = true;
    this._agenciaService.getAgencias()
      .subscribe(agencias => {
        this.dataSource = new MatTableDataSource(agencias.agencias);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = agencias.agencias.length;
      });
      this.cargando = false;
  }


  borrarAgencia(agencia: Agencia) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + agencia.nombreComercial,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this._agenciaService.borrarAgencia(agencia._id)
            .subscribe(borrado => {
              this.cargarAgencias();
            });
        }
      });
  }
}
