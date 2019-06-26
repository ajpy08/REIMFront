import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Camion } from '../../models/camion.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable()
export class CamionService {
  // tslint:disable-next-line:no-inferrable-types
  totalCamiones: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarCamiones(desde: number = 0): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/camion?desde=' + desde;
    return this.http.get(url)
    .pipe(
    map( (resp: any) => {
      this.totalCamiones = resp.total;
      console.log(resp.total);
    return resp.camiones;
    }));
  }

  cargarCamion( id: string ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/camion/' + id;
    return this.http.get( url )
           .pipe( map( (resp: any) => resp.camion ));

  }

  borrarCamion( id: string ): Observable<any> {

    let url = URL_SERVICIOS + '/camion/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
            .pipe( map( resp => swal('Camion Borrada', 'Eliminado correctamente', 'success') ));

  }

  guardarCamion( camion: Camion ): Observable<any> {

    let url = URL_SERVICIOS + '/camion';

    if ( camion._id ) {
      // actualizando
      url += '/' + camion._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, camion )
      .pipe(
                map( (resp: any) => {
                  swal('Placa Actualizada', camion.noEconomico, 'success');
                  return resp.camion;
                }),
                catchError( err => {
                  swal( err.error.mensaje, err.error.errors.message, 'error' );
                  return throwError(err);
                }));

    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url, camion )
        .pipe(
              map( (resp: any) => {
                swal('camion Creada', camion.noEconomico, 'success');
                return resp.camion;
              }),
              catchError( err => {
                swal( err.error.mensaje, err.error.errors.message, 'error' );
                return throwError(err);
              }));
    }

  }
  buscarCamion( termino: string ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/busqueda/coleccion/camiones/' + termino;
    return this.http.get( url )
    .pipe( map( (resp: any) => resp.camiones ));

  }


}
