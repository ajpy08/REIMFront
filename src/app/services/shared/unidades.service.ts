import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../../pages/usuarios/usuario.service';
import { Unidad } from '../../models/unidad.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
declare var swal: any;


@Injectable()
export class UnidadService {

  totalUnidades = 0;

  constructor(
    public http: HttpClient,
    public router: Router,
    public usuarioService: UsuarioService
  ) { }

  getUnidades(): Observable<any> {
    let url = URL_SERVICIOS + '/unidades/';
    url += '?token=' + this.usuarioService.token;
    return this.http.get(url);
  }
}
