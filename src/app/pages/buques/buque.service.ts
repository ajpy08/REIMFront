import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Buque } from './buques.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
declare var swal: any;

@Injectable()
export class BuqueService {
  // tslint:disable-next-line:no-inferrable-types
  totalBuques: number = 0;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) {}

  getBuques(tf: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/buques/' + tf;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  getBuqueXNaviera(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/buques/naviera/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  getBuque(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/buques/buque/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url).pipe(map((resp: any) => resp.buque));
  }

  guardarBuque(buque: Buque): Observable<any> {
    let url = URL_SERVICIOS + '/buques/buque';
    if (buque._id) {
      // actualizando
      url += '/' + buque._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, buque).pipe(
        map((resp: any) => {
          swal('Buque Actualizado', buque.nombre, 'success');

          return resp.buque;
        })
      );
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, buque).pipe(
        map((resp: any) => {
          swal('Buque Creado', buque.nombre, 'success');
          // console.log(resp)
          return resp.buque;
        })
      );
    }
  }

  borrarBuque(buque: Buque): Observable<any> {
    let url = URL_SERVICIOS + '/buques/buque/' + buque._id;
    url += '?token=' + this._usuarioService.token;
    return this.http
      .delete(url)
      .pipe(map(resp => swal('Buque Borrado', 'Eliminado correctamente', 'success')),
      );
  }

  habilitaDeshabilitaBuque(buque: Buque, act: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/buques/buquedes/' + buque._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, {action: act}).pipe(map((resp: any) => {
      swal('Correcto', 'Cambio de estado del Buque ' + resp.buque.nombre + ' realizado con exito', 'success');
      return true;
    }));
  }
}
