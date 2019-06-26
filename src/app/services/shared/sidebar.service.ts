import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';
@Injectable()
export class SidebarService {
  menu: any[] = [];
  // menu: any = [
   // {
    //  titulo: 'Principal',
      // icono: 'mdi mdi-gauge',
      // submenu: [
       // { titulo: 'Maniobras', url: '/maniobras' }
     // ]
   // },
    // {
      // titulo: 'Mantenimientos',
      // icono: 'mdi mdi-folder-lock-open',
      // submenu: [
        // { titulo: 'Usuarios', url: '/usuarios' }
     // ]
    // }
  // ];

  constructor(
    public _usuarioService: UsuarioService
  ) { }

  cargarMenu() {
    this.menu = this._usuarioService.menu;
  }

}
