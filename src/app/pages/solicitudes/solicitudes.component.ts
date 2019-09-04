import { Component, OnInit } from '@angular/core';
import { Solicitud } from './solicitud.models';
import { SolicitudService, UsuarioService } from '../../services/service.index';

declare var swal: any;

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styles: []
})
export class SolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  solicitudesCarga: any[] = [];
  cargando = true;
  totalRegistros  = 0;
  totalRegistrosCargas  = 0;
  usuarioLogueado: any;

  constructor(public _solicitudService: SolicitudService, private _usuarioService: UsuarioService) { }
  ngOnInit() {
    this.usuarioLogueado = this._usuarioService.usuario;
    this.cargarSolicitudes();
  }
  cargarSolicitudes() {
    this.cargando = true;
    if (this.usuarioLogueado.role === 'ADMIN_ROLE') {
      this._solicitudService.getSolicitudes('D')
      .subscribe(res => {
        this.totalRegistros = res.total;
        this.solicitudes = res.solicitudes;
      });
      this._solicitudService.getSolicitudes('C')
      .subscribe(res => {
        this.totalRegistrosCargas = res.total;
        this.solicitudesCarga = res.solicitudes;
        this.cargando = false;
      });
    } else {
      let agencias = '';
      this.usuarioLogueado.empresas.forEach(emp => {
        agencias = agencias + emp._id + ',';
      });
      agencias = agencias.slice(0, -1);
      this._solicitudService.getSolicitudes('D', null, null, null, agencias)
      .subscribe(res => {
        this.totalRegistros = res.total;
        this.solicitudes = res.solicitudes;
      });
      this._solicitudService.getSolicitudes('C', null, null, null, agencias)
      .subscribe(res => {
        this.totalRegistrosCargas = res.total;
        this.solicitudesCarga = res.solicitudes;
        this.cargando = false;
      });
    }
  }

  borrarSolicitud( sol: Solicitud ) {
    swal({title: '¿Esta seguro?', text: 'Esta apunto de borrar la solicitud.' , icon: 'warning', buttons: true, dangerMode: true, })
      .then(borrar => {
        if (borrar) {
          this._solicitudService.borrarSolicitud(sol._id)
          .subscribe(borrado => {
            this.cargarSolicitudes();
          });
        }
      });
  }

}
