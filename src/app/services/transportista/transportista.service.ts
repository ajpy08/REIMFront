import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Transportista } from '../../models/transportista.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable()
export class TransportistaService {
  // tslint:disable-next-line:no-inferrable-types
  totalTransportistas: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  getTransportistas(desde: number = 0): Observable<any> {
    const url = URL_SERVICIOS + '/transportista?desde=' + desde;
    return this.http.get(url);
  }

  getTransportistaXID( id: string ): Observable<any> {
    const url = URL_SERVICIOS + '/transportista/' + id;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.transportista ));
  }

  borrarTransportista( id: string ): Observable<any> {
    let url = URL_SERVICIOS + '/transportista/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete( url )
                .pipe(map( resp => swal('Transportista Borrado', 'Eliminado correctamente', 'success') ));
  }

  guardarTransportista( transportista: Transportista ): Observable<any> {
    let url = URL_SERVICIOS + '/transportista';
    if ( transportista._id ) {// actualizando
      url += '/' + transportista._id;
      url += '?token=' + this._usuarioService.token;           
      return this.http.put( url, transportista )
                .pipe(map( (resp: any) => {
                  swal('Transportista Actualizado', transportista.razonSocial, 'success');
                  return resp.transportista;
                }),
                catchError( err => {
                  swal( err.error.mensaje, err.error.errors.message, 'error' );
                  return throwError(err);
                }));

    } else {// creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url, transportista )
              .pipe(map( (resp: any) => {
                swal('Transportista Creado', transportista.razonSocial, 'success');
                return resp.transportista;
              }),
              catchError( err => {
                swal( err.error.mensaje, err.error.errors.message, 'error' );
                return throwError(err);
              }));
    }
  }

  buscarTransportista( termino: string ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/busqueda/coleccion/transportistas/' + termino;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.transportistas ));

  }


}
