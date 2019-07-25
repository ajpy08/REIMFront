import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Solicitud } from './solicitud.models';
import swal from 'sweetalert';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Operador } from 'src/app/models/operador.models';
import { Maniobra } from '../../models/maniobras.models';

@Injectable()
export class SolicitudService {
    totalSolicitudesDescarga: number = 0;

    constructor(
        public http: HttpClient,
        public _usuarioService: UsuarioService
    ) { }

    getSolicitudes(desde: number = 0): Observable<any> {
        let url = URL_SERVICIOS + '/solicitud?desde=' + desde;
        return this.http.get(url);
    }

    cargarSolicitud(id: string): Observable<any> {
        let url = URL_SERVICIOS + '/solicitud/' + id;
        return this.http.get(url)
            .pipe(map((resp: any) => resp.solicitud));
    }
    
    getSolicitudIncludes(id: string): Observable<any> {
        let url = URL_SERVICIOS + '/solicitud/' + id + '/includes';
        return this.http.get(url)
            .pipe(map((resp: any) => resp.solicitud));
    }

    guardarSolicitud(solicitud: Solicitud): Observable<any> {
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
                        console.log(err)
                        swal(err.error.mensaje, err.error.errors.message, 'error');
                        return throwError(err);
                    }));
        }
    }

    apruebaSolicitud(solicitud: Solicitud): Observable<any> {
        let url = URL_SERVICIOS + '/solicitud/aprueba';
        url += '/' + solicitud._id;
        url += '?token=' + this._usuarioService.token;
        console.log(solicitud);
        return this.http.put(url, solicitud)
            .pipe(map((resp: any) => {

                console.log(resp);
                //swal('Solicitud de descarga Aprobada', 'La solicitud fue aprobada', 'success');
                return resp.solicitud;
            }),
                catchError(err => {
                    console.log(err);
                    //swal(err.error.mensaje, err.error.errors.message, 'error');
                    return throwError(err);
                }));
    }







    cargarSolicitudesAgencia(agencias: string, desde: number = 0): Observable<any> {

        // tslint:disable-next-line:prefer-const
        let url = URL_SERVICIOS + '/solicitudD/agencia' + agencias;
        url += '?desde=' + desde;
        return this.http.get(url)
            .pipe(map((resp: any) => {
                this.totalSolicitudesDescarga = resp.total;
                console.log(resp.total);
                return resp.solicitudesD;
            })
            );

    }

 

    borrarSolicitud(id: string): Observable<any> {

        let url = URL_SERVICIOS + '/solicitudD/' + id;
        url += '?token=' + this._usuarioService.token;

        return this.http.delete(url)
            .pipe(map(resp => swal('Prealta Borrado', 'Eliminado Correctamente', 'success')));
    }

    cambioEstado(solicitud: Solicitud): Observable<any> {

        let url = URL_SERVICIOS + '/solicitudD/aprobacion/' + solicitud._id;
        url += '?token=' + this._usuarioService.token;
        return this.http.put(url, solicitud)
            .pipe(map((resp: any) => {
                swal('Solicitud Actualizada', solicitud.agencia, 'success');
                return resp.prealta;
            }),
                catchError(err => {
                    swal(err.error.mensaje, err.error.errors.message, 'error');
                    return throwError(err);
                }));

    }



    buscarSolicitud(termino: string): Observable<any> {
        // tslint:disable-next-line: prefer-const
        let url = URL_SERVICIOS + '/busqueda/coleccion/solicitudD/' + termino;
        return this.http.get(url)
            .pipe(map((resp: any) => resp.solicitudes));
    }

    cargarBL(archivo: File): Observable<any> {
        // tslint:disable-next-line:prefer-const
        let formData = new FormData();
        formData.append('file', archivo, archivo.name);
        // tslint:disable-next-line:prefer-const
        let url = URL_SERVICIOS + '/uploadFileTemp';
        // url += '?token=' + this._usuarioService.token;
        return this.http.put(url, formData)
            .pipe(map((resp: any) => {
                swal('Archivo Cargado', archivo.name, 'success');
                console.log(resp.nombreArchivo);
                return resp.nombreArchivo;
            }),
                catchError(err => {
                    swal(err.error.mensaje, err.error.errors.message, 'error');
                    return throwError(err);
                }));
    }

    cargarComprobante(archivo: File): Observable<any> {
        // tslint:disable-next-line:prefer-const
        let formData = new FormData();
        formData.append('file', archivo, archivo.name);
        // tslint:disable-next-line:prefer-const
        let url = URL_SERVICIOS + '/uploadFileTemp';
        // url += '?token=' + this._usuarioService.token;
        return this.http.put(url, formData)
            .pipe(map((resp: any) => {
                swal('Archivo Cargado', archivo.name, 'success');
                console.log(resp.nombreArchivo);
                return resp.nombreArchivo;
            }),
                catchError(err => {
                    swal(err.error.mensaje, err.error.errors.message, 'error');
                    return throwError(err);
                }));
    }

}
