import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Viaje } from './viaje.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';

const HttpUploadOptions = {
  headers: new HttpHeaders({ 'Accept': 'application/json' })
};

@Injectable()
export class ViajeService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
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
    if (viaje)  {
      params = params.append('viaje', viaje);
    }
    if (buque)  {
      params = params.append('buque', buque);
    }
    // console.log(params.toString());
    const url = URL_SERVICIOS + '/viajes';
    return this.http.get(url, {params: params });
  }

  getViajesA(anio: string): Observable<any> {
    const url = URL_SERVICIOS + '/viajes/anio/' + anio;
    // console.log( url )
    return this.http.get(url);
  }

  getViajeXID(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/viajes/viaje/' + id;
    return this.http.get(url).pipe(map((resp: any) => resp.viaje));
  }

  guardarViaje(viaje: Viaje): Observable<any> {
    if (viaje._id) { // actualizando
      return this.actualizaViaje(viaje);
    } else {// creando
      return this.altaViaje(viaje);
    }
  }

  altaViaje(viaje: Viaje): Observable<any> {
    let url = URL_SERVICIOS + '/viajes';
    url += '?token=' + this._usuarioService.token;
    return this.http.post(url, viaje)
      .pipe(map((resp: any) => {
        swal('Viaje Creado', 'viaje: ' + viaje.viaje, 'success')
        return resp.viaje;
      }));
  }

  actualizaViaje (viaje: Viaje): Observable<any> {
    let url = URL_SERVICIOS + '/viajes';
    url += '/' + viaje._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, viaje)
      .pipe(map((resp: any) => {
        swal('Viaje Actualizado', viaje.viaje, 'success');
        return resp.viaje;
      }));
  }

  borrarViaje(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/viajes/viaje/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Viaje Borrado', 'Eliminado correctamente', 'success')));
  }

  addContenedor(id: string, contenedor: string, tipo: string, peso: string, destinatario: string): Observable<any> {
    let url = URL_SERVICIOS + '/viajes/viaje/' + id + '/addcontenedor';
    url += '?token=' + this._usuarioService.token;
    url += '&contenedor=' + contenedor + '&tipo=' + tipo + '&peso=' + peso + '&destinatario=' + destinatario;
    return this.http.put(url, '')
      .pipe(map((resp: any) => {
        swal('Contenedor Agregado con exito', 'success');
        return resp;
      }));
  }

  removerContenedor(id: string, contenedor: string): Observable<any> {
    let url = URL_SERVICIOS + '/viajes/viaje/removecontenedor/' + id + '&' + contenedor;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, '')
      .pipe(map((resp: any) => {
        swal('Contenedor Eliminado', 'success');
        return resp;
      }));
  }

}

