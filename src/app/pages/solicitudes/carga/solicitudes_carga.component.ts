import { Component, OnInit } from '@angular/core';
import { Solicitud } from '../solicitud.models';
import { SolicitudService } from '../../../services/service.index';

@Component({
  selector: 'app-solicitudes-carga',
  templateUrl: './solicitudes_carga.component.html',
  styles: []
})
export class SolicitudesCargaComponent implements OnInit {
  solicitudes: any[] = [];
  cargando = true;
  totalRegistros = 0;

  constructor(public _solicitudService: SolicitudService) { }

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.cargando = true;
    console.log(this.solicitudes);
    this._solicitudService.getSolicitudesCarga()
    .subscribe(res => {
      this.totalRegistros = res.total;
      this.solicitudes = res.solicitudes;
      this.cargando = false;
      console.log(res);
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

    // this._prealtaService.borrarSolicitud( praalta._id )
    //         .subscribe( () =>  this.cargarSolicitudesAgencia() );

  }

}
