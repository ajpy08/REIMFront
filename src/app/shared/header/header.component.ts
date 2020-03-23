import { AgenciaService } from './../../pages/agencias/agencia.service';
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
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  constructor(public _usuarioService: UsuarioService,
    private solicitudesService: SolicitudService,
    private agenciaService: AgenciaService,
    public router: Router) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;

    this.solicitudesService.getSolicitudes('C', 'NA').subscribe(resp => {
      this.doSolicitudesNotifications(resp.solicitudes);
    });

    this.solicitudesService.getSolicitudes('D', 'NA').subscribe(resp => {
      this.doSolicitudesNotifications(resp.solicitudes);
    });

    this.socket.on('new-solicitud', function (data: any) {
      if (this.usuario.role === ROLES.ADMIN_ROLE || this.usuario.role === ROLES.PATIOADMIN_ROLE) {
        const tempArray: Notification[] = [];
        tempArray.push(data.data);
        this.doSolicitudesNotifications(tempArray);
      }
    }.bind(this));

    this.socket.on('delete-solicitud', function (data: any) {
      if (this.usuario.role === ROLES.ADMIN_ROLE || this.usuario.role === ROLES.PATIOADMIN_ROLE) {
        this.notifications = [];
        this.solicitudesService.getSolicitudes('C', 'NA').subscribe(resp => {
          this.doSolicitudesNotifications(resp.solicitudes);
        });

        this.solicitudesService.getSolicitudes('D', 'NA').subscribe(resp => {
          this.doSolicitudesNotifications(resp.solicitudes);
        });
      }
    }.bind(this));

    this.socket.on('aprobar-solicitud', function (data: any) {
      if (this.usuario.role === ROLES.ADMIN_ROLE || this.usuario.role === ROLES.PATIOADMIN_ROLE) {
        this.notifications = [];
        this.solicitudesService.getSolicitudes('C', 'NA').subscribe(resp => {
          this.doSolicitudesNotifications(resp.solicitudes);
        });

        this.solicitudesService.getSolicitudes('D', 'NA').subscribe(resp => {
          this.doSolicitudesNotifications(resp.solicitudes);
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
    solicitudes.forEach(solicitud => {
      let nombreAgencia = '';
      let promesa;
      if (!solicitud.agencia.razonSocial) {
        // tslint:disable-next-line: no-unused-expression
        promesa = new Promise((resolve, reject) => {
          this.agenciaService.getAgencia(solicitud.agencia).subscribe((agencia) => {
            nombreAgencia = agencia.razonSocial;
            resolve(true);
          });
        });
      } else {
        promesa = new Promise((resolve, reject) => {
          nombreAgencia = solicitud.agencia.razonSocial;
          resolve(true);
        });
      }

      promesa.then((value: boolean) => {
        if (value) {
          const notify = new Notification;
          const tipo = solicitud.tipo === 'D' ? 'Descarga' : solicitud.tipo === 'C' ? 'Carga' : 'TIPO';
          const contenedor = solicitud.contenedores.length > 1 ? 'contenedores' : 'contenedor';
          notify.name = nombreAgencia;
          notify.description = 'Solicitud de ' + tipo + '(' + solicitud.contenedores.length + ' ' + contenedor + ')';
          notify.fAlta = solicitud.fAlta;
          notify._id = solicitud._id;
          notify.url = `https://reimcontainerpark.com.mx/#/solicitudes/aprobaciones/aprobar_${tipo.toLocaleLowerCase()}/${notify._id}`;

          this.notifications.push(notify);
        }
      });
    });
  }

  logout() {
    this._usuarioService.updateStatusUser(this._usuarioService.usuario).subscribe((usuario) => {
      this._usuarioService.logout();
      this.socket.emit('logoutuser', usuario);
    });
  }
}
