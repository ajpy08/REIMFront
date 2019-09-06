import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../../pages/usuarios/usuario.service';
import { Contenedor } from '../../models/contenedores.models';
import swal from 'sweetalert';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';

@Injectable()
export class ContenedorService {
  // tslint:disable-next-line:no-inferrable-types
  totalContenedores: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarContenedores(desde: number = 0): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/contenedor?desde=' + desde;
    return this.http.get(url)
    .pipe(map( (resp: any) => {

      this.totalContenedores = resp.total;
      // console.log(resp.total);
    return resp.contenedor;
    }));
  }

  cargarContenedor( id: string ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/contenedor/' + id;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.contenedor ));

  }

  borrarContenedor( id: string ): Observable<any> {

    let url = URL_SERVICIOS + '/contenedor/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                .pipe(map( resp => swal('Contenedor Borrado', 'Eliminado correctamente', 'success') ));

  }

  guardarContenedor( contenedor: Contenedor ): Observable<any> {

    let url = URL_SERVICIOS + '/contenedor';

    if ( contenedor._id ) {
      // actualizando
      url += '/' + contenedor._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, contenedor )
                .pipe(map( (resp: any) => {
                  swal('Contenedor Actualizado', contenedor.contenedor, 'success');
                  return resp.contenedor;
                }),
                catchError( err => {
                  swal( err.error.mensaje, err.error.errors.message, 'error' );
                  return throwError(err);
                }));

    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url, contenedor )
              .pipe(map( (resp: any) => {
                swal('Contenedor Creado', contenedor.contenedor, 'success');
                return resp.contenedor;
              }),
              catchError( err => {
                swal( err.error.mensaje, err.error.errors.message, 'error' );
                return throwError(err);
              }));
    }

  }
  buscarContenedor( termino: string ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/busqueda/coleccion/contenedores/' + termino;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.contenedores ));

  }


}
