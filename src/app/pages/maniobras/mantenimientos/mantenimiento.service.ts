import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../../environments/environment';
import { UsuarioService } from '../../usuarios/usuario.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';

import { Mantenimiento } from './mantenimiento.models';

@Injectable()
export class MantenimientoService {
  
  mantenimiento: Mantenimiento;
  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
    
  ) { }


  guardarMantenimiento(mantenimiento: Mantenimiento): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimiento';
    if (mantenimiento._id) {
      // actualizando
      url += '/' + mantenimiento._id;
      url += '?token=' + this._usuarioService.token;
      
      return this.http.put(url, {mantenimiento}).pipe(
        map((resp: any) => {
          swal('Mantenimiento Actualizado', mantenimiento.tipoMantenimiento, 'success');
          return resp.mantenimiento;
        })
      );
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url,{mantenimiento}).pipe(
        map((resp: any) => {
          swal('Mantenimiento Creado', mantenimiento.tipoMantenimiento, 'success');
          return resp.mantenimiento;
        })
      );
    }
  }

  eliminaMantenimiento(idMantenimiento: string): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + idMantenimiento;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url )
      .pipe(map((resp: any) => {
        swal('Mantenimiento Eliminado', 'success');
        return resp;
      }));
  }

  getMantenimientos(idManiobra: string): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/xmaniobra/' + idManiobra;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }
  
  getMantenimientosxTipo(tipo: string): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/xtipo/' + tipo;
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  getMantenimiento(idMantenimiento: string): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + idMantenimiento
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

}
