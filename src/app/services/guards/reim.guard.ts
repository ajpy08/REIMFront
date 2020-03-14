import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UsuarioService } from 'src/app/pages/usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class REIMGuard implements CanActivate {
  constructor(public router: Router, public usuarioService: UsuarioService) { }

  canActivate(route: ActivatedRouteSnapshot) {
    const usuario = this.usuarioService.usuario;
    if (usuario) {
      if (route.data.roles && route.data.roles.indexOf(usuario.role) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        console.log('Bloqueado por REIM GUARD');
        return false;
      }
      // authorised so return true
      return true;
    } else {
      console.log('Bloqueado por REIM GUARD');
      this.router.navigate(['/']);
      return false;
    }
  }
}
