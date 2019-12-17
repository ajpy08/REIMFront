import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ROLES } from 'src/app/config/config';
import { UsuarioService } from 'src/app/pages/usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class PatioAdminGuard implements CanActivate {
  constructor(public router: Router, public usuarioService: UsuarioService){}

  canActivate() {
    if ( this.usuarioService.usuario.role === ROLES.PATIOADMIN_ROLE) {
      return true;
    } else {
      console.log('Bloqueado por el PATIO ADMIN GUARD');
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
