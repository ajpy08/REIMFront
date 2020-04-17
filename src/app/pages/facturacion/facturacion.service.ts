import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { ProductoServicio } from './models/producto-servicio.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {

  IE = '';
  usoCFDI = '';
  tipo = '';
  receptor;
  productoServ = '';
  maniobras = [];

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  /* #region  Productos o Servicios */
  getProductosServicios(): Observable<any> {
    const url = URL_SERVICIOS + '/productos-servicios';
    return this.http.get(url);
  }

  getProductoServicio(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/productos-servicios/producto-servicio/' + id;
    return this.http.get(url).pipe(map((resp: any) => resp.producto_servicio));
  }

  guardarProductoServicio(producto_servicio: ProductoServicio): Observable<any> {
    let url = URL_SERVICIOS + '/productos-servicios/producto-servicio';
    if (producto_servicio._id) {
      // actualizando
      url += '/' + producto_servicio._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, producto_servicio).pipe(
        map((resp: any) => {
          swal('Producto-Servicio Actualizado', producto_servicio.descripcion, 'success');
          return resp.producto_servicio;
        })
      );
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, producto_servicio).pipe(
        map((resp: any) => {
          swal('Producto-Servicio Creado', producto_servicio.descripcion, 'success');
          // console.log(resp)
          return resp.producto_servicio;
        })
      );
    }
  }

  borrarProductoServicio(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/productos-servicios/producto-servicio/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http
      .delete(url)
      .pipe(
        map(resp => swal('Producto-Servicio Borrado', 'Eliminado correctamente', 'success'))
      );
  }
  /* #endregion */

  /* #region  Claves SAT */
  getClavesSAT(): Observable<any> {
    const url = URL_SERVICIOS + '/facturacion/clavesSAT';
    return this.http.get(url);
  }
  /* #endregion */

  /* #region  Claves Unidad */
  getClavesUnidad(): Observable<any> {
    const url = URL_SERVICIOS + '/facturacion/clavesUnidad';
    return this.http.get(url);
  }
  /* #endregion */

  /* #region  Series */
  getSeries(): Observable<any> {
    const url = URL_SERVICIOS + '/facturacion/series';
    return this.http.get(url);
  }
  /* #endregion */

  /* #region  Formas de Pago */
  getFormasPago(): Observable<any> {
    const url = URL_SERVICIOS + '/facturacion/formas-pago';
    return this.http.get(url);
  }
  /* #endregion */

  /* #region  Tipos de Comprobante */
  getTiposComprobante(): Observable<any> {
    const url = URL_SERVICIOS + '/facturacion/tipos-comprobante';
    return this.http.get(url);
  }
  /* #endregion */

  /* #region Usos de CFDI */
  getUsosCFDI(): Observable<any> {
    const url = URL_SERVICIOS + '/facturacion/usos-CFDI';
    return this.http.get(url);
  }
  /* #endregion */

}
