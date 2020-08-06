import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Camion } from './camion.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
// import swal from 'sweetalert';
declare var swal: any;

@Injectable()
export class CamionService {
  totalCamiones = 0;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  getCamiones(activo?: boolean, transportista?: string, ): Observable<any> {
    let url = URL_SERVICIOS + '/camiones/' ;
    url += '?token=' + this._usuarioService.token;
    let params = new HttpParams();
    if (transportista)  {
      params = params.append('transportista', transportista);
    }
    if (activo === true || activo === false) {
      const tf = activo.toString();
      params = params.append('activo', tf);
    }
    return this.http.get(url, {params: params });
  }

  getCamion(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/camiones/camion/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.camion));
  }

  guardarCamion(camion: Camion): Observable<any> {
    let url = URL_SERVICIOS + '/camiones/camion';
    if (camion._id) {
      // actualizando
      url += '/' + camion._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, camion)
        .pipe(
          map((resp: any) => {
            swal('Camion Actualizado', camion.noEconomico, 'success');
            return resp.camion;
          }));
    } else {      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, camion)
        .pipe(map((resp: any) => {
            swal('Camion Creado', camion.noEconomico, 'success');
            return resp.camion;
          }));
    }
  }

  borrarCamion(camion: Camion): Observable<any> {
    let url = URL_SERVICIOS + '/camiones/camion/' + camion._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Camion Borrado', 'Eliminado correctamente', 'success')),
    );
  }

  habilitaDeshabilitaCamion(camion: Camion, act: boolean): Observable<any> {
  let url = URL_SERVICIOS + '/camiones/camionDes/' + camion._id;
  url += '?token=' + this._usuarioService.token;
  return this.http.put(url, {activo: act}).pipe(map((resp: any) => {
    swal('Cambio de estado del camion realizado con exitoo', resp.camion.placa, 'success');
    return true;
  }));
  }

}
