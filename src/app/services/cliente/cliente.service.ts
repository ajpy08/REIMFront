import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../../pages/usuarios/usuario.service';
import { Cliente } from '../../models/cliente.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
// import swal from 'sweetalert';
declare var swal: any;

@Injectable()
export class ClienteService {
  // tslint:disable-next-line:no-inferrable-types
  totalClientes: number = 0;
  @Input() acttrue = false;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  getClientesRole(role?: string): Observable<any> {
    let url = URL_SERVICIOS + '/clientes/role/' + role;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.clientes));
  }

  getClientesEmpresa(idEmpresa: string, desde: number = 0): Observable<any> {
    let url = URL_SERVICIOS + '/clientes/empresa/' + idEmpresa + '?desde' + desde;
    return this.http.get(url);
  }

  getClientesEmpresas(idsEmpresas: string): Observable<any> {
    let url = URL_SERVICIOS + '/clientes/empresas/' + idsEmpresas;
    return this.http.get(url);
  }

  getClientes(desde: number = 0, act: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/clientes?desde=' + desde + '/';
    let params = new HttpParams();
    if (act === true || act === false) {
      const tf = act.toString();
      params = params.append('act', tf);
    }
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url, { params: params });
  }

  getCliente(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/clientes/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.cliente));
  }

  borrarCliente(cliente: Cliente): Observable<any> {
    let url = URL_SERVICIOS + '/clientes/' + cliente._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Cliente Borrado', 'Eliminado correctamente', 'success')),
      );
  }

  guardarCliente(cliente: Cliente): Observable<any> {
    let url = URL_SERVICIOS + '/clientes';
    if (cliente._id) {
      // actualizando
      url += '/' + cliente._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, cliente)
        .pipe(map((resp: any) => {
          swal('Cliente Actualizado', cliente.nombreComercial, 'success');
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
          swal('Cliente Creado', cliente.nombreComercial, 'success');
          return resp.cliente;
        }));
    }
  }

  habilitaDeshabilitaCliente(cliente: Cliente, act: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/clientes/clienteDes/' + cliente._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, { activo: act }).pipe(map((resp: any) => {
      swal('Cambio de estado del cliente realizado con exitoo', resp.cliente.nombreComercial, 'success');
      return true;
    }));
  }
}
