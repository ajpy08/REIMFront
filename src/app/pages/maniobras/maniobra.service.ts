import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Maniobra } from './maniobra.models';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import swal from 'sweetalert';
import { FileItem } from '../../models/file-item.models';

@Injectable()
export class ManiobraService {

  totalManiobras = 0;
  maniobra: Maniobra;
  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService,
    public _subirArchivoService: SubirArchivoService
  ) { }

  getManiobra( id: string ): Observable<any> {
    const url = URL_SERVICIOS + '/maniobra/' + id;
    return this.http.get( url );
  }

  getManiobraConIncludes( id: string ): Observable<any> {
    const url = URL_SERVICIOS + '/maniobra/' + id + '/includes';
    return this.http.get( url );
  }

  getManiobraXContenedorViajeBuque(contenedor: string, viaje: string, buque: string): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/buscaxcontenedorviaje?contenedor=' + contenedor + '&viaje=' + viaje + '&buque=' + buque;
    return this.http.get(url).pipe(map((resp: any) => resp.maniobra));
  }

  getManiobrasTransito(desde: number = 0, contenedor?: string ): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/transito/?desde=' + desde ;
    return this.http.get( url );
  }

  getContenedoresDisponibles( ): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/contenedores/disponibles/';
    return this.http.get( url );
  }

  getManiobrasEnEspera(desde: number = 0, contenedor?: string ): Observable<any> {
    // if (contenedor===undefined)  contenedor="";
    // const url = URL_SERVICIOS + '/maniobra/transito?contenedor=' + contenedor;
    const url = URL_SERVICIOS + '/maniobras/espera/?desde=' + desde ;
    return this.http.get( url );
  }
  getManiobrasRevision(desde: number = 0, contenedor?: string ): Observable<any> {
    // if (contenedor===undefined)  contenedor="";
    // const url = URL_SERVICIOS + '/maniobra/transito?contenedor=' + contenedor;
    const url = URL_SERVICIOS + '/maniobras/revision/?desde=' + desde ;
    return this.http.get( url );
  }

  getManiobrasxCargar(): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/xcargar/';
    return this.http.get( url );
  }

  getManiobrasVacio(viaje?: string, estado?: string ): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/vacio/?viaje=' + viaje + '/?estado=' + estado ;
    return this.http.get( url );
  }

  getManiobrasLavadoReparacion(desde: number = 0, contenedor?: string ): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/lavado_reparacion/';
    return this.http.get( url );
  }


  registraLlegadaEntrada( maniobra: Maniobra ): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/registra_llegada';
    url += '/' + maniobra._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put( url, maniobra )
    .pipe(map( (resp: any) => {
      swal('Maniobra actualizada', '', 'success');
      return resp.viaje;
    }),
    catchError( err => {
      swal( err.error.mensaje, err.error.errores.message, 'error' );
      return throwError(err);
    }));
  }

  registraLavRepDescarga( maniobra: Maniobra ): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/registra_descarga';
    url += '/' + maniobra._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put( url, maniobra )
    .pipe(map( (resp: any) => {
      swal('Maniobra actualizada', '', 'success');
      return resp.viaje;
    }),
    catchError( err => {
      swal( err.error.mensaje, err.error.errores.message, 'error' );
      return throwError(err);
    }));
  }

  registraFinLavRep( maniobra: Maniobra ): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/registra_fin_lav_rep';
    url += '/' + maniobra._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put( url, maniobra )
    .pipe(map( (resp: any) => {
      swal('Maniobra actualizada', '', 'success');
      return resp.viaje;
    }),
    catchError( err => {
      swal( err.error.mensaje, err.error.errores.message, 'error' );
      return throwError(err);
    }));
  }

  registraCargaContenedor( maniobra: Maniobra ): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/registra_carga';
    url += '/' + maniobra._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put( url, maniobra )
    .pipe(map( (resp: any) => {
      swal('Maniobra actualizada', '', 'success');
      return resp.viaje;
    }),
    catchError( err => {
      swal( err.error.mensaje, err.error.errores.message, 'error' );
      return throwError(err);
    }));
  }


  cargarManiobras(desde: number = 0): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/maniobras?desde=' + desde;
    return this.http.get( url )
    .pipe(map( (resp: any) => {

      this.totalManiobras = resp.total;
      console.log(resp.maniobras);
    return resp.maniobras;
    }));
  }



  borrarManiobra( id: string ): Observable<any> {

    let url = URL_SERVICIOS + '/maniobra/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                .pipe(map( resp => swal('Maniobra Borrado', 'Eliminado correctamente', 'success') ));

  }

  guardarManiobra( maniobra: Maniobra ): Observable<any> {

    let url = URL_SERVICIOS + '/maniobra';

    if ( maniobra._id ) {
      // actualizando
      url += '/' + maniobra._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, maniobra )
                .pipe(map( (resp: any) => {
                  swal('Maniobra Actualizado', 'test', 'success');
                  return resp.maniobra;
                }),
                catchError( err => {
                  swal( err.error.mensaje, err.error.errors.message, 'error' );
                  return throwError(err);
                }));

    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url, maniobra )
              .pipe(map( (resp: any) => {
                swal('Contenedor Creado', 'test', 'success');
                return resp.maniobra;
              }),
              catchError( err => {
                swal( err.error.mensaje, err.error.errors.message, 'error' );
                return throwError(err);
              }));
    }

  }
  buscarManiobra( termino: string ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/busqueda/coleccion/maniobras/' + termino;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.maniobras ));

  }

  buscarManiobraTransito( termino: string ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/busqueda/coleccion/maniobrasTransito/' + termino;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.maniobras ));

  }

  buscarManiobraFecha( fechaIncio: string, fechaFin: string ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/maniobra/rangofecha?fechaInicio=' + fechaIncio + '&fechaFin=' + fechaFin;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.maniobras ));

  }

  removerFotosLavados(id: string, foto: string ): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/removeimgl/' + id + '&' + foto;
    url += '?token=' + this._usuarioService.token;
        return this.http.put( url, foto )
                  .pipe(map( (resp: any) => {
                    swal('Foto borrada', 'La foto a sido eliminada correctamente', 'success');
                    console.log(resp.maniobra);
                    return resp.maniobra;

                  }),
                  catchError( err => {
                    swal( err.error.mensaje, err.error.errors.message, 'error' );
                    return throwError(err);
                  }));

  }

  removerFotosReparados(id: string, foto: string ): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/removeimgr/' + id + '&' + foto;
    url += '?token=' + this._usuarioService.token;
        return this.http.put( url, foto )
                  .pipe(map( (resp: any) => {
                    swal('Foto borrado', 'La foto a sido eliminada correctamente', 'success');
                    console.log(resp.maniobra);
                    return resp.maniobra;

                  }),
                  catchError( err => {
                    swal( err.error.mensaje, err.error.errors.message, 'error' );
                    return throwError(err);
                  }));

  }


}
