import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Viaje } from './viaje.models';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';

import swal from 'sweetalert';

const HttpUploadOptions = {
  headers: new HttpHeaders({ 'Accept': 'application/json' })
};

@Injectable()
export class ViajeService {
  
  
  viaje: Viaje;
  messages: string[] = [];
  datos: any[] = [];

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService,
    public _subirArchivoService: SubirArchivoService
  ) { }

// ==========================================
// Obtener todas los viajes, de acuerdo a los filtros solicitados.
// las fechas deben ir en formato DD-MM-YYYY
// TODOS los parametros son opcionales (para traer todos lo registros no mandar los parametros)
// ==========================================

  getViajes(fIniArribo?: string, fFinArribo?: string, viaje?: string, buque?: string): Observable<any> {

    let params = new HttpParams();
    if (fIniArribo && fFinArribo) {
      params = params.append('finiarribo', fIniArribo);
      params = params.append('ffinarribo', fFinArribo);
    }
    if (viaje)  
      params = params.append('viaje', viaje);
    if (buque)  
      params = params.append('buque', buque);
    // console.log(params.toString());
    const url = URL_SERVICIOS + '/viajes';
    return this.http.get(url,{params: params });
  }


  getViajesA(anio: string): Observable<any> {
    const url = URL_SERVICIOS + '/viaje/anio/'+ anio;
    console.log(url)
    return this.http.get(url);
  }


  getViajeXID(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/viaje/' + id;
    return this.http.get(url).pipe(map((resp: any) => resp.viaje));
  }


  guardarViaje(viaje: Viaje): Observable<any> {
    let url = URL_SERVICIOS + '/viaje';
    if (viaje._id) { // actualizando
      url += '/' + viaje._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, viaje)
        .pipe(map((resp: any) => {
          swal('Viaje Actualizado', viaje.viaje, 'success');
          return resp.viaje;
        }),
          catchError(err => {
            swal(err.error.mensaje, err.error.errores.message, 'error');
            return throwError(err);
          }));

    } else {// creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, viaje)
        .pipe(map((resp: any) => {
          swal('Viaje Creado', 'viaje: ' + viaje.viaje, 'success')
          return resp.viaje;
        }),
          catchError(err => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    }
  }

  borrarViaje(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/viaje/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete(url)
      .pipe(map(resp => swal('Viaje Borrado', 'Eliminado correctamente', 'success')));

  }

  removerContenedor(id: string, contenedor: string): Observable<any> {
    let url = URL_SERVICIOS + '/viaje/removecontenedor/' + id + '&' + contenedor;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, '')
      .pipe(map((resp: any) => {
        swal('Contenedor Eliminado', 'success');
        return resp;
      }),
        catchError(err => {
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
  }

  addContenedor(id: string, contenedor: string, tipo: string, estado: string, destinatario: string): Observable<any> {
    let url = URL_SERVICIOS + '/viaje/addcontenedor/' + id + '&' + contenedor + '&' + tipo + '&' + estado + '&' + destinatario;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, '')
      .pipe(map((resp: any) => {
        swal('Contenedor Agregado con exito', 'success');
        return resp;
      }),
        catchError(err => {
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
  }


  cargarViajeNumero(viaje: string): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/viaje/numero/' + viaje;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.viaje));

  }





  buscarViaje(termino: string): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/busqueda/coleccion/viajes/' + termino;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.viajes));

  }

  // actualizarContenedor(viaje: Viaje ): Observable<any> {

  //   let url = URL_SERVICIOS + '/viaje/add/' + viaje._id;
  //       url += '?token=' + this._usuarioService.token;

  //       return this.http.put( url, viaje )
  //                 .pipe(map( (resp: any) => {
  //                   swal('Viaje Actualizado', viaje.viaje, 'success');
  //                   return resp.viaje;

  //                 }),
  //                 catchError( err => {
  //                   swal( err.error.mensaje, err.error.errors.message, 'error' );
  //                   return throwError(err);
  //                 }));

  //     }





  cargarExcel(archivo: File): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let formData = new FormData();

    formData.append('xlsx', archivo, archivo.name);

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/exceltojson';
    // url += '?token=' + this._usuarioService.token;
    return this.http.put(url, formData)
      .pipe(map((resp: any) => {
        swal('Excel leido con exito', archivo.name, 'success');
        // console.log(resp.excel);
        return resp.excel;

      }),
        catchError(err => {
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
  }

}

