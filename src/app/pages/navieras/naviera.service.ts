import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../../pages/usuarios/usuario.service';
import { Naviera } from './navieras.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable()
export class NavieraService {

  totalNavieras: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  getNavieras(): Observable<any> {
    const url = URL_SERVICIOS + '/navieras';
    return this.http.get(url);
  }

  getNaviera( id: string ): Observable<any> {
    const url = URL_SERVICIOS + '/navieras/naviera/' + id;
    return this.http.get( url )
    .pipe(map( (resp: any) => resp.naviera ));
  }

   
  guardarNaviera( naviera: Naviera ): Observable<any> {
    let url = URL_SERVICIOS + '/navieras/naviera';
    if ( naviera._id ) {// actualizando
      url += '/' + naviera._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put( url, naviera )
                .pipe(map( (resp: any) => {
                  swal('Naviera Actualizado', naviera.razonSocial, 'success');
                  return resp.naviera;
                }));
    } else {      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url, naviera )
              .pipe(map( (resp: any) => {
                swal('Naviera Creado', naviera.razonSocial, 'success');
                return resp.naviera;
              }));
    }
  }

  borrarNaviera( id: string ): Observable<any> {

    let url = URL_SERVICIOS + '/navieras/naviera/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                .pipe(map( resp => swal('Naviera Borrado', 'Eliminado correctamente', 'success') ));

  }
}
