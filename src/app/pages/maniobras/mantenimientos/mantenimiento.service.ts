import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../../environments/environment';
import { UsuarioService } from '../../usuarios/usuario.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { FileItem } from '../../../models/file-item.models';
import { Mantenimiento } from './mantenimiento.models';
import { ok } from 'assert';


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

      return this.http.put(url, { mantenimiento }).pipe(
        map((resp: any) => {
          swal('Mantenimiento Actualizado', mantenimiento.tipoMantenimiento, 'success');
          return resp;
        })
      );
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, { mantenimiento }).pipe(
        map((resp: any) => {
          swal('Mantenimiento Creado', mantenimiento.tipoMantenimiento, 'success');
          return resp;
        })
      );
    }
  }

subirPDFFolio(idMantenimiento:string,archivo: File): Observable<any> {
    if (!archivo) {
    return;
  }
  const formData = new FormData();
  formData.append('file', archivo, archivo.name);
  const url = URL_SERVICIOS + '/mantenimientos/mantenimiento/'+idMantenimiento+"/adjunta_pdf_folio"+"?token="+this._usuarioService.token;

  return this.http.put( url, formData )
  .pipe(map( (resp: any) => {
    swal('Archivo Cargado', resp.nombreArchivo, 'success');
    return resp.nombreArchivo;
  }));
}

  finalizaMantenimiento(idMantenimiento: string, finaliza: boolean): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + idMantenimiento + '/finaliza';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, { finalizado: finaliza })
      .pipe(map((res: any) => {
        swal('Cambio de estado del Mantenimiento realizado con éxito', res.mensaje, 'success');
        return res;
      }));
  }

  getMaterialesxManiobra(idManiobra: string): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/'+idManiobra+'/materiales';
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  guardaMaterial(idMantenimiento: string, material: any): Observable<any> {
    if (material._id === "") {
      let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + idMantenimiento + "/addMaterial/" + material.material;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url,{material}).pipe(
        map((resp: any) => {
          swal('Material Agregado con exito', "", 'success');
          return resp.mantenimiento;
        })
      );
    }
    else {
      let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + idMantenimiento + "/editMaterial/" + material.material;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, { material }).pipe(
        map((resp: any) => {
          swal('Material Editado con exito', "", 'success');
          return resp.mantenimiento;
        })
      );
    }
  }

  eliminaMaterial(idMantenimiento: string, idMaterial: string): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + idMantenimiento + "/removeMaterial/" + idMaterial;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        swal('Material Eliminado', 'success');
        return resp;
      }));
  }


  eliminaMantenimiento(idMantenimiento: string): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + idMantenimiento;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
      .pipe(map((resp: any) => {
        swal('Mantenimiento Eliminado', 'success');
        return resp;
      }));
  }



  getMantenimientosxManiobra(idManiobra: string): Observable<any> {
    return this.getMantenimientos('', idManiobra);
  }

  async getMantenimientosxManiobraAsync(idManiobra: string) {
    let url = URL_SERVICIOS + '/mantenimientos/';
    url += '?token=' + this._usuarioService.token;
    let params = new HttpParams();
    if (idManiobra) params = params.append('maniobra', idManiobra);
    
    return await this.http.get(url, { params: params }).toPromise();
  }

  getMantenimientosxTipo(tipoMantenimiento: string, finalizados: string, fInicial?: any, fFinal?: any): Observable<any> {
    return (this.getMantenimientos(tipoMantenimiento, '', finalizados, fInicial, fFinal));
  }

  getMantenimientos(tipoMantenimiento?: string, idManiobra?: string, finalizado?: string, fInicial?: any, fFinal?: any, material?: string): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/';
    url += '?token=' + this._usuarioService.token;
    let params = new HttpParams();

    if (tipoMantenimiento) params = params.append('tipoMantenimiento', tipoMantenimiento);
    if (idManiobra) params = params.append('maniobra', idManiobra);
    if (finalizado) params = params.append('finalizado', finalizado);
    if (fInicial) params = params.append('fInicial', fInicial.toString());
    if (fFinal) params = params.append('fFinal', fFinal.toString());
    if (material) params = params.append('idMaterial', material.toString());
    
    return this.http.get(url, { params: params });
  }

  getMantenimientosConMaterial(tipoMantenimiento?: string, idManiobra?: string, finalizado?: string, fInicial?: any, fFinal?: any, material?: string, fAltaInicial?: any, fAltaFinal?: any): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/' + material + '/con-material/';
    url += '?token=' + this._usuarioService.token;
    let params = new HttpParams();

    if (tipoMantenimiento) params = params.append('tipoMantenimiento', tipoMantenimiento);
    if (idManiobra) params = params.append('maniobra', idManiobra);
    if (finalizado) params = params.append('finalizado', finalizado);
    if (fInicial) params = params.append('fInicial', fInicial.toString());
    if (fFinal) params = params.append('fFinal', fFinal.toString());
    if (fAltaInicial) params = params.append('fAltaInicial', fAltaInicial.toString());
    if (fAltaFinal) params = params.append('fAltaFinal', fAltaFinal.toString());
    if (material) params = params.append('idMaterial', material.toString());
    
    return this.http.get(url, { params: params });
  }


  getMantenimiento(idMantenimiento: string): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + idMantenimiento
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  getFotos(id: string, a_d: string): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + id + '/fotos/' + a_d + '/';
    url += '?token=' + this._usuarioService.token;
    return this.http.get(url);
  }

  getFotosAntes(id: string): Observable<any> {
    return this.getFotos(id, 'ANTES');
  }
  getFotosDespues(id: string): Observable<any> {
    return this.getFotos(id, 'DESPUES');
  }

  subirFotos(imagenes: FileItem[], tipo: string, id: string) {
    return new Promise((resolve, reject) => {
      let j = 0;
      for (const item of imagenes) {
        const formData = new FormData();
        formData.append('file', item.archivo, item.nombreArchivo);
        const url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + id + '/upfoto/' + tipo + '/?token=' + this._usuarioService.token;

        this.http.put(url, formData, { reportProgress: true, observe: 'events' })
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              item.progreso = Math.round((event.loaded / event.total * 100) - 20);
            } else if (event.type === HttpEventType.Response) {
              j++;
              item.progreso = 100;
              if (j >= imagenes.length) {
                resolve(true);
              }
            }
          });
      }
    });
  }

  eliminaFoto(id: string, AD: string, nameimg: string) {
    return new Promise((resolve, reject) => {
      const url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + id + '/eliminaFoto/' + AD + '/' + nameimg + '/?token=' + this._usuarioService.token;
      this.http.get(url).subscribe(event => {
        resolve(true);
        // if (event.type === HttpEventType.Response) {
        //   resolve(true);
        // }
      });
    });
  }

  getFotosZip(idMantenimiento: string, AD: string): Observable<any> {
    let url = URL_SERVICIOS + '/mantenimientos/mantenimiento/' + idMantenimiento + '/getfotoszip/' + AD;
    window.open(url);
    return this.http.get(url, { responseType: 'blob' });
  }

}
