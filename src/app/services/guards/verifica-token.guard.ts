import { Injectable } from '@angular/core';
import { UsuarioService } from '../../pages/usuarios/usuario.service';
// import { Router } from '@angular/router';
import { CanActivateChild } from '@angular/router/src/interfaces';
import * as io from 'socket.io-client';
import { URL_SOCKET_IO, PARAM_SOCKET } from 'src/environments/environment';
import { Router } from '@angular/router';

declare var swal: any;

@Injectable()
export class VerificaTokenGuard implements CanActivateChild {
  socket = io(URL_SOCKET_IO, PARAM_SOCKET );
  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  ) { }

  canActivateChild(): Promise<boolean> | boolean {
    // console.log('Token guard');

    // tslint:disable-next-line:prefer-const
    let token = this._usuarioService.token;
    // tslint:disable-next-line:prefer-const
    let payload = JSON.parse(atob(token.split('.')[1]));

    // tslint:disable-next-line:prefer-const
    let expirado = this.expirado(payload.exp);

    if (expirado) {
      if (this._usuarioService.usuario) {
        this.logout();
        // this.router.navigate(['/login']);
      }
      location.reload(true);
      return false;
    } else {
      return this.verificaRenueva(payload.exp);
    }
  }

  verificaRenueva(fechaExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:prefer-const
      let tokenExp = new Date(fechaExp * 1000);
      // tslint:disable-next-line:prefer-const
      let ahora = new Date();

      // ahora.setTime(ahora.getTime() + (1 * 60 * 60 * 1000));

      // console.log( tokenExp );
      // console.log( ahora );

      if (tokenExp.getTime() > ahora.getTime()) {
        resolve(true);
      } else {
        this._usuarioService.renuevaToken()
          .subscribe(() => {
            resolve(true);
          }, () => {
            location.reload(true);
            reject(false);
          });
      }
    });
  }

  expirado(fechaExp: number) {
    // tslint:disable-next-line:prefer-const
    let ahora = new Date().getTime() / 1000;

    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this._usuarioService.updateStatusUser().subscribe((usuario) => {
      this._usuarioService.logout();
      this.socket.emit('logoutuser', usuario);
    });
  }


}
