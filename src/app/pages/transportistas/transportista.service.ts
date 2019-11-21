import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Transportista } from './transportista.models';
import { Observable} from 'rxjs';
import { map} from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable()
export class TransportistaService {
  totalTransportistas: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  getTransportistas(): Observable<any> {
    const url = URL_SERVICIOS + '/transportistas';
    return this.http.get(url);
  }

  getTransportista( id: string ): Observable<any> {
    const url = URL_SERVICIOS + '/transportistas/transportista/' + id;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.transportista ));
  }

  guardarTransportista( transportista: Transportista ): Observable<any> {
    let url = URL_SERVICIOS + '/transportistas/transportista';
    if ( transportista._id ) {// actualizando
      url += '/' + transportista._id;
      url += '?token=' + this._usuarioService.token;           
      return this.http.put( url, transportista )
                .pipe(map( (resp: any) => {
                  swal('Transportista Actualizado', transportista.nombreComercial, 'success');
                  return resp.transportista;
                }));

    } else {// creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url, transportista )
              .pipe(map( (resp: any) => {
                swal('Transportista Creado', transportista.nombreComercial, 'success');
                return resp.transportista;
              }));
    }
  }

  borrarTransportista( id: string ): Observable<any> {
    let url = URL_SERVICIOS + '/transportistas/transportista/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete( url )
                .pipe(map( resp => swal('Transportista Borrado', 'Eliminado correctamente', 'success') ));
  }

}
