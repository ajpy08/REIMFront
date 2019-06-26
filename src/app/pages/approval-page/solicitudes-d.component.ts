import { Component, OnInit } from '@angular/core';
import { SolicitudD } from '../../models/solicitudD.models';
import { SolicitudDService } from '../../services/service.index';
import { Usuario } from '../../models/usuarios.model';
import { UsuarioService } from '../../services/service.index';

@Component({
  selector: 'app-solicitudes-d',
  templateUrl: './solicitudes-d.component.html',
  styles: []
})
export class SolicitudesDComponent implements OnInit {

   // tslint:disable-next-line:typedef-whitespace
   prealtas: SolicitudD[] = [];
   // tslint:disable-next-line:no-inferrable-types
   cargando: boolean = true;
   // tslint:disable-next-line:no-inferrable-types
   totalRegistros: number = 0;
   // tslint:disable-next-line:no-inferrable-types
   desde: number = 0;
   usuario: Usuario;

  constructor(
    public _prealtaService: SolicitudDService,
    public _usuarioService: UsuarioService
    ) {
      this.usuario = this._usuarioService.usuario;
      if(this.usuario.role = 'ADMIN_ROLE') {
        this.cargarSolicitudes();
      } else {
         this.cargarSolicitudesAgencias(this.usuario.empresas);
      }
    }

  ngOnInit() {
  }

  cargarSolicitudesAgencias(agencias: string) {
    this.cargando = true;
    this._prealtaService.cargarSolicitudesAgencia(agencias, this.desde)
    .subscribe(solicitudesD =>
      // this.totalRegistros = resp.total;
      this.prealtas = solicitudesD
    );
  }

  cargarSolicitudes() {
    this.cargando = true;
    this._prealtaService.cargarSolicitudes(this.desde)
    .subscribe(solicitudesD =>
      // this.totalRegistros = resp.total;
      this.prealtas = solicitudesD
    );
  }

  cambiarDesde(valor: number) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;
    console.log(desde);
    if (desde >= this._prealtaService.totalSolicitudesDescarga) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarSolicitudes();

  }

  buscarSolicitudes(termino: string) {
    if (termino.length <= 0) {
      this.cargarSolicitudes();
      return;
    }
    this.cargando = true;
    this._prealtaService.buscarSolicitud(termino)
    .subscribe((prealtas: SolicitudD[]) => {
      this.prealtas = prealtas;
      this.cargando = false;

    });
  }

  borrarSolicitud( praalta: SolicitudD ) {

    this._prealtaService.borrarSolicitud( praalta._id )
            .subscribe( () =>  this.cargarSolicitudes() );

  }

}
