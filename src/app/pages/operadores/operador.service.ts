import { TransportistaService } from 'src/app/services/service.index';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Operador } from './operador.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
declare var swal: any;

@Injectable()
export class OperadorService {
  totalOperadores = 0;
  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService,
    public transportistaService: TransportistaService,

  ) { }

  getOperadores(transportista?: string, activo?: boolean): Observable<any> {
    const url = URL_SERVICIOS + '/operadores/';
    let params = new HttpParams();
    if (transportista) {
      params = params.append('transportista', transportista);
    }
    if (activo) {
      params = params.append('activo', 'true');
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

  borrarOperador(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/operadores/operador/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Operador Borrado', 'Eliminado correctamente', 'success')),
        catchError(err => {
          if (err.error.errorCamion.length > 0) {
            let placa = '';
            let idC = '';
            err.error.errorCamion.forEach(c => {
              placa += c.placa;
            });
            swal({
              title: 'Error',
              text: 'Existe(n) ( ' + err.error.errorCamion.length + ' ) Camion(es), para eliminar al Operador es necesario desactivar a ' +
                'los camion(es) con placa ' + placa + ' ¿QUIERES DESACTIVARLOS?',
              icon: 'warning',
              buttons: true,
              dangerMode: true
            }).then(borrado => {
              if (borrado) {
                err.error.errorCamion.forEach(c => {
                  idC = c._id;
                  this.transportistaService.desactivar(idC, 'camion').subscribe(act => {
                    this.borrarOperador(id).subscribe(() => {
                      swal('Borrado', 'Se ha borrado el Operador', 'success');

                    });
                  });
                });

              }
            })
          }
          return throwError(err);
        })
      );
  }

}
