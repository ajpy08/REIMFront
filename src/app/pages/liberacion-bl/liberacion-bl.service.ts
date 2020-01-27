import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import swal from 'sweetalert';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Solicitud } from '../solicitudes/solicitud.models';


@Injectable({
  providedIn: 'root'
})
export class LiberacionBLService {

  constructor(public http: HttpClient,
    public _usuarioService: UsuarioService) { }

    ///crear liberacion////

    guardarliberacion(solicitud: Solicitud): Observable<any> {
      let url = URL_SERVICIOS + '/liberacion/liberacion_bk';
      if (solicitud._id) { // Actualizando
        url += '/' + solicitud._id;
        url += '?token=' + this._usuarioService.token;
        return this.http.put(url, solicitud)
          .pipe(map((resp: any) => {
            swal('liberacion Actualizada', 'Correctamente', 'success');
            return resp.liberacion;
          }));
      } else { // Creando
        url += '?token=' + this._usuarioService.token;
        return this.http.post(url, solicitud)
          .pipe(map((resp: any) => {
            swal('liberacion Creada', 'Correctamente', 'success');
            return resp.solicitud;
          }));
      }
    }


    cargarSolicitud(id: string): Observable<any> {
      return this.http.get(URL_SERVICIOS + '/liberacionesBL/liberacion/' + id)
        .pipe(map((resp: any) => resp.solicitud));
    }
}
