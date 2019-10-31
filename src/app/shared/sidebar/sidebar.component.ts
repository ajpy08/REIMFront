import { Component, OnInit } from '@angular/core';
import { SidebarService, UsuarioService } from '../../services/service.index';
import { Usuario } from '../../pages/usuarios/usuario.model';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  usuario: Usuario;
  role = 'rol no asignado';

  constructor(public _sidebar: SidebarService, public _usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
    this._sidebar.cargarMenu();
    this.mostrarRole();
  }

  mostrarRole() {
    // console.log(this.usuario.role);
    // console.log(this.role);
    if (this.usuario.role == 'ADMIN_ROLE') {
      this.role = 'Administrador';
      return;
    }
    if (this.usuario.role == 'PATIOADMIN_ROLE') {
      this.role = 'Administrador Container Park';
      return;
    }
    if (this.usuario.role == 'PATIO_ROLE') {
      this.role = 'Usuario Container Park';
      return;
    }
    if (this.usuario.role == 'NAVIERA_ROLE') {
      this.role = 'Naviera';
      return;
    }
    if (this.usuario.role == 'TRANSPORTISTA_ROLE') {
      this.role = 'Transportista';
      return;
    }
    if (this.usuario.role == 'AA_ROLE') {
      this.role = 'Agente Aduanal';
      return;
    }
    if (this.usuario.role == 'CLIENT_ROLE') {
      this.role = 'Cliente';
      return;
    }
  }

}
