
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { DetalleMaterial } from './detalleMaterial.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

declare var swal: any;

@Injectable()
export class DetalleMaterialService {
  totalDetalleMaterial = 0;
  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService,
  ) { }

  // getDetallesMaterial(noFactura?: string, proveedor?: string): Observable<any> {
  //   let url = URL_SERVICIOS + '/detallesMaterial/';
  //   url += '?token=' + this._usuarioService.token;
  //   let params = new HttpParams();
  //   if (noFactura) {
  //     params = params.append('noFactura', noFactura);
  //   }
  //   if (proveedor) {
  //       params = params.append('proveedor', proveedor);
  //     }
  //   return this.http.get(url, { params: params });
  // }

  // getDetalleMaterial(id: string): Observable<any> {
  //   let url = URL_SERVICIOS + '/detallesMaterial/detalleMaterial/' + id;
  //   url += '?token=' + this._usuarioService.token;
  //   return this.http.get(url)
  //     .pipe(map((resp: any) => resp.detalleMaterial));
  // }

  guardarDetalleMaterial(detalleMaterial: DetalleMaterial): Observable<any> {
    let url = URL_SERVICIOS + '/detalles/detalle';
    if (detalleMaterial._id) {
      // actualizando
      url += '/' + detalleMaterial._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, detalleMaterial)
        .pipe(map((resp: any) => {
          swal('DetalleMaterial Actualizado', detalleMaterial.material.descripcion, 'success');
          return resp.detalleMaterial;
        }));
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, detalleMaterial)
        .pipe(map((resp: any) => {
          swal('DetalleMaterial Creado', detalleMaterial.material.descripcion, 'success');
          return resp.detalleMaterial;
        }));
    }
  }

  borrarDetalleMaterial(detalleMaterial: DetalleMaterial): Observable<any> {
    let url = URL_SERVICIOS + '/detalles/detalle/' + detalleMaterial._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('DetalleMaterial Borrado', 'Eliminado correctamente', 'success')),
      );
  }

}
