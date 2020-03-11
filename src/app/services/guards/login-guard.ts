import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../../pages/usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(public _usuarioService: UsuarioService, public router: Router) {}
  canActivate() {

    if (this._usuarioService.estaLogueado()) {
      // console.log('Paso por el Guard');
      return true;
    } else {
      // console.log('Bloqueado por Guard');
      if (this._usuarioService.usuario && this._usuarioService.usuario.status) {
        this._usuarioService.updateStatusUser().subscribe(() => {});
      }
      this.router.navigate(['/login']);
      return false;
    }
  }
}
