import { CFDI } from './models/cfdi.models';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { ProductoServicio } from './models/producto-servicio.models';
import { ClaveProductosServicio } from './clave-productos-servicios/clave-producto.servicio.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { ClaveUnidadServicio } from './clave-unidades/clave-unidad.service.models';

@Injectable({
  providedIn: 'root'
})
export class FacturacionService {
  IE = '';
  receptor;
  tipo = '';
  // maniobras = [];
  carritoAFacturar = [];
  aFacturarV = [];
  aFacturarM = [];
  peso = '';

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  /* #region  CFDIS */

  getCFDIS(): Observable<any> {
    const url = URL_SERVICIOS + '/cfdis/';
    return this.http.get(url);
  }

  getCFDIS_T_sT(timbre: boolean): Observable<any> {
    const url = URL_SERVICIOS + '/cfdis/T_ST/' + timbre;
    let params = new HttpParams();
    if (timbre) {
      const timbres = timbre.toString();
      params = params.append('timbre', timbres);
    }
    return this.http.get(url, { params: params });
  }

  getCFDI(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/cfdis/cfdi/' + id;
    return this.http.get(url).pipe(map((resp: any) => resp.cfdi));
  }
  getCFDIPDF(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/cfdis/cfdi/' + id;
    return this.http.get(url);
  }

  guardarCFDI(cfdi: CFDI): Observable<any> {
    let url = URL_SERVICIOS + '/cfdis/cfdi';
    if (cfdi._id) {

      if (cfdi.informacionAdicional === '') {
        cfdi.informacionAdicional = '@';
      }
      // actualizando
      url += '/' + cfdi._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, cfdi).pipe(
        map((resp: any) => {
          swal('CFDI Actualizado', cfdi.serie + ' - ' + cfdi.folio, 'success');
          return resp.cfdi;
        })
      );
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, cfdi).pipe(
        map((resp: any) => {
          swal('CFDI Creado', cfdi.serie + ' - ' + cfdi.folio, 'success');
          // console.log(resp)
          return resp.cfdi;
        })
      );
    }
  }

  borrarCFDI(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/cfdis/cfdi/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http
      .delete(url)
      .pipe(
        map(resp => swal('CFDI Borrado', 'Eliminado correctamente', 'success'))
      );
  }

  getManiobrasConceptos(maniobra_ID: string, concepto_ID: string): Observable<any> {
    let url = URL_SERVICIOS + '/cfdis/cfdis/Maniobra/Concepto/' + maniobra_ID + '&' + concepto_ID + '/';
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  xmlCFDI(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/cfdis/cfdi/' + id + '/xml/';
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  timbrarXML(nombre: string, id: string, direccion: string, info: string): Observable<any> {
    if (info === '') {
      info = '@';
    }
    const url = URL_SERVICIOS + '/cfdis/timbrado/' + nombre + '&' + id + '&' + direccion + '&' + info + '/';
    return this.http.get(url);
  }

  actualizarDatosTimbre(cfdi: CFDI): Observable<any> {
    let url = URL_SERVICIOS + '/cfdis/datosTimbrado/' + cfdi._id + '/';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, cfdi).pipe(map((resp: any) => {
      // swal('Correcto', 'Se ha timbrado correctamente', 'success');
      return resp.cfdiTimbradoAct;
    }));
  }

  codeQR(uuid: string, rfc_emisor: string, rfc_receptor: string, total: string, sello: string): Observable<any> {
    let selloMod = '';
    const sus = sello.indexOf('/');
    if (sus !== -1) {
      selloMod = sello.replace('/', '@');
    } else {
      selloMod = sello;
    }
    const url = URL_SERVICIOS + '/cfdis/code/' + uuid + '&' + rfc_emisor + '&' + rfc_receptor + '&' + total + '&' + selloMod + '/';
    return this.http.get(url);
  }

  /* #endregion */

  /* #region  CLAVE PRODUCTOS SERVICIO */
  getClaveproductosServicio(): Observable<any> {
    const url = URL_SERVICIOS + '/clave-productos-servicios';
    return this.http.get(url);
  }

  getClaveProductoServicio(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/clave-productos-servicios/clave-producto-servicio/' + id;
    return this.http.get(url).pipe(map((resp: any) => resp.ClaveProServicio));
  }

  guardarClaveProductoServicio(Clave_ProductosServicio: ClaveProductosServicio) {
    let url = URL_SERVICIOS + '/clave-productos-servicios/clave-producto-servicio/';
    if (Clave_ProductosServicio._id) {
      // acualizar
      url += Clave_ProductosServicio._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, Clave_ProductosServicio).pipe(map((resp: any) => {
        swal('Clave Producto Servicio', Clave_ProductosServicio.descripcion, 'success');
        return resp.clave;
      }));
    } else {
      // nuevo
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, Clave_ProductosServicio).pipe(map
        ((resp: any) => {
          swal('Clave Producto Servicio Creado', Clave_ProductosServicio.descripcion, 'success');
          return resp.clave_producto_servicio;
        }));
    }
  }

  borrarClaveProductoServicio(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/clave-productos-servicios/clave-producto-servicio/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http
      .delete(url)
      .pipe(
        map(resp => swal(' Calve Producto Servicio Borrado', 'Eliminado correctamente', 'success'))
      );
  }
  /* #endregion */

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

  cancelacionCFDI(rfcEmisor: string, uuid: string, total: any): Observable<any> {
    let url = URL_SERVICIOS + '/cfdis/cancelacionCFDI/' + rfcEmisor + '&' + uuid +  '&' + total + '/';
    return this.http.get(url);
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

  creditos(creditos: string): Observable<any> {
  const url = URL_SERVICIOS + '/cfdis/creditos/' + creditos;
  return this.http.put(url, creditos);
  }
  getCreditos(id: string): Observable<any> {
  const url = URL_SERVICIOS + '/cfdis/getCreditos/' + id;
  return this.http.get(url);
  }

  /* #region  CLAVE UNIDAD */
  getClaveUnidades(): Observable<any> {
    const url = URL_SERVICIOS + '/clave-unidades';
    return this.http.get(url);
  }

  getClaveUnidad(id: string) {
    const url = URL_SERVICIOS + '/clave-unidades/clave-unidad/' + id;
    return this.http.get(url).pipe(map((resp: any) => resp.clave_unidad));
  }
  guardarClaveUnidad(clave_unidad: ClaveUnidadServicio): Observable<any> {
    let url = URL_SERVICIOS + '/clave-unidades/clave-unidad';
    if (clave_unidad._id) {
      // actualizando
      url += '/' + clave_unidad._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, clave_unidad).pipe(
        map((resp: any) => {
          swal('Clave Unidad Actualizado', clave_unidad.claveUnidad, 'success');
          return resp.clave_unidad;
        })
      );
    } else {
      // creando
      url += '/';
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, clave_unidad).pipe(
        map((resp: any) => {
          swal('Clave Unidad Creado', clave_unidad.claveUnidad, 'success');
          // console.log(resp)
          return resp.clave_unidad;
        })
      );
    }
  }
  borrarClaveUnidad(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/clave-unidades/clave-unidad/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http
      .delete(url)
      .pipe(
        map(resp => swal('Clave Unidad Borrado', 'Eliminado correctamente', 'success'))
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

  getSerieXSerie(serie: string): Observable<any> {
    const url = URL_SERVICIOS + '/facturacion/series/' + serie;
    return this.http.get(url).pipe(map((resp: any) => resp.serie));
  }
  /* #endregion */

  /* #region  Formas de Pago */
  getFormasPago(): Observable<any> {
    const url = URL_SERVICIOS + '/facturacion/formas-pago';
    return this.http.get(url);
  }
  /* #endregion */

  /* #region  Metodos de Pago */
  getMetodosPago(): Observable<any> {
    const url = URL_SERVICIOS + '/facturacion/metodos-pago';
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

  deletManiobrasConceptos(cfdi: string, maniobra: string, concepto: string): Observable<any> {
    const url = URL_SERVICIOS + '/facturacion/deleteConceptoManiobra/' + cfdi + '&' + maniobra + '&' + concepto;
    return this.http.get(url);
  }

}
