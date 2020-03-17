import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Usuario } from '../pages/usuarios/usuario.model';
import { UsuarioService } from '../pages/usuarios/usuario.service';
import * as io from 'socket.io-client';
import { URL_SOCKET_IO } from 'src/environments/environment';
import { URL_SERVICIOS } from 'src/environments/environment';
import * as Bowser from 'bowser';
declare var swal: any;


declare function init_plugins();
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  // tslint:disable-next-line:no-inferrable-types
  recuerdame: boolean = false;

  urlWithoutLogin: string;
  ruta: string;
  urlSocket = URL_SOCKET_IO + '/users';
  socket = io(this.urlSocket, {transports: ['websocket']});

  constructor(public router: Router, public _usuarioService: UsuarioService) { }

  ngOnInit() {
    init_plugins();
    const browser = Bowser.getParser(window.navigator.userAgent);
    if (this._usuarioService.usuario &&
      (this._usuarioService.usuario !== 'jpuc@mieryteran.com.mx' ||
        this._usuarioService.usuario !== 'rgarcia@tlreim.com.mx')) {
      if (browser.getBrowser().name === 'Microsoft Edge' || browser.getBrowser().name === 'Edge') {
        swal({
          title: 'Error',
          text: `El navegador ${browser.getBrowser().name} no es COMPATIBLE con el sistema`,
          icon: 'error',
          closeOnClickOutside: false,
        }).then(ok => {
          if (ok) {
            window.location.reload();
          }
        });
      }
    }

    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }

    if (localStorage.getItem('urlMain')) {
      this.urlWithoutLogin = localStorage.getItem('urlMain');
    }
    this.ruta = URL_SERVICIOS + '/forgot_password';
  }

  ingresar(forma: NgForm) {
    if (forma.invalid) {
      return;
    }
    // tslint:disable-next-line:prefer-const
    let usuario = new Usuario(null, forma.value.email, forma.value.password);
    this._usuarioService.login(usuario, forma.value.recuerdame, this.urlWithoutLogin)
      .subscribe(correcto => {
        this.socket.emit('loginuser', correcto);
        if (localStorage.getItem('urlMain')) {
          window.location.href = localStorage.getItem('urlMain');
          localStorage.removeItem('urlMain');
        } else {
          this.router.navigate(['/dashboard']);
        }
      });
  }
}
