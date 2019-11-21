import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Reparacion } from 'src/app/pages/reparaciones/reparacion.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable()
export class ReparacionService {
  totalReparaciones: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  getReparaciones(): Observable<any> {
    let url = URL_SERVICIOS + '/reparaciones/';
    return this.http.get(url)
  }

  getReparacion(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/reparaciones/reparacion/' + id;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.reparacion));
  }

  borrarReparacion(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/reparaciones/reparacion/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Reparacion Borrada', 'Eliminado correctamente', 'success')));
  }

  guardarReparacion(reparacion: Reparacion): Observable<any> {
    let url = URL_SERVICIOS + '/reparaciones/reparacion';
    if (reparacion._id) {
      // actualizando
      url += '/' + reparacion._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, reparacion)
        .pipe(
          map((resp: any) => {
            swal('Reparacion Actualizada', reparacion.descripcion, 'success');
            return resp.reparacion;
          }));

    } else {  // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, reparacion)
        .pipe(
          map((resp: any) => {
            swal('Reparacion Creada', reparacion.descripcion, 'success');
            return resp.reparacion;
          }));
    }
  }
}
