import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';
// import { Router } from '@angular/router';
import { CanActivateChild } from '@angular/router/src/interfaces';

declare var swal: any;

@Injectable()
export class VerificaTokenGuard implements CanActivateChild {

  constructor(
    public _usuarioService: UsuarioService,
    // public router: Router
  ) { }

  canActivateChild(): Promise<boolean> | boolean {
    //console.log('Token guard');

    // tslint:disable-next-line:prefer-const
    let token = this._usuarioService.token;
    // tslint:disable-next-line:prefer-const
    let payload = JSON.parse( atob( token.split('.')[1] ));

    // tslint:disable-next-line:prefer-const
    let expirado = this.expirado( payload.exp );

    if ( expirado ) {
      this._usuarioService.logout();
      location.reload(true);
      return false;
    } else {
      return this.verificaRenueva( payload.exp );
    }
  }


  verificaRenueva( fechaExp: number ): Promise<boolean>  {

    return new Promise( (resolve, reject) => {

      // tslint:disable-next-line:prefer-const
      let tokenExp = new Date( fechaExp * 1000 );
      // tslint:disable-next-line:prefer-const
      let ahora = new Date();

      ahora.setTime( ahora.getTime() + ( 1 * 60 * 60 * 1000 ) );

       //console.log( tokenExp );
       //console.log( ahora );

      if ( tokenExp.getTime() > ahora.getTime() ) {
        resolve(true);
      } else {
        this._usuarioService.renuevaToken()
        .subscribe( () => {
          resolve(true);
        }, () => {
          this._usuarioService.logout();
          location.reload(true);
          reject(false);
        });

      }

    });

  }


  expirado( fechaExp: number ) {

    // tslint:disable-next-line:prefer-const
    let ahora = new Date().getTime() / 1000;

    if ( fechaExp < ahora ) {
      return true;
    } else {
      return false;
    }


  }



}
