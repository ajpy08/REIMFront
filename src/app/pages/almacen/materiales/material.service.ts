
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../../environments/environment';
import { UsuarioService } from '../../usuarios/usuario.service';
import { Material } from './material.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

declare var swal: any;

@Injectable()
export class MaterialService {
  totalMateriales = 0;
  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService,
  ) { }

  getMateriales(descripcion?: string, activo?: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/materiales/';
    url += '?token=' + this._usuarioService.token;
    let params = new HttpParams();
    if (descripcion) {
      params = params.append('descripcion', descripcion);
    }
    if (activo === true || activo === false) {
      const tf = activo.toString();
      params = params.append('activo', tf);
    }
    return this.http.get(url, { params: params });
  }

  getMaterial(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/materiales/material/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.material));
  }

  async getMaterialAsync(id: string) {
    let url = URL_SERVICIOS + '/materiales/material/' + id;
    url += '?token=' + this._usuarioService.token;
    return await this.http.get(url).toPromise();
  }

  getValidaCostoPrecio(): Observable<any> {
    let url = URL_SERVICIOS + '/materiales/costo-precio/';
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }
  getStockMaterial(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/materiales/material/stock/' + id;
    url += '?token=' + this._usuarioService.token;
    console.log (url);
    return this.http.get(url);
  }
  async getStockMaterialAsync(id: string) {
    let url = URL_SERVICIOS + '/materiales/material/stock/' + id;
    url += '?token=' + this._usuarioService.token;
    return await this.http.get(url).toPromise();
  }

  guardarMaterial(material: Material): Observable<any> {
    let url = URL_SERVICIOS + '/materiales/material';
    if (material._id) {
      // actualizando
      url += '/' + material._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, material)
        .pipe(map((resp: any) => {
          swal('Material Actualizado', material.descripcion, 'success');
          return resp.material;
        }));
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, material)
        .pipe(map((resp: any) => {
          swal('Material Creado', material.descripcion, 'success');
          return resp.material;
        }));
    }
  }

  habilitaDeshabilitaMaterial(material: Material, act: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/materiales/material/' + material._id + '/habilita_deshabilita';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, { activo: act })
      .pipe(map((resp: any) => {
        swal('Cambio de estado del material realizado con éxito', resp.material.descripcion, 'success');
        return true;
      }));
  }

  borrarMaterial(material: Material): Observable<any> {
    let url = URL_SERVICIOS + '/materiales/material/' + material._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Material Borrado', 'Eliminado correctamente', 'success')),
    );
  }

}
