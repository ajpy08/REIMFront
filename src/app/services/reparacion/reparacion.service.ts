import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../../pages/usuarios/usuario.service';
import { Reparacion } from 'src/app/models/reparacion.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable()
export class ReparacionService {
  totalReparaciones: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  getReparaciones(desde: number = 0): Observable<any> {
    let url = URL_SERVICIOS + '/reparacion?desde=' + desde;
    return this.http.get(url)
  }

  getReparacion(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/reparacion/' + id;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.reparacion));
  }

  borrarReparacion(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/reparacion/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Reparacion Borrada', 'Eliminado correctamente', 'success')));
  }

  guardarReparacion(reparacion: Reparacion): Observable<any> {
    let url = URL_SERVICIOS + '/reparacion';
    if (reparacion._id) {
      // actualizando
      url += '/' + reparacion._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, reparacion)
        .pipe(
          map((resp: any) => {
            swal('Reparacion Actualizada', reparacion.descripcion, 'success');
            return resp.reparacion;
          }),
          catchError(err => {
            swal(err.error.mensaje, err.error.errors.message, 'error');            
            return throwError(err);
          }));

    } else {  // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, reparacion)
        .pipe(
          map((resp: any) => {
            swal('Reparacion Creada', reparacion.descripcion, 'success');
            //console.log(resp)
            return resp.reparacion;
          }),
          catchError(err => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            console.log(err)
            return throwError(err);
          }));
    }
  }

  buscarReparacion(termino: string): Observable<any> {
    let url = URL_SERVICIOS + '/busqueda/coleccion/reparaciones/' + termino;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.reparaciones));
  }
}
