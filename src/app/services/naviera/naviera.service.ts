import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Naviera } from '../../models/navieras.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable()
export class NavieraService {
  // tslint:disable-next-line:no-inferrable-types
  totalNavieras: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  getNavieras(desde: number = 0): Observable<any> {
    const url = URL_SERVICIOS + '/naviera?desde=' + desde;
    return this.http.get(url);
  }

  getNavieraXID( id: string ): Observable<any> {
    const url = URL_SERVICIOS + '/naviera/' + id;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.naviera ));

  }

  borrarNaviera( id: string ): Observable<any> {

    let url = URL_SERVICIOS + '/naviera/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                .pipe(map( resp => swal('Naviera Borrado', 'Eliminado correctamente', 'success') ));

  }

  DownloadFiles() {
    //return this.http.get('../uploads/clientes/111.pdf', {responseType: 'text'});
    return this.http.get(URL_SERVICIOS+ '/uploads/clientes/111.pdf');
  }

  DownloadFile(){
console.log('hola');
    this.DownloadFiles()
        .subscribe(
            (data:any) => this.downloadFile2(data)), // console.log(data),
            (error) => console.log("Error downloading the file."),
            () => console.info("OK");
}

downloadFile2(data: any){
var blob = new Blob([data], { type: 'application/pdf' });
var url= window.URL.createObjectURL(blob);
window.open(url);
}


  guardarNaviera( naviera: Naviera ): Observable<any> {
    let url = URL_SERVICIOS + '/naviera';
    if ( naviera._id ) {// actualizando
      url += '/' + naviera._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put( url, naviera )
                .pipe(map( (resp: any) => {
                  swal('Naviera Actualizado', naviera.razonSocial, 'success');
                  return resp.naviera;
                }),
                catchError( err => {
                  swal( err.error.mensaje, err.error.errors.message, 'error' );
                  return throwError(err);
                }));
    } else {      // creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post( url, naviera )
              .pipe(map( (resp: any) => {
                swal('Naviera Creado', naviera.razonSocial, 'success');
                return resp.naviera;
              }),
              catchError( err => {
                swal( err.error.mensaje, err.error.errors.message, 'error' );
                return throwError(err);
              }));
    }
  }
  buscarNaviera( termino: string ): Observable<any> {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/busqueda/coleccion/navieras/' + termino;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.navieras ));

  }


}
