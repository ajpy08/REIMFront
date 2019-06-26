import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SolicitudD } from '../../models/solicitudD.models';
import { SolicitudDService } from '../../services/service.index';
import { Usuario } from '../../models/usuarios.model';
import { UsuarioService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';
import { Agencia } from '../../models/agencia.models';

// tslint:disable-next-line:class-name
export interface datos {
  Contenedor: string;
  Tipo: string;
  Estado: string;
  Maniobra: string;
}


@Component({
  selector: 'app-approval-page',
  templateUrl: './approval-page.component.html',
  styles: []
})
export class ApprovalPageComponent implements OnInit {
  usuario: Usuario;
  solicitudes: SolicitudD[] = [];
  solicitud: SolicitudD = new SolicitudD('');
  // SolicitudD: SolicitudD = new SolicitudD('', '');
  // tslint:disable-next-line:no-inferrable-types
  cargando: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  totalRegistros: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  desde: number = 0;
  checked = false;
  contenedores: datos[] = [];
  agencia: string;
  naviera: string;
  transportista: string;
  cliente: string;
  buque: string;
  idbuque: string;
  maniobra: string;

  constructor( public _usuarioService: UsuarioService,
    public _SolicitudDService: SolicitudDService,
    public activatedRoute: ActivatedRoute,
    public router: Router ) {
    this.usuario = this._usuarioService.usuario;
    activatedRoute.params.subscribe( params => {

      // tslint:disable-next-line:prefer-const
      let id = params['id'];

      if ( id !== 'nuevo' ) {
        this.cargarSolicitud( id );
      }

    });
  }

  ngOnInit() {
  }

  cargarSolicitud(id: string) {
    this.cargando = true;
    this._SolicitudDService.cargarSolicitud( id )
          .subscribe( solicitud => {
            console.log(solicitud);
            this.agencia = solicitud.agencia.razonSocial;
            this.naviera = solicitud.agencia.razonSocial;
            this.transportista = solicitud.transportista.razonSocial;
            this.cliente = solicitud.cliente.razonSocial;
            this.buque = solicitud.buque.buque;
            this.idbuque = solicitud.buque._id;
            this.solicitud = solicitud;
            this.contenedores = solicitud.contenedores;
            this.buscarManiobra();
          });
  }

  buscarManiobra() {
      this.contenedores.forEach( contenedor => {
      this._SolicitudDService.cargarManiobraID(contenedor.Contenedor, this.solicitud.viaje, this.idbuque)
      .subscribe( maniobra => {
        contenedor.Maniobra = maniobra[0]._id;
      });
       
      // console.log(this.solicitud.viaje);
      // console.log(this.idbuque)
    });
  }

  updateSolicitud( f: NgForm ) {
    if ( f.invalid ) {
      return;
      }
    this.solicitud.contenedores = this.contenedores;
    console.log(this.solicitud);
   this._SolicitudDService.guardarSolicitudManiobra(this.solicitud)
   .subscribe(solicitud => {
    // console.log(solicitud);
   });

  }

  cambioEstado(SolicitudD: SolicitudD) {
    this._SolicitudDService.cambioEstado(SolicitudD)
    .subscribe(resp => {
     // this.cargarSolicitudes();
    });
  }




}
