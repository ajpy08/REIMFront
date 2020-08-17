import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Vigencia } from './vigencia.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
declare var swal: any;

@Injectable()
export class VigenciaService {
  // tslint:disable-next-line:no-inferrable-types
  totalVigencias: number = 0;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) {}

  getVigencias(tf: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/vigencias/' + tf;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  getVigencia(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/vigencias/vigencia/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url).pipe(map((resp: any) => resp.vigencia));
  }

  guardarVigencia(vigencia: Vigencia): Observable<any> {
    let url = URL_SERVICIOS + '/vigencias/vigencia';
    if (vigencia._id) {
      // actualizando
      url += '/' + vigencia._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, vigencia).pipe(
        map((resp: any) => {
          swal('Vigencia Actualizado', vigencia.contenedor, 'success');

          return resp.vigencia;
        })
      );
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, vigencia).pipe(
        map((resp: any) => {
          swal('Vigencia Creado', vigencia.contenedor, 'success');
          // console.log(resp)
          return resp.vigencia;
        })
      );
    }
  }

  borrarVigencia(vigencia: Vigencia): Observable<any> {
    let url = URL_SERVICIOS + '/vigencias/vigencia/' + vigencia._id;
    url += '?token=' + this._usuarioService.token;
    return this.http
      .delete(url)
      .pipe(map(resp => swal('Vigencia Borrado', 'Eliminado correctamente', 'success')),
      );
  }

  habilitaDeshabilitaVigencia(vigencia: Vigencia, act: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/vigencias/vigenciades/' + vigencia._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, {action: act}).pipe(map((resp: any) => {
      swal('Correcto', 'Cambio de estado del Vigencia ' + resp.vigencia.contenedor + ' realizado con exito', 'success');
      return true;
    }));
  }
}
