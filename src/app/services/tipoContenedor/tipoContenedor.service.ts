import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Observable } from 'rxjs';

@Injectable()
export class TipoContenedorService {
  constructor(
    public http: HttpClient
  ) { }

  getTiposContenedor(): Observable<any> {
    const url = URL_SERVICIOS + '/tipos_contenedores/';
    return this.http.get(url);
  }
}
