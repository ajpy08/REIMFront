import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import swal from 'sweetalert';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import { Solicitud } from '../solicitudes/solicitud.models';
import { Liberacion } from '../liberacion-bl/liberacion.models'
import { Solicitud } from '../solicitudes/solicitud.models';
import { ContenedoresLRComponent } from '../contenedores-lr/contenedores-lr.component';


@Injectable({
  providedIn: 'root'
})
export class LiberacionBLService {

  constructor(public http: HttpClient,
    public _usuarioService: UsuarioService) { }

    ///crear liberacion////

    guardarliberacion(liberacion: Liberacion): Observable<any> {
      let url = URL_SERVICIOS + '/liberaciones/liberacion_bk';
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
      return this.http.get(URL_SERVICIOS + '/liberaciones/liberacion_bk/' + id)      
        .pipe(map((resp: any) => resp.liberacion));

    }

    getLiberacionIncludes(id: string): Observable<any> {
      return this.http.get(URL_SERVICIOS + '/liberaciones/liberacion_bk/' + id + '/includes')
        .pipe(map((resp: any) => resp.liberacion));
    }


    getLiberacion( tipo?: string, estatus?: string, fIniAlta?: string, fFinAlta?: string, naviera?: string): Observable<any> {
      let params = new HttpParams();
      if (fIniAlta && fFinAlta) {
        params = params.append('finialta', fIniAlta);
        params = params.append('ffinalta', fFinAlta);
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
      const url = URL_SERVICIOS + '/liberaciones/liberacion_bk';
      return this.http.get(url, { params: params });
    }

    guardarSolicitud(solicitud: Solicitud): Observable<any> {
      let url = URL_SERVICIOS + '/solicitudes/solicitud';
      if (solicitud._id) { // Actualizando
        url += '/' + solicitud._id;
        url += '?token=' + this._usuarioService.token;
        return this.http.put(url, solicitud)
          .pipe(map((resp: any) => {
            swal('Solicitud Actualizada', 'Correctamente', 'success');
            return resp.solicitud;
          }));
      } else { // Creando
        url += '?token=' + this._usuarioService.token;
        return this.http.post(url, solicitud)
          .pipe(map((resp: any) => {
            swal('Liberacion Creada', 'Correctamente', 'success');
            return resp.solicitud;
          }));
      }
    }

    apruebaLiberacionCarga(liberacion: Liberacion): Observable<any> {
      let url = URL_SERVICIOS + '/liberaciones/aprobar/aprobaciones_bk';
      url += '/' + liberacion._id   ;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, liberacion)
        .pipe(map((resp: any) => {
          swal('Liberacion  Aprobada', 'La liberación fue aprobada', 'success');
          return resp.liberacion;
        }),
          catchError(err => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    }

    actualizarSolicitud(liberacion: Liberacion): Observable<any> {
    let url = URL_SERVICIOS + '/liberaciones/alta_transportista';
    url += '/' + liberacion._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, liberacion)
      .pipe(map((res:any)=> {
        swal('Transportista Asignado', 'Se asigno correctamente el trasportista', 'success');
        return res.liberacion;
      }),
      catchError(err => {
        swal(err.error.mensaje, err.error.errors.menssage, 'error');
        return throwError(err);
      }));
    }


    semiActualizadoLiberacion(liberacion: Liberacion): Observable<any> {
    let url = URL_SERVICIOS + '/liberaciones/semi_transportista';
    url += '/' + liberacion._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, liberacion)
      .pipe(map((res:any)=> {
        swal('Transportista Asignado', 'Se asigno correctamente el trasportista', 'success');
        return res.liberacion;
      }),
      catchError(err => {
        swal(err.error.mensaje, err.error.errors.menssage, 'error');
        return throwError(err);
      }));
    }



    
  borrarSolicitud(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/liberaciones/liberacion_bk/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Borrado Solicitudes', 'Eliminado Correctamente', 'success')));
  }


  enviaCorreoAprobacionLiberacion(liberacion: Solicitud): Observable<any> {
    let params = new HttpParams();
    let url = URL_SERVICIOS + '/liberaciones/liberacion';
    url += '/' + liberacion._id + '/enviacorreo';
    //url += '?token=' + this._usuarioService.token;
    if (liberacion._id) {
      params = params.append('_id', liberacion._id);
    }

    return this.http.get(url, { params: params })
    .pipe(map((resp: any) => {
      if (resp.mensaje != '' && resp.mensaje != undefined && resp.mensaje.length > 0) {
        swal('ALERTA', resp.mensaje, 'success');        
      }
      return resp.solicitud;
    }));;
  }

}
