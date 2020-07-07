import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../../models/usuario';
import { UsuarioService } from '../../../services/service.index';
import { MatTableDataSource, MatSort, MatPaginator, MatSortable } from '@angular/material';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import * as io from 'socket.io-client';
import { ROLES_ARRAY } from 'src/app/config/config';

declare var swal: any;

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  cargando = true;
  tablaCargar = false;
  totalOnline = 0;
  roles = ROLES_ARRAY;

  // displayedColumns = ['img', 'nombre', 'status', 'role', 'empresas', 'fActivo'];
  displayedColumns = ['status', 'img', 'nombre', 'role', 'empresas', 'fActivo', 'actions'];
  dataSource: any;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET );

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    localStorage.removeItem('historyArray');
    this.cargarUsuarios();

    this.socket.on('login-user', function (data: any) {
      this.cargarUsuarios();
    }.bind(this));

    this.socket.on('logout-user', function (data: any) {
        this.cargarUsuarios();
    }.bind(this));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalOnline = this.dataSource.filteredData.length;
      if ( this.dataSource.filteredData.length === 0) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
    } else {
      console.error('Error al filtrar el dataSource de Status');
    }
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.getUserStatus().subscribe((usuarios: any) => {
      this.dataSource = new MatTableDataSource(usuarios);
      if (usuarios.length === 0 ) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalOnline = usuarios.filter(u => u.status === true).length;
    });
    this.cargando = false;
  }

  role(role: string) {
    const result = role.substr(0, role.indexOf('_'));
    return result;
  }

  logout(user) {
    this.usuarioService.updateStatusUser(user).subscribe((usuario) => {
      this.socket.emit('logoutuser', usuario);
    });
  }
}
