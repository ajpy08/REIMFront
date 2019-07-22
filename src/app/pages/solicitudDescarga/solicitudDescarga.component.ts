import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Agencia } from '../../models/agencia.models';
import { AgenciaService } from 'src/app/services/service.index';
import { Usuario } from '../../models/usuarios.model';
import { UsuarioService } from '../../services/service.index';
import { Naviera } from '../../models/navieras.models';
import { NavieraService } from '../../services/service.index';
import { Transportista } from '../../models/transportista.models';
import { TransportistaService } from '../../services/service.index';
import { Cliente } from '../../models/cliente.models';
import { ClienteService } from '../../services/service.index';
import { Buque } from '../../models/buques.models';
import { BuqueService } from '../../services/service.index';
import { Viaje } from '../viajes/viaje.models';
import { ViajeService } from '../../services/service.index';
import { SolicitudD } from '../../models/solicitudD.models';
import { SolicitudDService } from '../../services/service.index';
import swal from 'sweetalert';

// tslint:disable-next-line:class-name
export interface datos {
  Contenedor: string;
  Tipo: string;
  Estado: string;
}


@Component({
  selector: 'app-solicitude-descarga',
  templateUrl: './solicitudDescarga.component.html',
  styleUrls: ['solicitudDescarga.component.css']
})

export class SolicitudDescargaComponent implements OnInit {

  fileBL: File;
  fileComprobante: File;
  usuario: Usuario;
 
  solicitudes: SolicitudD[] = [];
  solicitud: SolicitudD = new SolicitudD('');
 
  agencias: Agencia[] = [];
  agencia: Agencia = new Agencia('');
  navieras: Naviera[] = [];
  naviera: Naviera = new Naviera('');
  buques: Buque[] = [];
  buque: Buque = new Buque('');
  viajes: Viaje[] = [];
  viaje: Viaje = new Viaje('');
  transportistas: Transportista[] = [];
  transportista: Transportista = new Transportista('');
  clientes: Cliente[] = [];
  cliente: Cliente = new Cliente('');
 
 
  // profile: Usuario = new Usuario('');
  desde = 0;
  facturaa: string;
  facturas: string[] = ['Agencia Aduanal', 'Otro'];
  formasPago: string;
  pagos: string[] = ['Comprobante de pago', 'Ya cuenta con crédito'];
  contenedores: datos[] = [];
  // tslint:disable-next-line:quotemark
  selectedTipo = "Contenedor Estandar 20'";
  selectedEstado = 'Vacio';
  selectedServicio = 'Lavado';
  selectedNaviera = '';

  constructor(
    public _usuarioService: UsuarioService,
    public _agenciaService: AgenciaService,
    public _navieraService: NavieraService,
    public _transportistaService: TransportistaService,
    public _clienteService: ClienteService,
    public _SolicitudDService: SolicitudDService,
    public _buqueService: BuqueService,
    public _viajeService: ViajeService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    this.usuario = this._usuarioService.usuario;
    activatedRoute.params.subscribe( params => {
      let id = params['id'];
      if ( id !== 'nuevo' ) {
        this.cargarSolicitud( id );
      }

    });
   }

   cargarSolicitud( id: string ) {
    this._SolicitudDService.cargarSolicitud( id )
          .subscribe( solicitud => {
            console.log( solicitud );
            this.solicitud = solicitud;
            this.contenedores = solicitud.contenedores;
            this.solicitud.agencia = solicitud.agencia._id;
            this.cargarDatos( this.solicitud.agencia );
            this.solicitud.naviera = solicitud.naviera._id;
            this.cargarBuques( this.solicitud.naviera );
            // this.viaje.contenedor = viaje.contenedor._id;
            // this.cambioContenedor( this.viaje.contenedor );
            this.solicitud.transportista = solicitud.transportista._id;
            this.cambioTransportista( this.solicitud.transportista );
            //this.camion.usuario = camion.usuario._id;
          });
  }

  ngOnInit() {
    this._navieraService.getNavieras()
    .subscribe( navieras => {
      this.navieras = navieras;
    });
    this._transportistaService.getTransportistas()
    .subscribe( transportistas => this.transportistas = transportistas );
  }

  cargarBuques(idNaviera: string) {
    this._buqueService.cargarBuqueNaviera( idNaviera )
    .subscribe( buques => this.buques = buques);
  }



  cargarDatos( id: string ) {
    this._clienteService.getClientesEmpresa( id )
          .subscribe( clientes => {
            console.log( clientes );
            this.clientes = clientes;
          });
    // this._agenciaService.cargarAgencia( id )
    //       .subscribe( agencia => {
    //         console.log( agencia );
    //         this.agencia = agencia;
    //       });
  }


  cambioTransportista( id: string ) {

    this._transportistaService.getTransportistaXID( id )
          .subscribe( transportista => this.transportista = transportista );

  }

  cargarViajes() {
    this._viajeService.getViajes(this.desde)
    .subscribe(viajes =>
    this.viajes = viajes

    );
  }



  anadirContenedores(contenedor: string) {
       // console.log(value);
    // tslint:disable-next-line:prefer-const
    // tslint:disable-next-line:triple-equals
    let index = this.contenedores.find( dato => dato.Contenedor == contenedor);

    // tslint:disable-next-line:triple-equals
    if (contenedor == '') {
      swal( 'Error esta vacio', 'No fue posible insertar', 'error' );
      // console.log('Error esta vacio');
      return;
     }
     if (index != null) {
      swal( 'Error Contenedor Duplicado', 'No fue posible insertar: ' + index.Contenedor, 'error' );
      // console.log('Contenedor duplicado ' + index.contenedor);
     } else {
      // tslint:disable-next-line:max-line-length
      this.contenedores.push({Contenedor: contenedor, Tipo: this.selectedTipo, Estado: this.selectedEstado});
    }

}

  remover(element: any) {
    console.log(element);
     let index = this.contenedores.find( dato => dato.Contenedor == element);
      // tslint:disable-next-line: prefer-const
     let index2 = this.contenedores.indexOf(index);
       console.log(index2);
       if (index2 >= -1) {
      this.contenedores.splice(index2, 1);
    }
}

guardarSolicitud( f: NgForm ) {
   // console.log(this.datos);
   if ( f.invalid ) {
    return;
  }

  this.solicitud.contenedores = this.contenedores;

  console.log(this.solicitud);

  this._SolicitudDService.guardarSolicitud(this.solicitud)
    // tslint:disable-next-line:no-shadowed-variable
    .subscribe( solicitud => {
   //  this.solicitud._id = SolicitudD._id;
    // this.router.navigate(['/SolicitudD', SolicitudD._id]);
  });
}

seleccionBL(archivo: File) {
  console.log(archivo);

   if (!archivo) {
     this.fileBL = null;
     return;
   }
   if (archivo.type.indexOf('image') < 0 && archivo.type.indexOf('pdf') < 0) {
     swal('Solo Archivos De Imagen', 'El archivo seleccionado no tiene formato Imagen', 'error');
     this.fileBL = null;
     return;

   }

      this.fileBL = archivo;

      this._SolicitudDService.cargarComprobante(this.fileBL)
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe( nombreArchivo => {
        this.solicitud.rutaBL = nombreArchivo;
        console.log(this.solicitud.rutaBL);
    });
 }

 seleccionComprobante(archivo: File) {
  console.log(archivo);

   if (!archivo) {
     this.fileComprobante = null;
     return;
   }
   if (archivo.type.indexOf('image') < 0 && archivo.type.indexOf('pdf') < 0) {
     swal('Solo Archivos De Imagen', 'El archivo seleccionado no tiene formato Imagen', 'error');
     this.fileComprobante = null;
     return;

   }

      this.fileComprobante = archivo;

      this._SolicitudDService.cargarComprobante(this.fileComprobante)
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe( nombreArchivo => {
        this.solicitud.rutaComprobante = nombreArchivo;
        console.log(this.solicitud.rutaComprobante);
    });
 }

}
