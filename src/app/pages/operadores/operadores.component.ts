import { Component, OnInit, ViewChild } from '@angular/core';
import { Operador } from '../../models/operador.models';
import { OperadorService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
declare var swal: any;
@Component({
  selector: 'app-operadores',
  templateUrl: './operadores.component.html',
  styles: []
})
export class OperadoresComponent implements OnInit {
  operadores: Operador[] = [];
  cargando: boolean = true;
  totalRegistros: number = 0;
  desde: number = 0;

  displayedColumns = ['actions', 'foto', 'transportista.razonSocial', 'nombre', 'vigenciaLicencia', 'licencia', 'activo'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public _operadorService: OperadorService) { }

  ngOnInit() {
    this.cargarOperadores();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.totalRegistros = this.dataSource.filteredData.length;
  }

  cargarOperadores() {
    this.cargando = true;
    this._operadorService.getOperadores(this.desde)
      .subscribe(operadores => {
        this.dataSource = new MatTableDataSource(operadores.operadores);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = operadores.operadores.length;
      });
      this.cargando = false;
  }

  // cambiarDesde(valor: number) {
  //   let desde = this.desde + valor;
  //   //console.log(desde);
  //   if (desde >= this._operadorService.totalOperadores) {
  //     return;
  //   }
  //   if (desde < 0) {
  //     return;
  //   }
  //   this.desde += valor;
  //   this.cargarOperadores();
  // }

  buscarOperador(termino: string) {
    if (termino.length <= 0) {
      this.cargarOperadores();
      return;
    }
    this.cargando = true;
    this._operadorService.buscarOperador(termino)
      .subscribe((operadores: Operador[]) => {
        this.operadores = operadores;
        this.cargando = false;
      });
  }

  borrarOperador(operador: Operador) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + operador.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this._operadorService.borrarOperador(operador._id)
            .subscribe(borrado => {
              this.cargarOperadores();
            });
        }
      });
  }
}
