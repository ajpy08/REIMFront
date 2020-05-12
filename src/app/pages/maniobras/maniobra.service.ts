import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { UsuarioService } from '../usuarios/usuario.service';
import { Maniobra } from '../../models/maniobra.models';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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

  getManiobra(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/maniobra/' + id;
    return this.http.get(url);
  }

  getManiobraConIncludes(id: string): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/maniobra/' + id + '/includes';
    return this.http.get(url);
  }

  getManiobras(cargadescarga?: string, estatus?: string, transportista?: string, contenedor?: string, viaje?: string, peso?: string,
    lavado?: boolean, reparacion?: boolean, naviera?: string, buque?: string, fIniLlegada?: string, fFinLlegada?: string, cliente?: string): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/';
    let params = new HttpParams();
    if (cargadescarga) {
      params = params.append('cargadescarga', cargadescarga);
    }
    if (estatus) {
      params = params.append('estatus', estatus);
    }
    if (transportista) {
      params = params.append('transportista', transportista);
    }
    if (contenedor) {
      params = params.append('contenedor', contenedor);
    }
    if (buque) {
      params = params.append('buque', buque);
    }
    if (viaje) {
      params = params.append('viaje', viaje);
    }
    if (peso) {
      params = params.append('peso', peso);
    }
    if (lavado) {
      params = params.append('lavado', 'true');
    }
    if (reparacion) {
      params = params.append('reparacion', 'true');
    }
    if (naviera) {
      params = params.append('naviera', naviera);
    }
    if (cliente) {
      params = params.append('cliente', cliente);
    }
    if (fIniLlegada && fFinLlegada) {
      params = params.append('finillegada', fIniLlegada);
      params = params.append('ffinllegada', fFinLlegada);
    }
    return this.http.get(url, { params: params });
  }

  /* #region  REPORTES */
  getReporte(fIniLlegada?: string, fFinLlegada?: string, tipo?: string): Observable<any> {
    const url = URL_SERVICIOS + '/reportes/lavado/';
    let params = new HttpParams();
    if (tipo) {
      params = params.append('tipo', tipo);
    }
    if (fIniLlegada && fFinLlegada) {
      params = params.append('finillegada', fIniLlegada);
      params = params.append('ffinllegada', fFinLlegada);
    }

    return this.http.get(url, { params: params });

  }
  getReporteR(fIniLlegada?: string, fFinLlegada?: string, tipo?: string): Observable<any> {
    const url = URL_SERVICIOS + '/reportes/reparacion/';
    let params = new HttpParams();
    if (tipo) {
      params = params.append('tipo', tipo);
    }
    if (fIniLlegada && fFinLlegada) {
      params = params.append('finillegada', fIniLlegada);
      params = params.append('ffinllegada', fFinLlegada);
    }

    return this.http.get(url, { params: params });

  }

  getXLAvar(): Observable<any> {
    const url = URL_SERVICIOS + '/reportes/';
    return this.http.get(url);
  }

  getXReparar(): Observable<any> {
    const url = URL_SERVICIOS + '/reportes/reparacionesPen/';
    return this.http.get(url);
  }

  /* #endregion */

  getManiobrasNaviera(
    estatus?: string,
    naviera?: string,
    transportista?: string,
    contenedor?: string,
    viaje?: string,
    peso?: string,
    lavado?: boolean,
    reparacion?: boolean
  ): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/inventarioLR/';
    let params = new HttpParams();
    if (naviera) {
      params = params.append('naviera', naviera);
    }
    if (estatus) {
      params = params.append('estatus', estatus);
    }
    if (transportista) {
      params = params.append('transportista', transportista);
    }
    if (contenedor) {
      params = params.append('contenedor', contenedor);
    }
    if (viaje) {
      params = params.append('viaje', viaje);
    }
    if (peso) {
      params = params.append('peso', peso);
    }
    if (lavado) {
      params = params.append('lavado', 'true');
    }

    if (reparacion) {
      params = params.append('reparacion', 'true');
    }

    return this.http.get(url, { params: params });
  }

  // Vacios
  getManiobrasVacios(
    cargadescarga?: string,
    viaje?: string,
    peso?: string,
    lavado?: boolean,
    reparacion?: boolean,
    sinFactura?: boolean,
    descargados?: boolean,
    yaLavados?: boolean
  ): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/facturacion-vacios';
    let params = new HttpParams();
    if (cargadescarga) {
      params = params.append('cargadescarga', cargadescarga);
    }

    if (viaje) {
      params = params.append('viaje', viaje);
    }

    if (peso) {
      params = params.append('peso', peso);
    }

    if (lavado) {
      params = params.append('lavado', lavado.toString());
    }

    if (reparacion) {
      params = params.append(
        'reparacion',
        reparacion === true ? 'true' : 'false'
      );
    }

    if (sinFactura) {
      params = params.append('sinFactura', sinFactura.toString());
    }

    if (descargados) {
      params = params.append('descargados', descargados.toString());
    }

    if (yaLavados) {
      params = params.append('yaLavados', yaLavados.toString());
    }

    return this.http.get(url, { params: params });
  }

  // Excepto Vacios
  getOtrasManiobras(
    cargadescarga?: string,
    viaje?: string,
    peso?: string,
    lavado?: boolean,
    reparacion?: boolean,
    sinFactura?: boolean,
    descargados?: boolean,
    yaLavados?: boolean
  ): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/facturacion-maniobras';
    let params = new HttpParams();
    if (cargadescarga) {
      params = params.append('cargadescarga', cargadescarga);
    }

    if (viaje) {
      params = params.append('viaje', viaje);
    }

    if (peso) {
      params = params.append('peso', peso);
    }

    if (lavado) {
      params = params.append('lavado', lavado.toString());
    }

    if (reparacion) {
      params = params.append(
        'reparacion',
        reparacion === true ? 'true' : 'false'
      );
    }

    if (sinFactura) {
      params = params.append('sinFactura', sinFactura.toString());
    }

    if (descargados) {
      params = params.append('descargados', descargados.toString());
    }

    if (yaLavados) {
      params = params.append('yaLavados', yaLavados.toString());
    }

    return this.http.get(url, { params: params });
  }

  getManiobraXContenedorViajeBuque(
    contenedor: string,
    viaje: string,
    buque: string
  ): Observable<any> {
    const url =
      URL_SERVICIOS +
      '/maniobras/buscaxcontenedorviaje?contenedor=' +
      contenedor +
      '&viaje=' +
      viaje +
      '&buque=' +
      buque;
    return this.http.get(url).pipe(map((resp: any) => resp.maniobra));
  }

  getManiobrasXViajeImportacion(viaje: string): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/xviaje/' + viaje + '/importacion';
    return this.http.get(url).pipe(map((resp: any) => resp.maniobras));
  }

  getContenedoresDisponibles(): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/contenedores/disponibles/';
    return this.http.get(url);
  }

  getManiobrasxCargar(): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/xcargar/';
    return this.http.get(url);
  }

  getManiobrasLavadoOReparacion(
    naviera: string,
    buque: string,
    viaje: string,
    fechaLlegadaInicio: string,
    fechaLlegadaFin: string,
    LR: string
  ): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras/Lavado/Reparacion/';
    let params = new HttpParams();
    if (naviera) {
      params = params.append('naviera', naviera);
    }
    if (buque) {
      params = params.append('buque', buque);
    }
    if (viaje) {
      params = params.append('viaje', viaje);
    }
    if (fechaLlegadaInicio) {
      params = params.append('fechaLlegadaInicio', fechaLlegadaInicio);
    }
    if (fechaLlegadaFin) {
      params = params.append('fechaLlegadaFin', fechaLlegadaFin);
    }
    if (LR) {
      params = params.append('LR', LR);
    }
    return this.http.get(url, { params: params });
  }

  asignaSolicitud(maniobra: Maniobra): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/asigna_solicitud';
    url += '/' + maniobra._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, maniobra).pipe(
      map((resp: any) => {
        swal('Maniobra actualizada', '', 'success');
        return resp.maniobra;
      })
    );
  }

  asignaCamionOperador(maniobra: Maniobra): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/asigna_camion_operador';
    url += '/' + maniobra._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, maniobra).pipe(
      map((resp: any) => {
        swal('Camion y Chofer actualizados.', '', 'success');
        return resp.maniobra;
      })
    );
  }

  reasignaTransportista(maniobra: Maniobra): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/reasigna_transportista';
    url += '/' + maniobra._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, maniobra).pipe(
      map((resp: any) => {
        swal('Transportista Reasignado', '', 'success');
        return resp.maniobra;
      })
    );
  }

  registraLlegadaEntrada(maniobra: Maniobra): Observable<any> {
    let url =
      URL_SERVICIOS +
      '/maniobras/maniobra/' +
      maniobra._id +
      '/registra_llegada';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, maniobra).pipe(
      map((resp: any) => {
        swal('La llegada de la maniobra ha sido registrada', '', 'success');
        return resp.maniobra;
      })
    );
  }

  registraLavRepDescarga(maniobra: Maniobra): Observable<any> {
    let url =
      URL_SERVICIOS +
      '/maniobras/maniobra/' +
      maniobra._id +
      '/registra_descarga';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, maniobra).pipe(
      map((resp: any) => {
        swal('Maniobra actualizada', '', 'success');
        return resp.maniobra;
      })
    );
  }

  registraFinLavRep(maniobra: Maniobra): Observable<any> {
    let url =
      URL_SERVICIOS +
      '/maniobras/maniobra/' +
      maniobra._id +
      '/registra_fin_lav_rep';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, maniobra).pipe(
      map((resp: any) => {
        swal('Datos actualizados con éxito', '', 'success');
        return resp.maniobra;
      })
    );
  }

  registraCargaContenedor(maniobra: Maniobra): Observable<any> {
    let url =
      URL_SERVICIOS +
      '/maniobras/maniobra/' +
      maniobra._id +
      '/carga_contenedor';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, maniobra).pipe(
      map((resp: any) => {
        swal('Maniobra actualizada', '', 'success');
        return resp.maniobra;
      })
    );
  }

  corrigeContenedor(maniobra: Maniobra): Observable<any> {
    const url = URL_SERVICIOS + '/maniobra/' + maniobra._id + '/corrige_contenedor';
    return this.http.put(url, maniobra).pipe(
      map((resp: any) => {
        swal('Datos actualizados con éxito', '', 'success');
        return resp.maniobra;
      })
    );
  }

  cargarManiobras(desde: number = 0): Observable<any> {
    const url = URL_SERVICIOS + '/maniobras?desde=' + desde;
    return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalManiobras = resp.total;
        return resp.maniobras;
      })
    );
  }

  borrarManiobra(id: string): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http
      .delete(url)
      .pipe(
        map(resp =>
          swal('Maniobra Borrado', 'Eliminado correctamente', 'success')
        )
      );
  }

  guardarManiobra(maniobra: Maniobra): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra';
    if (maniobra._id) {
      // actualizando
      url += '/' + maniobra._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put(url, maniobra).pipe(
        map((resp: any) => {
          swal('Maniobra Actualizado', 'test', 'success');
          return resp.maniobra;
        }),
        catchError(err => {
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        })
      );
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, maniobra).pipe(
        map((resp: any) => {
          swal('Contenedor Creado', 'test', 'success');
          return resp.maniobra;
        }),
        catchError(err => {
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        })
      );
    }
  }

  buscarManiobraFecha(fechaIncio: string, fechaFin: string): Observable<any> {
    const url = URL_SERVICIOS + '/maniobra/rangofecha?fechaInicio=' + fechaIncio + '&fechaFin=' + fechaFin;
    return this.http.get(url).pipe(map((resp: any) => resp.maniobras));
  }

  removerFotosLavados(id: string, foto: string): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/removeimgl/' + id + '&' + foto;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, foto).pipe(
      map((resp: any) => {
        swal(
          'Foto borrada',
          'La foto a sido eliminada correctamente',
          'success'
        );
        return resp.maniobra;
      }),
      catchError(err => {
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return throwError(err);
      })
    );
  }

  removerFotosReparados(id: string, foto: string): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/removeimgr/' + id + '&' + foto;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, foto).pipe(
      map((resp: any) => {
        swal(
          'Foto borrado',
          'La foto a sido eliminada correctamente',
          'success'
        );
        return resp.maniobra;
      }),
      catchError(err => {
        swal(err.error.mensaje, err.error.errors.message, 'error');
        return throwError(err);
      })
    );
  }

  asignaFacturaManiobra(id: string, factura: string): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/asigna_factura';
    url += '/' + id;
    url += '&' + factura;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, id).pipe(
      map((resp: any) => {
        swal(
          'Factura ' + factura + ' asignada a ' + resp.maniobra.contenedor,
          '',
          'success'
        );
        return resp.viaje;
      })
    );
  }

  getFotos(id: string, lavado_reparacion: string): Observable<any> {
    const url =
      URL_SERVICIOS +
      '/documentos/maniobra/' +
      id +
      '/listaImagenes/' +
      lavado_reparacion +
      '/';
    return this.http.get(url);
  }

  eliminaFoto(key: string) {
    return new Promise((resolve, reject) => {
      const url = URL_SERVICIOS + '/documentos/maniobra/eliminaFoto?key=' + key;
      this.http.get(url).subscribe(event => {
        resolve(true);
        // if (event.type === HttpEventType.Response) {
        //   resolve(true);
        // }
      });
    });
  }

  asignaFecha(maniobra: Maniobra): Observable<any> {
    let url = URL_SERVICIOS + '/maniobra/actualiza_fecha_asignacion';
    url += '/' + maniobra._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, maniobra);
  }

  habilitaDeshabilitaMostrarFotosReparacion(
    maniobra: Maniobra,
    mostrarFotosReparacion: boolean,
    tipo: string
  ): Observable<any> {
    let url =
      URL_SERVICIOS +
      '/maniobra/' +
      maniobra._id +
      '/habilita_deshabilita_mostrarFotosReparacion';
    url += '?token=' + this._usuarioService.token;
    if (tipo === 'Naviera') {
      return this.http
        .put(url, { mostrarFotosRNaviera: mostrarFotosReparacion, tipo: tipo })
        .pipe(
          map((resp: any) => {
            swal(
              'Cambio mostrar a Fotos de Maniobra' + tipo + ' con éxito',
              resp.maniobra.contenedor,
              'success'
            );
            return true;
          })
        );
    } else if (tipo === 'AA') {
      return this.http
        .put(url, { mostrarFotosRAA: mostrarFotosReparacion, tipo: tipo })
        .pipe(
          map((resp: any) => {
            swal(
              'Cambio mostrar a Fotos de Maniobra' + tipo + ' con éxito',
              resp.maniobra.contenedor,
              'success'
            );
            return true;
          })
        );
    } else {
    }
  }

  habilitaDeshabilitaDescargaAutorizada(maniobra: Maniobra, aprueba: boolean) {
    let url =
      URL_SERVICIOS +
      '/maniobras/maniobra/' +
      maniobra._id +
      '/aprueba_descarga';
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, { descargaAutorizada: aprueba }).pipe(
      map((resp: any) => {
        swal(
          'Estado del permiso de Descarga Aprobada cambiado con éxito',
          '',
          'success'
        );
        return true;
      })
    );
  }

  actualizaDetalleManiobra(maniobra: Maniobra) {
    let url = URL_SERVICIOS + '/maniobra/' + maniobra._id;
    url += '?token=' + this._usuarioService.token;
    return this.http.put(url, maniobra).pipe(
      map((resp: any) => {
        swal('Maniobra Actualizada', '', 'success');
        return true;
      })
    );
  }

  enviaCorreo(maniobra: Maniobra): Observable<any> {
    let params = new HttpParams();
    let url = URL_SERVICIOS + '/maniobras/maniobra';
    url += '/' + maniobra._id + '/enviacorreo';
    if (maniobra._id) {
      params = params.append('_id', maniobra._id);
    }

    return this.http.get(url, { params: params }).pipe(
      map((resp: any) => {
        if (
          resp.mensaje !== '' &&
          resp.mensaje !== undefined &&
          resp.mensaje.length > 0
        ) {
          swal('ALERTA', resp.mensaje, 'success');
        } else {
          swal('Correo Enviado', '', 'success');
        }
        return resp.solicitud;
      })
    );
  }

  DescargaZip(id: string, LR: string): Observable<any> {
    let url = URL_SERVICIOS + '/documentos/maniobra/' + id;
    url += '/zipLR/' + LR;
    window.open(url);
    return this.http.get(url, { responseType: 'blob' });
  }
}
