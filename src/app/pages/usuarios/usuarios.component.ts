import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../models/usuarios.model';
import { UsuarioService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

declare var swal: any;
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  // tslint:disable-next-line:no-inferrable-types
  desde: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  totalRegistros: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  cargando: boolean = true;

  displayedColumns = ['actions', 'foto', 'email', 'nombre', 'role', 'empresas'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public _usuarioService: UsuarioService) {
     }

  ngOnInit() {
    this.cargarUsuarios();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.totalRegistros = this.dataSource.filteredData.length;
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.getUsuarios(this.desde)
    .subscribe((usuarios: any) => {
      this.dataSource = new MatTableDataSource(usuarios.usuarios);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = usuarios.usuarios.length;
    });
    this.cargando = false;
  }

  // cambiarDesde(valor: number) {
  //   // tslint:disable-next-line:prefer-const
  //   let desde = this.desde + valor;
  //   // console.log(desde);
  //   if (desde >= this.totalRegistros) {
  //     return;
  //   }
  //   if (desde < 0) {
  //     return;
  //   }
  //   this.desde += valor;
  //   this.cargarUsuarios();
  // }

  borrarUsuario(usuario: Usuario) {
    // console.log(usuario);
    if (usuario._id === this._usuarioService.usuario._id) {
    swal('Error!', 'No se puede borrar a si mismo' , 'error');
    return;
    }
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      })
      .then(borrar => {
        if (borrar) {
          this._usuarioService.borrarUsuario(usuario._id)
          .subscribe(borrado => {
          //  console.log(borrado);
            this.cargarUsuarios();
          });

        }
      });
  }

  buscarUsuarios(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    this._usuarioService.buscarUsuarios(termino)
    .subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      this.cargando = false;

    });
  }


}
