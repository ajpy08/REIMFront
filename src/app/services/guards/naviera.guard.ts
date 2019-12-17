import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from 'src/app/pages/usuarios/usuario.service';
import { ROLES } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class NavieraGuard implements CanActivate {

  constructor(public router: Router, public usuarioService: UsuarioService){}

  canActivate() {
    if ( this.usuarioService.usuario.role === ROLES.NAVIERA_ROLE) {
      return true;
    } else {
      console.log('Bloqueado por el NAVIERA GUARD');
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
