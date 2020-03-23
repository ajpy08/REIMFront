import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from '../../services/service.index';
import { Usuario } from '../../pages/usuarios/usuario.model';
import { ROLES } from 'src/app/config/config';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  usuario: Usuario;
  role = 'Rol no asignado';

  constructor(public _sidebar: SidebarService, public _usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
    this._sidebar.cargarMenu();
    this.mostrarRole();
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
