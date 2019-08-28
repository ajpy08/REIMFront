import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Solicitud } from './solicitud.models';
import { SolicitudService } from '../../services/service.index';
import { ManiobraService } from '../maniobras/maniobra.service';
import { Usuario } from '../../models/usuarios.model';
import { UsuarioService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';


@Component({
  selector: 'app-solicitudd-aprobar',
  templateUrl: './solicitudD_aprobar.component.html',
  styles: []
})
export class SolicitudDAprobarComponent implements OnInit {
  regForm: FormGroup;
  usuario: Usuario;

  constructor( public _usuarioService: UsuarioService,
    public _SolicitudService: SolicitudService,
    private _ManiobraService: ManiobraService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder ) {
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.createFormGroup ();
    this.contenedores.removeAt(0);
    this.cargarSolicitud( id );
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [{value: '', disabled: false}],
      tipo: [{value: '', disabled: true}],
      agencia: [{value: '', disabled: true}],
      naviera: [{value: '', disabled: true}],
      buque: [{value: '', disabled: true}],
      viaje: [{value: '', disabled: true}],
      blBooking: [{value: '', disabled: true}],
      cliente: [{value: '', disabled: true}],
      credito: [{value: '', disabled: true}],
      observaciones: [{value: '', disabled: true}],
      rutaBL: [{value: '', disabled: true}],
      rutaComprobante: [{value: '', disabled: true}],
      correo: [{value: '', disabled: true}],
      facturarA: [{value: '', disabled: true}],
      rfc: [{value: '', disabled: true}],
      razonSocial: [{value: '', disabled: true}],
      calle: [{value: '', disabled: true}],
      noExterior: [{value: '', disabled: true}],
      noInterior: [{value: '', disabled: true}],
      colonia: [{value: '', disabled: true}],
      municipio: [{value: '', disabled: true}],
      ciudad: [{value: '', disabled: true}],
      estado: [{value: '', disabled: true}],
      correoFac: [{value: '', disabled: true}],
      cp: [{value: '', disabled: true}],
      contenedores: this.fb.array([ this.creaContenedor('', '' , '', '' , '', '', '', '', '') ]),
    });
  }

  creaContenedor(cont: string, tipo: string, peso: string, maniobra: string,
    transportista: string, estatus: string, transportista2: string, folio: string, solicitud: string): FormGroup {
    return this.fb.group({
      contenedor: [cont],
      tipo: [tipo],
      peso: [peso],
      maniobra: [maniobra],
      folio: [folio],
      solicitud: [solicitud],
      transportista: [transportista],
      transportista2: [transportista2],
      estatus: [estatus],
    });
  }

  addContenedor(cont: string, tipo: string, peso: string, maniobra: string,transportista: string, 
    estatus: string, transportista2: string, folio: string, solicitud: string): void {
    this.contenedores.push(this.creaContenedor(cont, tipo, peso, maniobra, transportista, 
      estatus, transportista2, folio, solicitud));
  }


  get _id() {
    return this.regForm.get('_id');
  }
  get tipo() {
    return this.regForm.get('tipo');
  }
  get agencia() {
    return this.regForm.get('agencia');
  }
  get naviera() {
    return this.regForm.get('naviera');
  }
  get viaje() {
    return this.regForm.get('viaje');
  }
  get buque() {
    return this.regForm.get('buque');
  }
  get transportistaTemp() {
    return this.regForm.get('transportistaTemp');
  }
  get cliente() {
    return this.regForm.get('cliente');
  }

  get observaciones() {
    return this.regForm.get('observaciones');
  }
  get credito() {
    return this.regForm.get('credito');
  }
  get rutaBL() {
    return this.regForm.get('rutaBL');
  }
  get rutaComprobante() {
    return this.regForm.get('rutaComprobante');
  }
  get correo() {
    return this.regForm.get('correo');
  }

  get contenedores() {
    return this.regForm.get('contenedores') as FormArray;
  }
  get maniobraTemp() {
    return this.regForm.get('maniobraTemp');
  }

  get estadoTemp() {
    return this.regForm.get('estadoTemp');
  }

  get facturarA() {
    return this.regForm.get('facturarA');
  }
  get rfc() {
    return this.regForm.get('rfc');
  }
  get razonSocial() {
    return this.regForm.get('razonSocial');
  }
  get calle() {
    return this.regForm.get('calle');
  }
  get noExterior() {
    return this.regForm.get('noExterior');
  }
  get noInterior() {
    return this.regForm.get('noInterior');
  }
  get colonia() {
    return this.regForm.get('colonia');
  }
  get municipio() {
    return this.regForm.get('municipio');
  }
  get ciudad() {
    return this.regForm.get('ciudad');
  }
  get estado() {
    return this.regForm.get('estado');
  }
  get cp() {
    return this.regForm.get('cp');
  }
  get correoFac() {
    return this.regForm.get('correoFac');
  }


  cargarSolicitud( id: string ) {
    this._SolicitudService.getSolicitudIncludes( id ).subscribe( solicitud => {
      console.log(solicitud);

      this.regForm.controls['_id'].setValue(solicitud._id);
      this.regForm.controls['tipo'].setValue(solicitud.tipo);
      this.regForm.controls['agencia'].setValue(solicitud.agencia.razonSocial);
      this.regForm.controls['naviera'].setValue(solicitud.naviera.razonSocial);
      this.regForm.controls['blBooking'].setValue(solicitud.blBooking);
      this.regForm.controls['viaje'].setValue(solicitud.viaje.viaje);
      this.regForm.controls['buque'].setValue(solicitud.buque.nombre);
      this.regForm.controls['blBooking'].setValue(solicitud.blBooking);
      this.regForm.controls['credito'].setValue(solicitud.credito);
      this.regForm.controls['cliente'].setValue(solicitud.cliente.razonSocial);
      this.regForm.controls['observaciones'].setValue(solicitud.observaciones);
      this.regForm.controls['rutaBL'].setValue(solicitud.rutaBL);
      this.regForm.controls['rutaComprobante'].setValue(solicitud.rutaComprobante);
      this.regForm.controls['correo'].setValue(solicitud.correo);
      this.regForm.controls['facturarA'].setValue(solicitud.facturarA);
      this.regForm.controls['rfc'].setValue(solicitud.rfc);
      this.regForm.controls['razonSocial'].setValue(solicitud.razonSocial);
      this.regForm.controls['calle'].setValue(solicitud.calle);
      this.regForm.controls['noExterior'].setValue(solicitud.noExterior);
      this.regForm.controls['noInterior'].setValue(solicitud.noInterior);
      this.regForm.controls['colonia'].setValue(solicitud.colonia);
      this.regForm.controls['municipio'].setValue(solicitud.municipio);
      this.regForm.controls['ciudad'].setValue(solicitud.ciudad);
      this.regForm.controls['estado'].setValue(solicitud.estado);
      this.regForm.controls['cp'].setValue(solicitud.cp);
      this.regForm.controls['correoFac'].setValue(solicitud.correoFac);
      solicitud.contenedores.forEach(element => {
        this.addContenedor(element.maniobra.contenedor, element.maniobra.tipo, element.peso,
                          element.maniobra._id, element.transportista._id, element.maniobra.estatus,
                          element.transportista.razonSocial, element.maniobra.folio, element.maniobra.solicitud);
      });

    });
  }

  validaSolicitud( i: number) {
      //this.contenedores.controls.forEach( cont => {
      // this._ManiobraService.getManiobraXContenedorViajeBuque(this.contenedores.controls[i].get('contenedor').value, this.solicitud.viaje, this.buque.value)
      // .subscribe( maniobra => {
      //   if (maniobra.length > 0) {
      //     this.contenedores.controls[i].get('maniobra').setValue(maniobra[0]._id);
      //   }
      // });
    //});
  }

  apruebaSolicitud( i: number) {
    console.log(i);
    console.log(this.contenedores.controls[i].get('_id').value);
    // // if ( this.regForm.valid ) {
      this._SolicitudService.apruebaSolicitudDescargaContenedor(this._id.value, this.contenedores.controls[i].get('_id').value ).subscribe(res => {
       this.regForm.markAsPristine();
       });
    // // }
  }


  // apruebaSolicitud( ) {
  //   if ( this.regForm.valid ) {
  //    this._SolicitudService.apruebaSolicitudDescarga(this.regForm.value).subscribe(res => {
  //     this.regForm.markAsPristine();
  //     });
  //   }
  // }

  // cambioEstado(SolicitudD: Solicitud) {
  //   this._SolicitudDService.cambioEstado(SolicitudD)
  //   .subscribe(resp => {
  //    // this.cargarSolicitudes();
  //   });
  // }




}
