import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Operador } from '../../models/operador.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable()
export class OperadorService {
  totalOperadores: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  getOperadores(transportista? : string): Observable<any> {
    let url = URL_SERVICIOS + '/operador/operadores/';
    let params = new HttpParams();
    if (transportista)  {
      params = params.append('transportista', transportista);
    }
    return this.http.get(url, {params: params });
  }

  getOperador(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/operador/' + id;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.operadores));
  }

  getOperadoresTransportista(transportista: string, activo?: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/operador/transportista/' + transportista + '&' + activo;
    return this.http.get(url)
      // .pipe(map((resp: any) => resp.operadores));
  }

  borrarOperador(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/operador/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Operador Borrado', 'Eliminado correctamente', 'success')));

  }

  guardarOperador(operador: Operador): Observable<any> {
    let url = URL_SERVICIOS + '/operador';
    if (operador._id) {
      // actualizando
      url += '/' + operador._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, operador)
        .pipe(map((resp: any) => {
          swal('Operador Actualizado', operador.nombre, 'success');
          return resp.operador;
        }),
          catchError(err => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, operador)
        .pipe(map((resp: any) => {
          swal('Operador Creado', operador.nombre, 'success');
          return resp.operador;
        }),
          catchError(err => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    }
  }

  buscarOperador(termino: string): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/busqueda/coleccion/operadores/' + termino;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.operadores));
  }
}
