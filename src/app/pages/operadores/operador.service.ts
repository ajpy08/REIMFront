import { TransportistaService } from 'src/app/services/service.index';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Operador } from './operador.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
declare var swal: any;

@Injectable()
export class OperadorService {
  totalOperadores = 0;
  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService,
    public transportistaService: TransportistaService,

  ) { }

  getOperadores(transportista?: string, activo?: boolean): Observable<any> {
    const url = URL_SERVICIOS + '/operadores/';
    let params = new HttpParams();
    if (transportista) {
      params = params.append('transportista', transportista);
    }
    if (activo === true || activo === false) {
      const tf = activo.toString();
      params = params.append('activo', tf);
    }
    return this.http.get(url, { params: params });
  }

  getOperador(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/operadores/operador/' + id;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.operadores));
  }

  guardarOperador(operador: Operador): Observable<any> {
    let url = URL_SERVICIOS + '/operadores/operador';
    if (operador._id) {
      // actualizando
      url += '/' + operador._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, operador)
        .pipe(map((resp: any) => {
          swal('Operador Actualizado', operador.nombre, 'success');
          return resp.operador;
        }));
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, operador)
        .pipe(map((resp: any) => {
          swal('Operador Creado', operador.nombre, 'success');
          return resp.operador;
        }));
    }
  }

  habilitaDeshabilitaOperador(operador: Operador, act: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/operadores/operador/' + operador._id + '/habilita_deshabilita';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, { activo: act })
      .pipe(map((resp: any) => {
        swal('Cambio de estado del operador realizado con éxito', resp.operador.nombre, 'success');
        return true;
      }));
  }

  borrarOperador(operador: Operador): Observable<any> {
    let url = URL_SERVICIOS + '/operadores/operador/' + operador._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Operador Borrado', 'Eliminado correctamente', 'success')),
      );
  }

}
