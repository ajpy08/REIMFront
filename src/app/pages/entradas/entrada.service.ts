
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Entrada } from './entrada.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

declare var swal: any;

@Injectable()
export class EntradaService {
  totalEntrada = 0;
  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService,
  ) { }

  getEntradas(noFactura?: string, proveedor?: string): Observable<any> {
    let url = URL_SERVICIOS + '/entradas/';
    url += '?token=' + this._usuarioService.token;
    let params = new HttpParams();
    if (noFactura) {
      params = params.append('noFactura', noFactura);
    }
    if (proveedor) {
        params = params.append('proveedor', proveedor);
      }
    return this.http.get(url, { params: params });
  }

  getEntrada(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/entradas/entrada/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.entrada));
  }

  guardarEntrada(entrada: Entrada): Observable<any> {
    let url = URL_SERVICIOS + '/entradas/entrada';
    if (entrada._id) {
      // actualizando
      url += '/' + entrada._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, entrada)
        .pipe(map((resp: any) => {
          swal('Entrada Actualizada', entrada.noFactura, 'success');
          return resp.entrada;
        }));
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, entrada)
        .pipe(map((resp: any) => {
          swal('Entrada Creada', entrada.noFactura, 'success');
          return resp.entrada;
        }));
    }
  }

  borrarEntrada(entrada: Entrada): Observable<any> {
    let url = URL_SERVICIOS + '/entradas/entrada/' + entrada._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Entrada Borrada', 'Eliminada correctamente', 'success')),
      );
  }

}
