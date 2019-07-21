import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Operador } from '../../models/operador.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable()
export class OperadorService {
  // tslint:disable-next-line:no-inferrable-types
  totalOperadores: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  getOperadores(desde: number = 0): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/operador?desde=' + desde;
    return this.http.get(url)
    .pipe(map( (resp: any) => {

      this.totalOperadores = resp.total;
      console.log(resp);
    return resp.operadores;
    }));
  }

  getOperador( id: string ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/operador/' + id;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.operadores ));

  }

  borrarOperador( id: string ): Observable<any> {

    let url = URL_SERVICIOS + '/operador/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                .pipe(map( resp => swal('Operador Borrado', 'Eliminado correctamente', 'success') ));

  }


  guardarOperador( operador: Operador ): Observable<any> {

    let url = URL_SERVICIOS + '/operador';

    if ( operador._id ) {
      // actualizando
      url += '/' + operador._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, operador )
                .pipe(map( (resp: any) => {
                  swal('Operador Actualizado', operador.operador, 'success');
                  return resp.operador;
                }),
                catchError( err => {
                  swal( err.error.mensaje, err.error.errors.message, 'error' );
                  return throwError(err);
                }));

    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url, operador )
              .pipe(map( (resp: any) => {
                swal('Operador Creado', operador.operador, 'success');
                return resp.operador;
              }),
              catchError( err => {
                swal( err.error.mensaje, err.error.errors.message, 'error' );
                return throwError(err);
              }));
    }

  }
    buscarOperador( termino: string ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/busqueda/coleccion/operadores/' + termino;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.operadores ));

  }

  subirArchivoTemporal(archivo: File ): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let formData = new FormData();
  
    formData.append('file', archivo, archivo.name);
  
    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/uploadFileTemp';
         // url += '?token=' + this._usuarioService.token;
         return this.http.put( url, formData )
         .pipe(map( (resp: any) => {
           swal('Archivo Cargado', archivo.name, 'success');
           console.log(resp.nombreArchivo);
           return resp.nombreArchivo;
   
         }),
         catchError( err => {
           swal( err.error.mensaje, err.error.errors.message, 'error' );
           return throwError(err);
         }));
   }


}
