import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../../pages/usuarios/usuario.service';
import { ROLES } from 'src/app/config/config';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  canActivate() {

    // if ( this._usuarioService.usuario.role === 'ADMIN_ROLE' || this._usuarioService.usuario.role === 'PATIOADMIN_ROLE'
    // || this._usuarioService.usuario.role === 'AA_ROLE' || this._usuarioService.usuario.role === 'NAVIERA_ROLE'
    // || this._usuarioService.usuario.role === 'TRANSPORTISTA_ROLE' ||
    // this._usuarioService.usuario.role === 'PATIO_ROLE' ) {
    if (this._usuarioService.usuario.role === ROLES.ADMIN_ROLE) {
      return true;
    } else {
      console.log('Bloqueado por el ADMIN GUARD');
      this.router.navigate(['/dashboard']);
      //this._usuarioService.logout();
      return false;
    }

  }

}
