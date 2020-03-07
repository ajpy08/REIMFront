import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../pages/usuarios/usuario.model';
import { Router } from '@angular/router';
import { URL_SOCKET_IO } from '../../../environments/environment';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;
  ultimos = [];
  socket = io(URL_SOCKET_IO);

  constructor(public _usuarioService: UsuarioService,
    public router: Router) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;

    this.socket.on('new-data', function(data: any) {
      this.ultimos.push(data.data);
  }.bind(this));
  }

  buscar( termino: string ) {
    this.router.navigate(['/busqueda', termino ]);
  }

  calculaFechas(fAlta){
    const today = new Date();
    console.log(fAlta);
    console.log(today);
    const minutesAgo = 1;
    return fAlta;
  }

  logout() {
    this._usuarioService.updateStatusUser().subscribe((usuario) => {
      this._usuarioService.logout();
      this.socket.emit('logoutuser', usuario);
    });
  }
}
