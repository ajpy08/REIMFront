import { Component, OnInit } from '@angular/core';
import { Solicitud } from './solicitud.models';
import { SolicitudService } from '../../services/service.index';


@Component({
  selector: 'app-solicitudes-aprobaciones',
  templateUrl: './solicitudesAprobaciones.component.html',
  styles: []
})
export class SolicitudesAprobacionesComponent implements OnInit {
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


  borrarSolicitud( praalta: Solicitud ) {

    // this._prealtaService.borrarSolicitud( praalta._id )
    //         .subscribe( () =>  this.cargarSolicitudes() );

  }

}
