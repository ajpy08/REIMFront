import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UsuarioService } from '../../pages/usuarios/usuario.service';
import swal from 'sweetalert';

@Injectable()
export class TiposContenedoresService {
  constructor(
    public http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  getTiposContenedor(): Observable<any> {
    let url = URL_SERVICIOS + '/tipos_contenedores/';
    url += '?token=' + this.usuarioService.token;
    return this.http.get(url);
  }

  getTipoContenedor(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/tipos_contenedores/tipoContenedor/' + id;
    url += '?token=' + this.usuarioService.token;
        return this.http.get(url)
    .pipe(map((resp:any) => resp.tipoContenedor));
  }

  getTipoContenedorXTipo(tipo: string): Observable<any> {
    tipo = encodeURIComponent(tipo);
    let url = URL_SERVICIOS + '/tipos_contenedores/tipoCont/' + tipo;
    url += '?token=' + this.usuarioService.token;
        return this.http.get(url)
    .pipe(map((resp:any) => resp.tipo));
  }


  borrarTipoContenedor(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/tipos_contenedores/tipo_contenedor/' + id;
    url += '?token=' + this.usuarioService.token;
    return this.http.delete(url)
      .pipe(map(resp => swal('Tipo Contenedor Borrado', 'Eliminado correctamente', 'success')));
  }

  guardarContenedor(tipoContenedor): Observable<any> {
    let url = URL_SERVICIOS + '/tipos_contenedores/tipo_contenedor';
    if (tipoContenedor._id) {
      url += '/' + tipoContenedor._id;
      url += '?token=' + this.usuarioService.token;
      return this.http.put(url, tipoContenedor)
      .pipe(
        map((resp: any) =>{
          swal('Tipo Contenedor Actualizado', tipoContenedor.tipo, 'success');

          return resp.tipoConteneor;
        }));
    } else { //crear contenedor
        url += '?token=' + this.usuarioService.token;
        return this.http.post(url, tipoContenedor)
        .pipe(
          map((resp: any) => {
            swal('Tipo Contenedor Creado', tipoContenedor.tipo, 'success');
            return resp.tipoContenedor;
          }));
    }
  }
}


