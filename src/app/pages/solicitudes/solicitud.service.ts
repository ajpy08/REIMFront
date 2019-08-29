import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Solicitud } from './solicitud.models';
import swal from 'sweetalert';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class SolicitudService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService) { }

    // getSolicitudes(): Observable<any> {
    //   return this.http.get(URL_SERVICIOS + '/solicitud');
    // }

    getSolicitudes( tipo?: string, estatus?: string, fIniAlta?: string, fFinAlta?: string): Observable<any> {
      let params = new HttpParams();
      if (fIniAlta && fFinAlta) {
        params = params.append('finialta', fIniAlta);
        params = params.append('ffinalta', fFinAlta);
      }
      if (tipo)  {
        params = params.append('tipo', tipo);
      }
      if (estatus)  {
        params = params.append('estatus', estatus);
      }
      // console.log(params.toString());
      const url = URL_SERVICIOS + '/solicitud';
      return this.http.get(url, {params: params });
    }


    // getSolicitudesCarga(): Observable<any> {
    //   return this.http.get(URL_SERVICIOS + '/solicitud/cargas/');
    // }

    // getSolicitudesDescarga(): Observable<any> {
    //   return this.http.get(URL_SERVICIOS + '/solicitud/descargas/');
    // }

    cargarSolicitud(id: string): Observable<any> {
      return this.http.get(URL_SERVICIOS + '/solicitud/' + id)
      .pipe(map((resp: any) => resp.solicitud));
    }

    getSolicitudIncludes(id: string): Observable<any> {
      return this.http.get(URL_SERVICIOS + '/solicitud/' + id + '/includes')
      .pipe(map((resp: any) => resp.solicitud));
    }

    guardarSolicitud(solicitud: Solicitud): Observable<any> {
      console.log(solicitud);
      let url = URL_SERVICIOS + '/solicitud';
      if (solicitud._id) { // Actualizando
        url += '/' + solicitud._id;
        url += '?token=' + this._usuarioService.token;
        return this.http.put(url, solicitud)
        .pipe(map((resp: any) => {
          swal('Solicitud de descarga Actualizada', solicitud.agencia, 'success');
          return resp.solicitud;
        }),
        catchError(err => {
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
      } else { // Creando
        url += '?token=' + this._usuarioService.token;
        return this.http.post(url, solicitud)
        .pipe(map((resp: any) => {
          swal('Solicitud de descarga Creada', solicitud.agencia, 'success');
          return resp.solicitud;
        }),
        catchError(err => {
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
      }
    }

    apruebaSolicitudDescarga(solicitud: Solicitud): Observable<any> {
      let url = URL_SERVICIOS + '/solicitud/apruebadescarga';
      url += '/' + solicitud._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, solicitud)
      .pipe(map((resp: any) => {
        swal('Solicitud de descarga Aprobada', 'La solicitud fue aprobada', 'success');
        return resp.solicitud;
      }),
      catchError(err => {
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return throwError(err);
      }));
    }

    apruebaSolicitudDescargaContenedor(idSol: string, idCont: string) : Observable <any>{
      let url = URL_SERVICIOS + '/solicitud/apruebadescarga/'+ idSol + '/contenedor/'+idCont;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url,idSol)
      .pipe(map((resp: any) => {
        swal('Solicitud de descarga Aprobada', 'La solicitud fue aprobada', 'success');
        return resp.solicitud;
      }));
    }

  apruebaSolicitudCarga(solicitud: Solicitud): Observable<any> {
    let url = URL_SERVICIOS + '/solicitud/apruebacarga';
    url += '/' + solicitud._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, solicitud)
    .pipe(map((resp: any) => {
      swal('Solicitud de Carga Aprobada', 'La solicitud fue aprobada', 'success');
      return resp.solicitud;
    }),
    catchError(err => {
      swal(err.error.mensaje, err.error.errors.message, 'error');
      return throwError(err);
    }));
  }






  // cargarSolicitudesAgencia(agencias: string, desde: number = 0): Observable<any> {

  //     // tslint:disable-next-line:prefer-const
  //     let url = URL_SERVICIOS + '/solicitudD/agencia' + agencias;
  //     url += '?desde=' + desde;
  //     return this.http.get(url)
  //         .pipe(map((resp: any) => {
  //             // this.totalSolicitudesDescarga = resp.total;
  //             console.log(resp.total);
  //             return resp.solicitudesD;
  //         })
  //         );

  // }



  borrarSolicitud(id: string): Observable<any> {

      let url = URL_SERVICIOS + '/solicitudD/' + id;
      url += '?token=' + this._usuarioService.token;

      return this.http.delete(url)
          .pipe(map(resp => swal('Prealta Borrado', 'Eliminado Correctamente', 'success')));
  }

  // cambioEstado(solicitud: Solicitud): Observable<any> {

  //     let url = URL_SERVICIOS + '/solicitudD/aprobacion/' + solicitud._id;
  //     url += '?token=' + this._usuarioService.token;
  //     return this.http.put(url, solicitud)
  //         .pipe(map((resp: any) => {
  //             swal('Solicitud Actualizada', solicitud.agencia, 'success');
  //             return resp.prealta;
  //         }),
  //             catchError(err => {
  //                 swal(err.error.mensaje, err.error.errors.message, 'error');
  //                 return throwError(err);
  //             }));

  // }



}
