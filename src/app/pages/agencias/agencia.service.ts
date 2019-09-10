import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuarios/usuario.service';
import { Agencia } from './agencia.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable()
export class AgenciaService {
  // tslint:disable-next-line:no-inferrable-types
  totalAgencias: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  getAgencias(): Observable<any> {
    let url = URL_SERVICIOS + '/agencias';
    return this.http.get(url);
  }

  getAgencia(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/agencias/agencia/' + id;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.agencia));
  }


  guardarAgencia(agencia: Agencia): Observable<any> { // probar
    let url = URL_SERVICIOS + '/agencias/agencia';
    if (agencia._id) { // actualizando
      url += '/' + agencia._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, agencia)
        .pipe(map((resp: any) => {
          swal('Agencia Actualizada', agencia.razonSocial, 'success');
          return resp.agencia;
        }));
    } else {      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, agencia)
        .pipe(map((resp: any) => {
          swal('Agencia Creada', agencia.razonSocial, 'success');
          return resp.agencia;
        }));
    }
  }

  borrarAgencia(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/agencias/agencia/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Agencia Borrada', 'Eliminado correctamente', 'success')));
  }

}
