import { Component, OnInit } from '@angular/core';
import { Solicitud } from '../solicitud.models';
import { SolicitudService } from '../../../services/service.index';

@Component({
  selector: 'app-solicitudes-descarga',
  templateUrl: './solicitudes_descarga.component.html',
  styles: []
})
export class SolicitudesDescargaComponent implements OnInit {
  solicitudes: any[] = [];
  cargando = true;
  totalRegistros  = 0;

  constructor(public _solicitudService: SolicitudService) { }

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.cargando = true;
    this._solicitudService.getSolicitudesDescarga()
    .subscribe(res => {
      this.totalRegistros = res.total;
      this.solicitudes = res.solicitudes;
    });
  }


  buscarSolicitudes(termino: string) {
    // if (termino.length <= 0) {
    //   this.cargarSolicitudesAgencia();
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

    // this._solicitudService.borrarSolicitud( praalta._id )
    //         .subscribe( () =>  this.cargarSolicitudesAgencia() );

  }

}
