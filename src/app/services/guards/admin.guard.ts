import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../../pages/usuarios/usuario.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService
  ) { }

  canActivate() {

    if ( this._usuarioService.usuario.role === 'ADMIN_ROLE' || this._usuarioService.usuario.role === 'PATIOADMIN_ROLE'
    || this._usuarioService.usuario.role === 'AA_ROLE' || this._usuarioService.usuario.role === 'NAVIERA_ROLE'
    || this._usuarioService.usuario.role === 'TRANSPORTISTA_ROLE' ||
    this._usuarioService.usuario.role === 'PATIO_ROLE' ) {
      return true;
    } else {
      console.log('Bloqueado por el ADMIN GUARD');
      this._usuarioService.logout();
      return false;
    }

  }

}
