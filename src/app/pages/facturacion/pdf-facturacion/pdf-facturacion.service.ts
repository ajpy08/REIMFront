import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UsuarioService } from '../../usuarios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class PdfFacturacionService {

  constructor(public http: HttpClient,
    public _usuarioService: UsuarioService) { }


  getUSO(uso?: string): Observable<any> {
    let params = new HttpParams();
    if (uso) {
      params = params.append('uso', uso);

    }
    let url = URL_SERVICIOS + '/pdfFacturacion/uso/' + uso;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url, {params: params});
  }
  getMetodoPago(metodoPago?: string): Observable<any> {
    let params = new HttpParams();
    if (metodoPago) {
      params = params.append('metodoPago', metodoPago);
    }
    let url = URL_SERVICIOS + '/pdfFacturacion/metodoPago/' + metodoPago;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url, {params: params});
  }

  getCLAVE(clave?: string): Observable<any> {
    let params = new HttpParams();
    if (clave) {
      params = params.append('clave', clave);
    }
    let url = URL_SERVICIOS + '/pdfFacturacion/clave/unidad/' + clave;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url, {params: params});
  }

  getNumeroAletras(total: Float64ArrayConstructor): Observable<any> {
    let url = URL_SERVICIOS +  '/pdfFacturacion/numerosLetras/' + total;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  envioCorreoCFDI(correo: string, archivo: string, nombre: string): Observable<any> {
    let url = URL_SERVICIOS + '/pdfFacturacion/envioCorreo/' + correo + '&' + archivo + '&' + nombre;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }
  envioCorreoCFDIB(correo: string, archivo: string, nombre: string): Observable<any> {
    let url = URL_SERVICIOS + '/pdfFacturacion/envioCorreoB/' + correo + '&' + archivo + '&' + nombre;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  pdfGenerate(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/pdfFacturacion/pdfCFDI/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  subirBooket(archivos: any, subir: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/pdfFacturacion/booket/' + archivos + '&' + subir;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  QuitarCredito(): Observable<any> {
    let url = URL_SERVICIOS + '/pdfFacturacion/QuitCredito/';
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }


}

