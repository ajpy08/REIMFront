import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { URL_SERVICIOS } from 'src/environments/environment';
import swal from 'sweetalert';
import { map } from 'rxjs/operators';
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
    let url = URL_SERVICIOS + '/registros/registro';
    return this.http.post(url, registro)
    .pipe(
      map((resp: any) => {
        swal('Registro Guardado', 'Pronto nos pondremos en contacto contigo !!' ,'success');
        return resp.registro;
      })
    );
  }
}
