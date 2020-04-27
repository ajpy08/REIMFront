import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../../pages/usuarios/usuario.service';
import { Naviera } from './navieras.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
declare var swal: any;


@Injectable()
export class NavieraService {

  totalNavieras = 0;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  getNavieras(tf: boolean): Observable<any> {
    const url = URL_SERVICIOS + '/navieras/' + tf;
    return this.http.get(url);
  }

  getNaviera(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/navieras/naviera/' + id;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.naviera));
  }

  guardarNaviera(naviera: Naviera): Observable<any> {
    let url = URL_SERVICIOS + '/navieras/naviera';
    if (naviera._id) {// actualizando
      url += '/' + naviera._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, naviera)
        .pipe(map((resp: any) => {
          swal('Naviera Actualizado', naviera.nombreComercial, 'success');
          return resp.naviera;
        }));
    } else {      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, naviera)
        .pipe(map((resp: any) => {
          swal('Naviera Creado', naviera.nombreComercial, 'success');
          return resp.naviera;
        }));
    }
  }

  borrarNaviera(naviera: Naviera): Observable<any> {
    let url = URL_SERVICIOS + '/navieras/naviera/' + naviera._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url).pipe(map(resp => swal('Naviera Borrado', 'Eliminado correctamente', 'success')),
    );
  }

  habilitaDeshabilitaNaviera(naviera: Naviera, act: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/navieras/navieraDes/' + naviera._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, { activo: act }).pipe(map((resp: any) => {
      swal('Cambio de estado de la Naviera realizado con exitoo', resp.naviera.nombreComercial, 'success');
      return true;
    }));
  }
}
