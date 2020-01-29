import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import swal from 'sweetalert';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import { Solicitud } from '../solicitudes/solicitud.models';
import { Liberacion } from '../liberacion-bl/liberacion.models'


@Injectable({
  providedIn: 'root'
})
export class LiberacionBLService {

  constructor(public http: HttpClient,
    public _usuarioService: UsuarioService) { }

    ///crear liberacion////

    guardarliberacion(liberacion: Liberacion): Observable<any> {
      let url = URL_SERVICIOS + '/liberacion/liberacion_bk';
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


    cargarliberacion(id: string): Observable<any> {
      return this.http.get(URL_SERVICIOS + '/liberacionesBL/liberacion/' + id)
        .pipe(map((resp: any) => resp.liberacion));
    }


    getLiberacion( tipo?: string, estatus?: string, fIniAlta?: string, fFinAlta?: string, naviera?: string,agencia?: string): Observable<any> {
      let params = new HttpParams();
      if (fIniAlta && fFinAlta) {
        params = params.append('finialta', fIniAlta);
        params = params.append('ffinalta', fFinAlta);
      }
      if (agencia) {
        params = params.append('agencia', agencia);
      }
      if (tipo) {
        params = params.append('tipo', tipo);
      }
      if (estatus) {
        params = params.append('estatus', estatus);
      }
      if (naviera) {
        params = params.append('naviera', naviera);
      }
      // console.log(params.toString());
      const url = URL_SERVICIOS + '/liberacion/liberaciones_bk';
      return this.http.get(url, { params: params });
    }

    
  borrarSolicitud(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/solicitudes/solicitud/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Borrado Solicitudes', 'Eliminado Correctamente', 'success')));
  }
}
