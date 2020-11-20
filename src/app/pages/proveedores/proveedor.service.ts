import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Proveedor } from './proveedor.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
declare var swal: any;

@Injectable()
export class ProveedorService {
  // tslint:disable-next-line:no-inferrable-types
  totalProveedores: number = 0;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService
  ) {}

  getProveedores(tf: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/proveedores/' + tf;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }


  getProveedor(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/proveedores/proveedor/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url).pipe(map((resp: any) => resp.proveedor));
  }

  guardarProveedor(proveedor: Proveedor): Observable<any> {
    let url = URL_SERVICIOS + '/proveedores/proveedor';
    if (proveedor._id) {
      // actualizando
      url += '/' + proveedor._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, proveedor).pipe(
        map((resp: any) => {
          swal('Proveedor Actualizado', proveedor.razonSocial, 'success');

          return resp.proveedor;
        })
      );
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, proveedor).pipe(
        map((resp: any) => {
          swal('Proveedor Creado', proveedor.razonSocial, 'success');
          // console.log(resp)
          return resp.proveedor;
        })
      );
    }
  }

  borrarProveedor(proveedor: Proveedor): Observable<any> {
    let url = URL_SERVICIOS + '/proveedores/proveedor/' + proveedor._id;
    url += '?token=' + this._usuarioService.token;
    return this.http
      .delete(url)
      .pipe(map(resp => swal('Proveedor Borrado', 'Eliminado correctamente', 'success')),
      );
  }


  habilitaDeshabilitaProveedor(proveedor: Proveedor, act: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/proveedores/proveedor/' + proveedor._id + '/habilita_deshabilita';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, {activo: act}).pipe(map((resp: any) => {
      swal('Correcto', 'Cambio de estado del proveedor ' + resp.proveedor.razonSocial + ' realizado con exito', 'success');
      return true;
    }));
  }
}
