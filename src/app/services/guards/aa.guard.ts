import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { ROLES } from 'src/app/config/config';
import { UsuarioService } from 'src/app/pages/usuarios/usuario.service';

@Injectable()
export class AAGuard implements CanActivate {
  constructor(public router: Router, public usuarioService: UsuarioService) { }

  canActivate(route: ActivatedRouteSnapshot) {
    var usuario = this.usuarioService.usuario;
    if (usuario) {
      if (route.data.roles && route.data.roles.indexOf(usuario.role) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        console.log('Bloqueado por el AA GUARD');
        return false;
      }
      // authorised so return true
      return true;
    } else {
      console.log('Bloqueado por el AA GUARD');
      this.router.navigate(['/']);
      return false;
    }



    // if ( this.usuarioService.usuario.role === ROLES.AA_ROLE) {
    //   return true;
    // } else {
    //   console.log('Bloqueado por el AA GUARD');
    //   this.router.navigate(['/dashboard']);
    //   return false;
    // }
  }
}
