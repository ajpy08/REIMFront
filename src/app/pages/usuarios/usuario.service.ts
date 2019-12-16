import { throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Usuario } from '../usuarios/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../environments/environment';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';
import swal from 'sweetalert';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class UsuarioService {
  usuario: Usuario;
  token: string;
  menu: any[] = [];
  messages: string[] = [];


  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }
  public getToken(): string {
    return localStorage.getItem('token');
  }
  renuevaToken(): Observable<any> {
    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token;
    return this.http.get(url)
      .pipe(
        map((resp: any) => {
          this.token = resp.token;
          localStorage.setItem('token', this.token);
          console.log('Token renovado');
          return true;
        }),
        catchError(err => {
          this.router.navigate(['/login']);
          swal('No se pudo renovar token', 'No fue posible renovar token', 'error');
          return throwError(err);
        }));


  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;

  }
  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }
  guardarStorage(id: string, token: string, usuario: Usuario, menu: any, urlWithoutLogin: string) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));
    localStorage.setItem('urlMain', urlWithoutLogin);

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('id'); //Lo elimine no se si sirve para algo.
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    localStorage.removeItem('history');
    localStorage.removeItem('historyArray');
    localStorage.removeItem('AprobSolicitudes');
    localStorage.removeItem('ManiobrasTabs');
    localStorage.removeItem('InventarioTabs');
    localStorage.removeItem('AprobacionTabs');
    localStorage.removeItem('TrasportistaTabs');
    localStorage.removeItem('FacturacionTabs');
    localStorage.removeItem('VacioTabs');
    localStorage.removeItem('L/R');

    localStorage.removeItem('urlMain');

    this.router.navigate(['/login']);
  }

  login(usuario: Usuario, recordar: boolean = false, urlWithoutLogin: string): Observable<any> {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    if (urlWithoutLogin === undefined) {
      urlWithoutLogin = '/dashboard'
    }
    let url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario)
      .pipe(
        map((resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu, urlWithoutLogin);
          return true;
        }));

  }



  // OBTIENE EL CATALOGO DE USUARIOS
  // POR MEDIO DEL SERVICIO http://xxx.xxx.xxx.xxx:xxx/usuarios

  getUsuarios(): Observable<any> {
    const url = URL_SERVICIOS + '/usuarios';
    return this.http.get(url);
  }


  // OBTIENE UN USUARIO DADO SU ID
  // POR MEDIO DEL SERVICIO http://xxx.xxx.xxx.xxx:xxx/usuarios/id
  // id = Identificador unico de usuario
  getUsuario( id: string ): Observable<any> {
    const url = URL_SERVICIOS + '/usuarios/usuario/' + id;
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.usuario ));
  }

  getUsuarioConIncludes( id: string ): Observable<any> {
    const url = URL_SERVICIOS + '/usuarios/usuario/' + id + '/includes';
    return this.http.get( url )
                .pipe(map( (resp: any) => resp.usuario ));
  }

  guardarUsuario( usuario: Usuario ): Observable<any> {
    if ( usuario._id ) {// actualizando
      return this.actualizarUsuario(usuario);
    } else {// creando
      return (this.altaUsuario(usuario));
    }
  }

  altaUsuario( usuario: Usuario ): Observable<any> {
    let url = URL_SERVICIOS + '/usuarios/usuario';
    url += '?token=' + this.token;
    return this.http.post( url, usuario )
            .pipe(map( (resp: any) => {
              swal('Usuario creado', usuario.email, 'success' );
              return resp.usuario;
            }));
   }


actualizarUsuario(usuario: Usuario) {
  let url = URL_SERVICIOS + '/usuarios/usuario/' + usuario._id;
  url += '?token=' + this.token;
  return this.http.put( url, usuario )
            .pipe(map( (resp: any) => {
                    if ( usuario._id === this.usuario._id ) {
                      let usuarioDB: Usuario = resp.usuario;
                      this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu, undefined );
                    }
                    swal('Usuario actualizado', usuario.nombre, 'success' );
                    return true;
                  }));
                }


actualizaPerfil(usuario: Usuario)
{
  let url = URL_SERVICIOS + '/usuarios/usuario/' + usuario._id+'/perfil';
  url += '?token=' + this.token;
  return this.http.put( url, usuario )
            .pipe(map( (resp: any) => {
                    if ( usuario._id === this.usuario._id ) {
                      let usuarioDB: Usuario = resp.usuario;
                      this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu, undefined );
                    }
                    swal('Usuario actualizado', usuario.nombre, 'success' );
                    return true;
                  }));
}

resetPass( usuario: Usuario ): Observable<any> {
  let url = URL_SERVICIOS + '/reset_password/' + usuario._id;
  url += '?token=' + this.token;
  return this.http.put( url, usuario )
            .pipe(map( (resp: any) => {
                    if ( usuario._id === this.usuario._id ) {
                      let usuarioDB: Usuario = resp.usuario;
                      this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu, undefined );
                    }
                    swal('Usuario actualizado', usuario.nombre, 'success' );
                    return true;
                  }));
}

habilitaDeshabilitaUsuario (usuario: Usuario, act: boolean): Observable<any> {
  let url = URL_SERVICIOS + '/usuarios/usuario/' + usuario._id + '/habilita_deshabilita';
  url += '?token=' + this.token;
  return this.http.put( url, {activo: act} )
            .pipe(map( (resp: any) => {
              if ( usuario._id === this.usuario._id ) {
                let usuarioDB: Usuario = resp.usuario;
                this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu, undefined );
              }
                    swal('Cambio de estado del usuario realizado con éxito', usuario.nombre, 'success' );
                    return true;
                  }));
}


  cargarUsuarioEmpresa(id: string): Observable<any> {
    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICIOS + '/usuario/' + id;

    return this.http.get(url);

  }

}
