import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class CoordenadaService {

  constructor(private http: HttpClient,) { }

  getCoordenadas(bahia?: string, tipo?: string, activo?: boolean, conManiobra?: boolean): Observable<any> {
    const url = URL_SERVICIOS + '/coordenadas/';
    let params = new HttpParams();
    if (bahia) {
      params = params.append('bahia', bahia);
    }
    if (tipo) {
      params = params.append('tipo', tipo);
    }
    if (activo) {
      params = params.append('activo', activo.toString());
    }
    if (conManiobra) {
      params = params.append('conManiobra', conManiobra.toString());
    }
    
    return this.http.get(url, { params: params });
  }

  getCoordenadasSinManiobra(): Observable<any> {
    const url = URL_SERVICIOS + '/coordenadas/sin_maniobra';       
    return this.http.get(url);
  }
}
