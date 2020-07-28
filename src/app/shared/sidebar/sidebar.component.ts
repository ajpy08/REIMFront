import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from '../../services/service.index';
import { Usuario } from '../../pages/usuarios/usuario.model';
import { ROLES } from 'src/app/config/config';
import * as io from 'socket.io-client';
import { URL_SOCKET_IO, PARAM_SOCKET } from 'src/environments/environment';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  usuario: Usuario;
  role = 'Rol no asignado';
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  constructor(public _sidebar: SidebarService, public _usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
    this._sidebar.cargarMenu();
    this.mostrarRole();

    this.socket.on('actualizar-perfil', function (data: any) {
      if (this.usuario._id === data.data._id) {
        this.cargarUsuario(data.data._id);
      }
    }.bind(this));
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.socket.removeListener('actualizar-perfil');
  }

  cargarUsuario(id: string) {
    this._usuarioService.getUsuario(id).subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  mostrarRole() {
    // console.log(this.usuario.role);
    // console.log(this.role);
    if (this.usuario.role === ROLES.ADMIN_ROLE) {
      this.role = 'Administrador';
      return;
    }
    if (this.usuario.role === ROLES.PATIOADMIN_ROLE) {
      this.role = 'Administrador Container Park';
      return;
    }
    if (this.usuario.role === ROLES.PATIO_ROLE) {
      this.role = 'Patio Container Park';
      return;
    }
    if (this.usuario.role === ROLES.NAVIERA_ROLE) {
      this.role = 'Naviera';
      return;
    }
    if (this.usuario.role === ROLES.TRANSPORTISTA_ROLE) {
      this.role = 'Transportista';
      return;
    }
    if (this.usuario.role === ROLES.AA_ROLE) {
      this.role = 'Agente Aduanal';
      return;
    }
    if (this.usuario.role === ROLES.CLIENT_ROLE) {
      this.role = 'Cliente';
      return;
    }
  }

}
