import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Solicitud } from './solicitud.models';
import swal from 'sweetalert';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class SolicitudService {
  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  // El campo agencias es un string de IDS separados por comas..
  getSolicitudes(
    tipo?: string,
    estatus?: string,
    fIniAlta?: string,
    fFinAlta?: string,
    agencias?: string
  ): Observable<any> {
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
    if (agencias) {
      params = params.append('agencias', agencias);
    }
    // console.log(params.toString());
    let url = URL_SERVICIOS + '/solicitudes';
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url, { params: params });
  }

  cargarSolicitud(id: string): Observable<any> {
    let url = URL_SERVICIOS + + '/solicitudes/solicitud/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.solicitud));
  }

  async getSolicitudAsync(id: string) {
    let url = URL_SERVICIOS + '/solicitudes/solicitud/' + id;
    url += '?token=' + this._usuarioService.token;
    return await this.http.get(url).toPromise();
  }

  getSolicitudIncludes(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/solicitudes/solicitud/' + id + '/includes';
    url += '?token=' + this._usuarioService.token;
    return this.http
      .get(url).pipe(map((resp: any) => resp.solicitud));
  }

  guardaViajeBuque(solicitud: Solicitud) {
    let url = URL_SERVICIOS;
    if (solicitud._id) {
      url += '/solicitudes/solicitud/' + solicitud._id + '/guarda_buque_viaje';
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, solicitud).pipe(
        map((resp: any) => {
          swal(
            'Datos Asignados con éxito',
            'Datos Asignados con éxito',
            'success'
          );
          return resp.solicitud;
        })
      );
    }
  }

  guardarSolicitud(solicitud: Solicitud): Observable<any> {
    let url = URL_SERVICIOS + '/solicitudes/solicitud';
    if (solicitud._id) {
      // Actualizando
      url += '/' + solicitud._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, solicitud).pipe(
        map((resp: any) => {
          swal('Solicitud Actualizada', 'Correctamente', 'success');
          return resp.solicitud;
        })
      );
    } else {
      // Creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, solicitud).pipe(
        map((resp: any) => {
          swal('Solicitud Creada', 'Correctamente', 'success');
          return resp.solicitud;
        })
      );
    }
  }

  borrarSolicitud(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/solicitudes/solicitud/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http
      .delete(url)
      .pipe(
        map(resp =>
          swal('Borrado Solicitudes', 'Eliminado Correctamente', 'success')
        )
      );
  }

  apruebaSolicitudDescarga(solicitud: Solicitud): Observable<any> {
    let url = URL_SERVICIOS + '/solicitud/apruebadescarga';
    url += '/' + solicitud._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, solicitud).pipe(
      map((resp: any) => {
        swal(
          'Solicitud de descarga Aprobada',
          'La solicitud fue aprobada',
          'success'
        );
        return resp.solicitud;
      })
    );
  }

  apruebaSolicitudDescargaContenedor(
    idSol: string,
    idCont: string
  ): Observable<any> {
    let url =
      URL_SERVICIOS +
      '/solicitud/apruebadescarga/' +
      idSol +
      '/contenedor/' +
      idCont;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, idSol).pipe(
      map((resp: any) => {
        swal(
          'Solicitud de descarga Aprobada',
          'La solicitud fue aprobada',
          'success'
        );
        return resp.solicitud;
      })
    );
  }

  apruebaSolicitudCarga(solicitud: Solicitud): Observable<any> {
    let url = URL_SERVICIOS + '/solicitudes/solicitud';
    url += '/' + solicitud._id + '/apruebacarga';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, solicitud).pipe(
      map((resp: any) => {
        swal(
          'Solicitud de Carga Aprobada',
          'La solicitud fue aprobada',
          'success'
        );
        return resp.solicitud;
      }),
      catchError(err => {
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return throwError(err);
      })
    );
  }

  enviaCorreoAprobacionSolicitud(solicitud: Solicitud): Observable<any> {
    let params = new HttpParams();
    let url = URL_SERVICIOS + '/solicitudes/solicitud';
    url += '/' + solicitud._id + '/enviacorreo';
    url += '?token=' + this._usuarioService.token;
    if (solicitud._id) {
      params = params.append('_id', solicitud._id);
    }

    return this.http.get(url, { params: params }).pipe(
      map((resp: any) => {
        if (
          resp.mensaje !== '' &&
          resp.mensaje !== undefined &&
          resp.mensaje.length > 0
        ) {
          swal('ALERTA', resp.mensaje, 'success');
        }
        return resp.solicitud;
      })
    );
  }

  // ! ESTE SERVICIO SIRVE PARA ELIMINAR TODAS LAS MANIOS BRAS DE LA SOLICITUD DE CARGA (BOTON DE ELIMINAR DE TABLA CARGAS)/////
  boorarSolicitudes(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/solicitudes/solicitud/maniobra/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http
      .delete(url).pipe(
        map((resp: any) => {
          swal('Solicitud Borrada', 'Eliminado correctamente', 'success');
          return resp;
        })
      );
  }

  // ! ESTE SERVICIO SIRVE PARA ELIMINAR SOLAMENTE EL CAMPO DE SOLICITUD DE LA MANIOBRA (BOTON DE ELIMINAR DE TABLA DESCARGAS)////
  borrarSolicitudDescarga(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/solicitudes/solicitud/maniobra/descarga/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http
      .put(url, id)
      .pipe(
        map(resp =>
          swal('Solicitud Borrada', 'Eliminado correctaente', 'success')
        )
      );
  }

  // ! ESTE SERVICIO SERVIRA PARA CARGAS
  borrarManiobra(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/eliminarManiobra/Solicitud/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url).pipe(map((res: any) => {
      return res.maniobra;
    }),
      catchError(err => {
        swal(
          'ERROR',
          'La maniobra no se encuentra en TRANSITO, por lo tanto no se puede eliminar',
          'error'
        );
        return throwError(err);
      })
    );
  }

  // ! ESTE SERVICIO SIRVE PARA DESCARGAS
  borrarSolicitudManiobra(id: string, solicitud: string): Observable<any> {
    let url =
      URL_SERVICIOS +
      '/maniobra/eliminarManiobra/Solicitud/Descarga/' +
      id +
      '&' +
      solicitud;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, id).pipe(
      map((resp: any) => {
        swal('Eliminado', 'Se elimino el contenedor correctamente', 'success');
        return resp;
      }),
      catchError(err => {
        swal('Error', 'La maniobra no se elimino', 'error');
        return throwError(err);
      })
    );
  }

  // ! ESTE SERVICIO SIRVE PARA ELIMINAR TODA LA SOLICITUD Y EN MANIOBRAS SOLO ELIMINARA EL CAMPO SOLICITUD(DESCARGAS)
  borrarSolicitudManiobraCampo(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/solicitudes/solicitud/maniobra/descarga/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, id).pipe(
      map((resp: any) => {
        swal('Eliminado', 'Se elimino la solicitud correctamente', 'success');
      }),
      catchError(err => {
        swal(
          'ERROR',
          'La solicitud no se ha eliminado, debido a que un contenedor no se encuentra en TRANSITO',
          'error'
        );
        return throwError(err);
      })
    );
  }

  // ! ESTE SERVICIO ES GENERAR PARA ELIMINAR DEL ARRAY EL CONTENEDOR (C/D)
  removeConte(id: string, maniobra: string): Observable<any> {
    let url =
      URL_SERVICIOS + '/solicitud/soli/Contenedor/' + id + '&' + maniobra;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, id).pipe(
      map((resp: any) => {
        swal('Eliminado', 'Se elimino el contenedor correctamente', 'success');
      }),
      catchError(err => {
        swal('ERROR', 'La maniobra no se elimino de solicitudes', 'error');
        return throwError(err);
      })
    );
  }

  actualizaBLBooking(id: string, blBooking: string): Observable<any> {
    let url =
      URL_SERVICIOS +
      '/solicitudes/solicitud/' +
      id +
      '/actualizaBLBooking/' +
      blBooking +
      '/';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, id).pipe(
      map((resp: any) => {
        swal(
          'BL/Booking Asignado',
          'Se asigno correctamente el bl/booking',
          'success'
        );
        return resp.solicitud;
      }),
      catchError(err => {
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return throwError(err);
      })
    );
  }

  // borrarContenedor(id:string): Observable<any> {
  //   let url = URL_SERVICIOS +'/solicitudes/eliminarContenedor' + id;
  //   return this.http.put(url, id).pipe(map((resp: any) =>{
  //     console.log('Contenedor eliminado correctamente de la solicitud');
  //   }),
  //     catchError(err => {
  //       console.log('el contenedor no se borro de la solicitud');
  //       return throwError(err);
  //     }));
  // }

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

  // borrarContenedor(id:string): Observable<any> {
  //   let url = URL_SERVICIOS +'/solicitudes/eliminarContenedor' + id;
  //   return this.http.put(url, id).pipe(map((resp: any) =>{
  //     console.log('Contenedor eliminado correctamente de la solicitud');
  //   }),
  //     catchError(err => {
  //       console.log('el contenedor no se borro de la solicitud');
  //       return throwError(err);
  //     }));
  // }
}
