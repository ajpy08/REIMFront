import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Liberacion } from './liberacion.models';
import swal from 'sweetalert';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LiberacionBLService {

  constructor(public http: HttpClient,
    public _usuarioService: UsuarioService) { }

    ///crear liberacion////

    guardarliberacion(liberacion: Liberacion): Observable<any> {
      let url = URL_SERVICIOS + '/liberacion/liberacion_bl';
      if (liberacion._id) { // Actualizando
        url += '/' + liberacion._id;
        url += '?token=' + this._usuarioService.token;
        return this.http.put(url, liberacion)
          .pipe(map((resp: any) => {
            swal('liberacion Actualizada', 'Correctamente', 'success');
            return resp.liberacion;
          }));
      } else { // Creando
        url += '?token=' + this._usuarioService.token;
        return this.http.post(url, liberacion)
          .pipe(map((resp: any) => {
            swal('liberacion Creada', 'Correctamente', 'success');
            return resp.liberacion;
          }));
      }
    }


    cargarSolicitud(id: string): Observable<any> {
      return this.http.get(URL_SERVICIOS + '/liberacionesBL/liberacion/' + id)
        .pipe(map((resp: any) => resp.solicitud));
    }
}
