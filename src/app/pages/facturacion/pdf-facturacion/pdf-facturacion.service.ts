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
    const url = URL_SERVICIOS + '/pdfFacturacion/uso/' + uso;
    return this.http.get(url, {params: params});
  }
}
