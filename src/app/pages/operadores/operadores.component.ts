import { Component, OnInit, ViewChild } from '@angular/core';
import { Operador } from '../../models/operador.models';
import { OperadorService, UsuarioService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from 'src/app/models/usuarios.model';
import { ROLES } from 'src/app/config/config';
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
  usuarioLogueado: Usuario;

  displayedColumns = ['actions', 'foto', 'transportista.razonSocial', 'nombre', 'vigenciaLicencia', 'licencia', 'activo'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public _operadorService: OperadorService, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
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

    if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.REIMADMIN_ROLE) {
      this._operadorService.getOperadores()
        .subscribe(operadores => {
          this.dataSource = new MatTableDataSource(operadores.operadores);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalRegistros = operadores.operadores.length;
        });
    } else {
      if (this.usuarioLogueado.role == ROLES.TRANSPORTISTA_ROLE) {
        this._operadorService.getOperadores(this.usuarioLogueado.empresas[0]._id)
        .subscribe(operadores => {
          this.dataSource = new MatTableDataSource(operadores.operadores);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalRegistros = operadores.operadores.length;
        });
      }
    }
    this.cargando = false;
  }

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
