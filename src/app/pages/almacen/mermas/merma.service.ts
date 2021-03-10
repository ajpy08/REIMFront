
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../../environments/environment';
import { UsuarioService } from '../../usuarios/usuario.service';
import { Merma } from './merma.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Injectable()
export class MermaService {
  totalMerma = 0;
  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService,
  ) { }

  getMermas(noFactura?: string, proveedor?: string, material?: string): Observable<any> {
    let url = URL_SERVICIOS + '/mermas/';
    url += '?token=' + this._usuarioService.token;
    let params = new HttpParams();
    if (noFactura) {
      params = params.append('noFactura', noFactura);
    }
    if (proveedor) {
      params = params.append('proveedor', proveedor);
    }
    if (material) {
      params = params.append('material', material);
    }
    return this.http.get(url, { params: params });
  }

  getMermasAprobadas(noFactura?: string, proveedor?: string, material?: string, fInicial?: any, fFinal?: any): Observable<any> {
    let url = URL_SERVICIOS + '/mermas/aprobadas/';
    url += '?token=' + this._usuarioService.token;
    let params = new HttpParams();
    if (noFactura) {
      params = params.append('noFactura', noFactura);
    }
    if (proveedor) {
      params = params.append('proveedor', proveedor);
    }
    if (material) {
      params = params.append('material', material);
    }
    if (fInicial) params = params.append('fInicial', fInicial.toString());
    if (fFinal) params = params.append('fFinal', fFinal.toString());
    
    return this.http.get(url, { params: params });
  }

  getMerma(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/mermas/merma/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.merma));
  }

  guardarMerma(merma: Merma): Observable<any> {
    let url = URL_SERVICIOS + '/mermas/merma';
    if (merma._id) {
      // actualizando
      url += '/' + merma._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, merma)
        .pipe(map((resp: any) => {
          swal('Merma Actualizada', 'Actualizado correctamente', 'success');
          return resp.merma;
        }));
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, merma)
        .pipe(map((resp: any) => {
          swal('Merma Creada', 'Creado correctamente', 'success');
          return resp.merma;
        }));
    }
  }

  borrarMerma(merma: Merma): Observable<any> {
    let url = URL_SERVICIOS + '/mermas/merma/' + merma._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Merma Borrada', 'Eliminada correctamente', 'success')),
    );
  }

  aprobarMerma(merma: Merma): Observable<any> {
    let url = URL_SERVICIOS + '/mermas/aprobar/merma/' + merma._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, merma)
      .pipe(map(resp => swal('Merma Aprobada', 'Aprobada correctamente', 'success')),
    );
  }

  DesaprobarMerma(merma: Merma): Observable<any> {
    let url = URL_SERVICIOS + '/mermas/desaprobar/merma/' + merma._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, merma)
      .pipe(map(resp => swal('Merma Desaprobada', 'Desaprobada correctamente', 'success')),
    );
  }

}
