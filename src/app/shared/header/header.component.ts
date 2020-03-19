import { Notification } from './../../models/notification.models';
import { SolicitudService } from './../../pages/solicitudes/solicitud.service';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../pages/usuarios/usuario.model';
import { Router } from '@angular/router';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';
import { ROLES } from 'src/app/config/config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;
  notifications: Notification[] = [];
  socket = io(URL_SOCKET_IO, PARAM_SOCKET, PARAM_SOCKET);

  constructor(public _usuarioService: UsuarioService,
    public solicitudesService: SolicitudService,
    public router: Router) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;

    this.socket.on('new-solicitud', function (data: any) {
      if (this.usuario.role === ROLES.ADMIN_ROLE || this.usuario.role === ROLES.PATIOADMIN_ROLE) {
        this.solicitudesService.getSolicitudes('D', 'NA').subscribe(resp => {
          this.notifications = this.doSolicitudesNotifications(resp.solicitudes);
        });
      }
    }.bind(this));
  }

  buscar(termino: string) {
    this.router.navigate(['/busqueda', termino]);
  }

  calculaFechas(fAlta) {
    const today = new Date();
    console.log(fAlta);
    console.log(today);
    const minutesAgo = 1;
    return fAlta;
  }

  doSolicitudesNotifications(solicitudes) {
    const notificationsTemp: Notification[] = [];
    solicitudes.forEach(solicitud => {
      const notify = new Notification;
      const tipo = solicitud.tipo === 'D' ? 'Descarga' : solicitud.tipo === 'C' ? 'Carga' : 'TIPO';
      notify.name = solicitud.agencia;
      notify.description = `Solicitud de ${tipo} (${solicitud.contenedores.length} contenedores)`;
      notify.fAlta = solicitud.fAlta;
      notify._id = solicitud._id;

      notificationsTemp.push(notify);
    });
    return notificationsTemp;
  }

  logout() {
    this._usuarioService.updateStatusUser().subscribe((usuario) => {
      this._usuarioService.logout();
      this.socket.emit('logoutuser', usuario);
    });
  }
}
