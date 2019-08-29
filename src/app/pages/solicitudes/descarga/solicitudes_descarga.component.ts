import { Component, OnInit } from '@angular/core';
import { Solicitud } from '../solicitud.models';
import { SolicitudService, UsuarioService } from '../../../services/service.index';

@Component({
  selector: 'app-solicitudes-descarga',
  templateUrl: './solicitudes_descarga.component.html',
  styles: []
})
export class SolicitudesDescargaComponent implements OnInit {
  solicitudes: any[] = [];
  cargando = true;
  totalRegistros  = 0;
  usuarioLogueado : any;

  constructor(public _solicitudService: SolicitudService, private _usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuarioLogueado = this._usuarioService.usuario;
    this.cargarSolicitudes();

  }

  cargarSolicitudes() {
    this.cargando = true;
        

    if (this.usuarioLogueado.role == 'ADMIN_ROLE') {
      this._solicitudService.getSolicitudes('D')
      .subscribe(res => {
        this.totalRegistros = res.total;
        this.solicitudes = res.solicitudes;
      });
    }
    else {
      let agencias ='';
      this.usuarioLogueado.empresas.forEach(emp => {
        agencias = agencias + emp._id + ',';
      });
      agencias = agencias.slice(0,-1);
      this._solicitudService.getSolicitudes('D', null, null, null, agencias)
      .subscribe(res => {
        this.totalRegistros = res.total;
        this.solicitudes = res.solicitudes;
      });      

    }
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
