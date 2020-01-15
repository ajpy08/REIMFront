import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuarios/usuario.service';
import { Coordenada } from 'src/app/models/coordenada.models';
import swal from 'sweetalert';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' 
})
export class CoordenadaService {

  constructor(private http: HttpClient,
    private usuarioService: UsuarioService) { }

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
  bahia_posicion
  getCoordenadasDisponibles(): Observable<any> {
    const url = URL_SERVICIOS + '/coordenadas/disponibles';       
    return this.http.get(url);
  }

  getCoordenada(bahia?: string, posicion?: string): Observable<any> {
    const url = URL_SERVICIOS + '/coordenadas/coordenada/bahia_posicion';
    let params = new HttpParams();
    if (bahia) {
      params = params.append('bahia', bahia);
    }
    
    if (posicion) {
      params = params.append('posicion', posicion.toString());
    }
    
    return this.http.get(url, { params: params })
    .pipe(map( (resp: any) => resp.coordenada ));
  }

  // getCoordenada(bahia?: string, posicion?: string): Observable<any> {
  //   const url = URL_SERVICIOS + '/coordenadas/coordenada/bahia_posicion';       
  //   let params = new HttpParams();
  //   if (bahia) {
  //     params = params.append('bahia', bahia);
  //   }
    
  //   if (posicion) {
  //     params = params.append('posicion', posicion.toString());
  //   }
    
  //   return this.http.get(url, { params: params });
  // }

  actualizaCoordenadaManiobras(coordenada: Coordenada): Observable<any> {
    let url = URL_SERVICIOS + '/coordenadas/coordenada/' + coordenada._id + '/actualiza_maniobra';
    url += '?token=' + this.usuarioService.token;
    return this.http.put(url, coordenada)
      .pipe(map((resp: any) => {
        swal('Coordenada actualizada', '', 'success');
        return resp.coordenada;
      }));
  }
}
