import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Naviera } from '../../models/navieras.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable()
export class NavieraService {
  // tslint:disable-next-line:no-inferrable-types
  totalNavieras: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarNavieras(desde: number = 0): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/naviera?desde=' + desde;
    return this.http.get(url)
    .pipe(map( (resp: any) => {

      this.totalNavieras = resp.total;
      console.log(resp.total);
    return resp.naviera;
    }));
  }

  cargarNaviera( id: string ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/naviera/' + id;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.naviera ));

  }

  borrarNaviera( id: string ): Observable<any> {

    let url = URL_SERVICIOS + '/naviera/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                .pipe(map( resp => swal('Naviera Borrado', 'Eliminado correctamente', 'success') ));

  }


  guardarNaviera( naviera: Naviera ): Observable<any> {

    let url = URL_SERVICIOS + '/naviera';

    if ( naviera._id ) {
      // actualizando
      url += '/' + naviera._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, naviera )
                .pipe(map( (resp: any) => {
                  swal('Naviera Actualizado', naviera.cliente, 'success');
                  return resp.naviera;
                }),
                catchError( err => {
                  swal( err.error.mensaje, err.error.errors.message, 'error' );
                  return throwError(err);
                }));

    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url, naviera )
              .pipe(map( (resp: any) => {
                swal('Naviera Creado', naviera.cliente, 'success');
                return resp.naviera;
              }),
              catchError( err => {
                console.log(err);
                swal( err.error.mensaje, err.error.errors.message, 'error' );
                return throwError(err);
              }));
    }

  }
  buscarNaviera( termino: string ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/busqueda/coleccion/navieras/' + termino;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.navieras ));

  }


}
