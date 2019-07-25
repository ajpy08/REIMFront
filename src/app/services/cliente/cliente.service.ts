import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Cliente } from '../../models/cliente.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable()
export class ClienteService {
  // tslint:disable-next-line:no-inferrable-types
  totalClientes: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  getClientesRole(role?: string): Observable<any> {
    let url = URL_SERVICIOS + '/cliente/role/' + role;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.clientes));
  }

  getClientesEmpresa(id: string, desde: number = 0): Observable<any> {
    const url = URL_SERVICIOS + '/cliente/empresa/' + id + '?desde' + desde;
    return this.http.get(url);
  }

  getClientes(desde: number = 0): Observable<any> {
    let url = URL_SERVICIOS + '/cliente?desde=' + desde;
    return this.http.get(url);
  }

  getCliente(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/cliente/' + id;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.cliente));
  }

  borrarCliente(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/cliente/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Cliente Borrado', 'Eliminado correctamente', 'success')));
  }

  guardarCliente(cliente: Cliente): Observable<any> {
    let url = URL_SERVICIOS + '/cliente';
    if (cliente._id) {
      // actualizando
      url += '/' + cliente._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, cliente)
        .pipe(map((resp: any) => {
          swal('Cliente Actualizado', cliente.razonSocial, 'success');
          return resp.cliente;
        }),
          catchError(err => {
            console.error(err);
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    } else {      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, cliente)
        .pipe(map((resp: any) => {
          swal('Cliente Creado', cliente.razonSocial, 'success');
          return resp.cliente;
        }),
          catchError(err => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    }
  }

  buscarCliente(termino: string): Observable<any> {
    let url = URL_SERVICIOS + '/busqueda/coleccion/clientes/' + termino;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.clientes));
  }
}
