import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UsuarioService } from '../service.index';
import swal from 'sweetalert';

@Injectable()
export class TipoContenedorService {
  constructor(
    public http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  getTiposContenedor(): Observable<any> {
    const url = URL_SERVICIOS + '/tipos_contenedores/';
    return this.http.get(url);
  }

  borrarTipoContenedor(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/tipos_contenedores/tipo_contenedor/' + id;
    url += '?token=' + this.usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Tipo Contenedor Borrado', 'Eliminado correctamente', 'success')));
  }
}
