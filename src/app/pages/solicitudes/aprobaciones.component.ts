import { Component, OnInit } from '@angular/core';
import { Solicitud } from './solicitud.models';
import { SolicitudService } from '../../services/service.index';


declare var swal: any;

@Component({
  selector: 'app-aprobaciones',
  templateUrl: './aprobaciones.component.html',
  styles: []
})
export class AprobacionesComponent implements OnInit {
  solicitudes: any[] = [];
  solicitudesCarga: any[] = [];
  cargando = true;
  totalRegistros = 0;
  totalRegistrosCargas = 0;

  constructor(public _solicitudesService: SolicitudService) { }

  ngOnInit() {
    this.cargaSolicitudes();
  }

  cargaSolicitudes() {
    this.cargando = true;
    this._solicitudesService.getSolicitudes('D')
    .subscribe(resp => {
      this.totalRegistros = resp.total;
      this.solicitudes = resp.solicitudes;
      this.cargando = false;
    });
    this.cargando = true;
    this._solicitudesService.getSolicitudes('C')
    .subscribe(resp => {
      this.totalRegistrosCargas = resp.total;
      this.solicitudesCarga = resp.solicitudes;
      this.cargando = false;
    });
  }

  borrarSolicitud( sol: Solicitud ) {
    swal({title: '¿Esta seguro?', text: 'Esta apunto de borrar la solicitud.' , icon: 'warning', buttons: true, dangerMode: true, })
      .then(borrar => {
        if (borrar) {
          this._solicitudesService.borrarSolicitud(sol._id)
          .subscribe(borrado => {
            this.cargaSolicitudes();
          });
        }
      });
  }




}
