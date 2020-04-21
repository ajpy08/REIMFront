import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Transportista } from './transportista.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import swal from 'sweetalert';
declare var swal: any;
import { text } from '@angular/core/src/render3';

@Injectable()
export class TransportistaService {
  totalTransportistas = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  getTransportistas(tf: boolean): Observable<any> {
    const url = URL_SERVICIOS + '/transportistas/' + tf;
    return this.http.get(url);
  }

  getTransportista(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/transportistas/transportista/' + id;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.transportista));
  }

  guardarTransportista(transportista: Transportista): Observable<any> {
    let url = URL_SERVICIOS + '/transportistas/transportista';
    if (transportista._id) {// actualizando
      url += '/' + transportista._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, transportista)
        .pipe(map((resp: any) => {
          swal('Transportista Actualizado', transportista.nombreComercial, 'success');
          return resp.transportista;
        }));

    } else {// creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, transportista)
        .pipe(map((resp: any) => {
          swal('Transportista Creado', transportista.nombreComercial, 'success');
          return resp.transportista;
        }));
    }
  }

  borrarTransportista(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/transportistas/transportista/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Transportista Borrado', 'Eliminado correctamente',
        'success')),
        catchError(err => {
          if (err.error.resultadoError) {
            if (err.error.resultadoError.length > 0) {
              let nombre = '';
              let idO = '';
              err.error.resultadoError.forEach(er => {
                nombre += er.nombre + ',';
              });
                if (err) {
                  swal({
                    title: 'Error',
                    text: 'Existen (' + err.error.resultadoError.length +
                      ') Operadores , para eliminar este transportista es necesario desactivar a ' +
                       'los Operadores ' +
                      nombre + ' ¿QUIERES DESACTIVARLOS?',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true
                  }).then(borrado => {
                    if (borrado) {
                      err.error.resultadoError.forEach(op => {
                        idO = op._id;

                        this.desactivar(idO, 'operador').subscribe(act => {
                          // swal(' Actualizado','Operador Actualizado', 'success');
                          this.borrarTransportista(id).subscribe(borrado => {
                            this.getTransportistas().subscribe(act => {
                              swal('Borrado' , 'Transportista Borrado', 'Eliminado correctamente');
                            });
                          });
                        });
                      });

                    }
                  });
                }
          }
          } else {
            if (err.error.resultadoErrorC) {
              if (err.error.resultadoErrorC.length > 0) {
                  err.error.resultadoErrorC.forEach(er => {
                let placa = '';
                let idC = '';

                placa += er.placa + ',';


                    if (er) {
                      swal({
                        title: 'Error',
                        text: 'Existen  ( ' + err.error.resultadoErrorC.length +
                          ' ) Camiones , para eliminar este transportista es necesario desactivar a los Camiones con placa  ' +
                          er.placa,
                        icon: 'warning',
                        buttons: true,
                        dangerMode: true
                      }).then(borrado => {
                        if (borrado) {
                          err.error.resultadoErrorC.forEach(ca => {
                            idC = ca._id;
                            this.desactivar(idC, 'camion').subscribe(act => {
                              swal(' Actualizado', 'Camion Actualizado', 'success');
                            });
                          });

                          this.borrarTransportista(id).subscribe(borrado => {
                            this.getTransportistas().subscribe(act => {
                              swal('Borrado' ,'Transportista Borrado', 'Eliminado correctamente');
                            });
                          });
                        }
                      });
                    }
                  });
                }
            }
          }
          return throwError(err);
        }));
  }

  desactivar(id: string, CO: string): Observable<any> {
    let url = URL_SERVICIOS +  '/transportistas/desactivar/' + id + '&' + CO;
    // url += '?token=' + this._usuarioService.token;
    return this.http.put(url, CO).pipe(map((resp: any) => {
      return resp;
    }));
  }

  desactivarTransportista(transportista: Transportista, act: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/transportistas/transportista/' + transportista._id + 'habilita_deshabilita';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, {activo: act}).pipe(map((resp: any) => {
      swal('Cambio de estado del Transportista realizado con exito', resp.transportista.nombreComercial, 'success');
      return true;
    }))
  }

}
