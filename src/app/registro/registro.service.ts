import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { URL_SERVICIOS } from 'src/environments/environment';
import swal from 'sweetalert';
import { map, catchError } from 'rxjs/operators';
import { Registro } from './registro.models';
import { UsuarioService } from '../services/service.index';

const HttpUploadOptions = {
  headers: new HttpHeaders({ 'Accept': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RegistroServiceService {
  token: string;

  constructor( public http: HttpClient, public _usuarioService: UsuarioService) { }


  guardarRegistro(registro: Registro): Observable<any> {
    const url = URL_SERVICIOS + '/registros/registro';
    return this.http.post(url, registro)
    .pipe(
              map((res: any) => {
              // swal('Registro Guardado', 'Pronto nos pondremos en contacto usted !!' , 'success');
              return res.registro;
          }));
  }

  envioCorreo(registro: Registro): Observable<any> {
    let params = new HttpParams();
    let url = URL_SERVICIOS + '/registros/registro';
    url += '/' + registro._id + '/enviocorreo';
    if (registro._id) {
      params = params.append('_id', registro._id);
    }
    return this.http.get(url, { params: params }).pipe (
      map((resp: any) => {
        if (resp.mensaje !== '' && resp.mensaje !== undefined && resp.mensaje.length > 0) { 
          swal('Registro Guardado', 'Se han enviado tus datos al departamento de TI, pronto nos pondremos en contacto con usted !!', 'success');
        }
        return resp.registro;
      })
    );
  }
}
