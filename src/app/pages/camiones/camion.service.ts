import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuarios/usuario.service';
import { Camion } from './camion.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable()
export class CamionService {
  totalCamiones: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  getCamiones(transportista?: string): Observable<any> {
    let url = URL_SERVICIOS + '/camiones/' ;
    let params = new HttpParams();
    if (transportista)  {
      params = params.append('transportista', transportista);
    }
    return this.http.get(url, {params: params });
  }

  getCamion(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/camiones/camion/' + id;
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

  borrarCamion(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/camiones/camion/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Camion Borrado', 'Eliminado correctamente', 'success')));
  }

}
