import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class TipoContenedorService {
  constructor(
    public http: HttpClient
  ) { }

  getTiposContenedor(): Observable<any> {
    const url = URL_SERVICIOS + '/tipos_contenedores/';
    return this.http.get(url);
  }

  getTipoContenedor(tipo: string): Observable<any> {
    const url = URL_SERVICIOS + '/tipos_contenedores/tipoCont/' + tipo;
    return this.http.get(url).pipe(map((resp: any) => resp.tipo));;
  }
}
