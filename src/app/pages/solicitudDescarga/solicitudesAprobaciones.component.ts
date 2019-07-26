import { Component, OnInit } from '@angular/core';
import { Solicitud } from './solicitud.models';
import { SolicitudService } from '../../services/service.index';


@Component({
  selector: 'app-solicitudesAprobaciones',
  templateUrl: './solicitudesAprobaciones.component.html',
  styles: []
})
export class SolicitudesAprobacionesComponent implements OnInit {
  solicitudes: any[] = [];
  cargando = true;
  totalRegistros = 0;
  desde = 0;

  constructor(public _solicitudesService: SolicitudService) { }

  ngOnInit() {
    this.cargaSolicitudes();
  }

  cargaSolicitudes() {
    this.cargando = true;
    this._solicitudesService.getSolicitudes(this.desde)
    .subscribe(resp => {
      this.totalRegistros = resp.total;
      this.solicitudes = resp.solicitudes;
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargaSolicitudes();
  }

  buscarSolicitudes(termino: string) {
    // if (termino.length <= 0) {
    //   this.getSolicitudes();
    //   return;
    // }
    // this.cargando = true;
    // this._prealtaService.buscarSolicitud(termino)
    // .subscribe((prealtas: Solicitud[]) => {
    //   this.prealtas = prealtas;
    //   this.cargando = false;

    // });
  }

  borrarSolicitud( praalta: Solicitud ) {

    // this._prealtaService.borrarSolicitud( praalta._id )
    //         .subscribe( () =>  this.cargarSolicitudes() );

  }

}
