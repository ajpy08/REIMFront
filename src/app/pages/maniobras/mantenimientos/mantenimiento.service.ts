import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../../environments/environment';
import { UsuarioService } from '../../usuarios/usuario.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { Mantenimiento } from '../mantenimientos/mantenimiento.models';

@Injectable()
export class MantenimientoService {
  
  mantenimiento: Mantenimiento;
  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
    
  ) { }


  agregarMantenimiento(mantenimiento: Mantenimiento): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url,{mantenimiento})
      .pipe(map((resp: any) => {
        swal('Mantenimiento Agregado con exito', 'success');
        return resp;
      }));
  }

  modificaMantenimiento(mantenimiento: Mantenimiento): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + mantenimiento._id ;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url,{mantenimiento})
      .pipe(map((resp: any) => {
        swal('Manteniminento Editado con exito', 'success');
        return resp;
      }));
  }

  eliminaMantenimiento(idMantenimiento: string): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimientos/' + idMantenimiento;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, '')
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

  getMantenimiento(idMantenimiento: string): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + idMantenimiento
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

}
