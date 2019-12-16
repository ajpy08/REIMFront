import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { SolicitudService, BuqueService, ViajeService } from '../../services/service.index';
import { ManiobraService } from '../maniobras/maniobra.service';
import { Buque } from '../buques/buques.models';
import { Viaje } from '../viajes/viaje.models';
import { Usuario } from '../usuarios/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';
import { catchError } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Maniobra } from 'src/app/models/maniobra.models';

@Component({
  selector: 'app-aprobar-descarga',
  templateUrl: './aprobar_descarga.component.html',
  styles: []
})
export class AprobarDescargaComponent implements OnInit {
  regForm: FormGroup;
  usuario: Usuario;
  viajeEncontrado = false;
  buqueEncontrado = false;
  solicitudCorrecta = false;
  buques: Buque[] = [];
  viajes: Viaje[] = [];
  url: string;


  constructor(public _usuarioService: UsuarioService,
    public _SolicitudService: SolicitudService,
    private _ManiobraService: ManiobraService,
    private _BuqueService: BuqueService,
    private _viajeService: ViajeService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private location: Location) {
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.createFormGroup();
    this.contenedores.removeAt(0);
    this.cargarSolicitud(id);
    this.url = '/solicitudes/aprobaciones';
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [{ value: '', disabled: false }],
      estatus: [{ value: '', disabled: false }],
      tipo: [{ value: '', disabled: false }],
      idagencia: [{ value: '', disabled: false }],
      agencia: [{ value: '', disabled: true }],
      naviera: [{ value: '', disabled: true }],
      buque: [{ value: '', disabled: false }],
      nombreBuque: [{ value: '', disabled: true }],
      viaje: [{ value: '', disabled: false }],
      noViaje: [{ value: '', disabled: true }],
      blBooking: [{ value: '', disabled: true }],
      idcliente: [{ value: '', disabled: false }],
      cliente: [{ value: '', disabled: true }],
      credito: [{ value: '', disabled: true }],
      observaciones: [{ value: '', disabled: true }],
      rutaBL: [{ value: '', disabled: true }],
      rutaComprobante: [{ value: '', disabled: true }],
      correo: [{ value: '', disabled: true }],
      facturarA: [{ value: '', disabled: true }],
      rfc: [{ value: '', disabled: true }],
      razonSocial: [{ value: '', disabled: true }],
      calle: [{ value: '', disabled: true }],
      noExterior: [{ value: '', disabled: true }],
      noInterior: [{ value: '', disabled: true }],
      colonia: [{ value: '', disabled: true }],
      municipio: [{ value: '', disabled: true }],
      ciudad: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      correoFac: [{ value: '', disabled: true }],
      cp: [{ value: '', disabled: true }],
      contenedores: this.fb.array([this.creaContenedor('', '', '', '', '', '', '', '', '', '')]),
    });
  }

  creaContenedor(cont: string, tipo: string, peso: string, maniobra: string,
    transportista: string, estatus: string, transportista2: string, folio: string, solicitud: string, patio: string): FormGroup {
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
      patio: [patio]
    });
  }

  addContenedor(cont: string, tipo: string, peso: string, maniobra: string, transportista: string,
    estatus: string, transportista2: string, folio: string, solicitud: string, patio: string): void {
    this.contenedores.push(this.creaContenedor(cont, tipo, peso, maniobra, transportista,
      estatus, transportista2, folio, solicitud, patio));
  }


  get _id() {
    return this.regForm.get('_id');
  }
  get tipo() {
    return this.regForm.get('tipo');
  }
  get estatus() {
    return this.regForm.get('estatus');
  }
  get idagencia() {
    return this.regForm.get('idagencia');
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
  get noViaje() {
    return this.regForm.get('noViaje');
  }
  get buque() {
    return this.regForm.get('buque');
  }
  get nombreBuque() {
    return this.regForm.get('nombreBuque');
  }
  get transportistaTemp() {
    return this.regForm.get('transportistaTemp');
  }

  get idcliente() {
    return this.regForm.get('idcliente');
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

  cargarSolicitud(id: string) {
    this._SolicitudService.getSolicitudIncludes(id).subscribe(solicitud => {
      this.regForm.controls['_id'].setValue(solicitud._id);
      this.regForm.controls['tipo'].setValue(solicitud.tipo);
      this.regForm.controls['estatus'].setValue(solicitud.estatus);
      this.regForm.controls['idagencia'].setValue(solicitud.agencia._id);
      this.regForm.controls['agencia'].setValue(solicitud.agencia.nombreComercial);
      this.regForm.controls['naviera'].setValue(solicitud.naviera.nombreComercial);
      this.regForm.controls['blBooking'].setValue(solicitud.blBooking);
      if (solicitud.buque) {
        this._BuqueService.getBuqueXNaviera(solicitud.naviera._id)
          .subscribe(buques => {
            this.buques = buques.buques;
            this.regForm.controls['buque'].setValue(solicitud.buque._id);
            this.buque.disable({ onlySelf: true });
            this.cargarViajes({ value: solicitud.buque._id, viaje: solicitud.viaje ? solicitud.viaje._id : '' });
          });
      } else {
        this._BuqueService.getBuqueXNaviera(solicitud.naviera._id)
          .subscribe(buques => {
            this.buques = buques.buques;
            const buq = this.buques.find(x => x.nombre === solicitud.nombreBuque);
            if (buq) {
              this.buque.setValue(buq._id);
              this.buqueEncontrado = true;
              this.cargarViajes({ value: buq._id });
            }
          });
      }
      this.regForm.controls['nombreBuque'].setValue(solicitud.nombreBuque);
      this.regForm.controls['noViaje'].setValue(solicitud.noViaje);

      this.regForm.controls['blBooking'].setValue(solicitud.blBooking);
      this.regForm.controls['credito'].setValue(solicitud.credito);
      this.regForm.controls['cliente'].setValue(solicitud.cliente.nombreComercial);
      this.regForm.controls['idcliente'].setValue(solicitud.cliente._id);
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
        this.addContenedor(element.contenedor, element.tipo, element.peso,
          element.maniobra ? element.maniobra._id : '', element.transportista._id,
          element.maniobra ? element.maniobra.estatus : '', element.transportista.nombreComercial,
          element.maniobra ? element.maniobra.folio : '',
          element.maniobra ? element.maniobra.solicitud : '', element.patio);
      });

    });
  }

  cargarViajes(event) {
    if (event.value !== undefined && event.value !== '') {
      this._viajeService.getViajes(null, null, null, event.value)
        .subscribe(res => {
          this.viajes = res.viajes;
          if (event.viaje !== undefined && event.viaje !== '') {
            this.viaje.setValue(event.viaje);
            this.viaje.disable({ onlySelf: true });

          } else {
            const via = this.viajes.find(x => x.viaje === this.noViaje.value);
            if (via) {
              this.viaje.setValue(via._id);
              this.viajeEncontrado = true;
            }
          }

        });
    }
  }

  guardaViajeBuque() {
    this._SolicitudService.guardaViajeBuque({ _id: this._id.value, buque: this.buque.value, viaje: this.viaje.value }).subscribe(res => {
      this.router.navigate(['/solicitudes/aprobaciones/aprobar_descarga/', this.regForm.get('_id').value]);
    });
  }
  validaSolicitud(cont) {
    if (cont.get('solicitud').value === this._id.value) {
      this.solicitudCorrecta = this.solicitudCorrecta && true;
      return;
    }

    const maniobraactualizar = { _id: '', solicitud: '', agencia: '', transportista: '', cliente: '', patio: '' };
    maniobraactualizar._id = cont.get('maniobra').value;
    maniobraactualizar.solicitud = this._id.value;
    maniobraactualizar.transportista = cont.get('transportista').value;
    maniobraactualizar.agencia = this.idagencia.value;
    maniobraactualizar.cliente = this.idcliente.value;
    maniobraactualizar.patio = cont.get('patio').value;
    this._ManiobraService.asignaSolicitud(maniobraactualizar)
      .subscribe(maniobra => {
        cont.get('solicitud').setValue(maniobra.solicitud);
        this.solicitudCorrecta = this.solicitudCorrecta && true;
      }, error => {
        this.solicitudCorrecta = false;
      });
  }

  altaContenedor(cont) {
    if (!cont.get('solicitud').value) {
      this._viajeService.addContenedor(this.viaje.value,
        cont.get('contenedor').value,
        cont.get('tipo').value,
        cont.get('peso').value, '')
        .subscribe(maniobra => {
          cont.get('maniobra').setValue(maniobra.maniobra._id);
          cont.get('folio').setValue(maniobra.maniobra.folio);
        });
    }
  }


  validaSolicitudes() {
    this.solicitudCorrecta = true;
    this.contenedores.controls.forEach(cont => {
      this.validaSolicitud(cont);
    });
  }

  apruebaSolicitud() {
    if (this.solicitudCorrecta) {
      this._SolicitudService.apruebaSolicitudDescarga(this.regForm.value).subscribe(resp => {
        this._SolicitudService.enviaCorreoAprobacionSolicitud(this.regForm.value).subscribe((resp) => {
          this.router.navigate([this.url]);
        });
      });
    }
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

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history')
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history')
    // this.location.back();
  }

  enviacorreo(maniobra) {
    this._ManiobraService.enviaCorreo({_id: maniobra}).subscribe(() => { });
  }
}
