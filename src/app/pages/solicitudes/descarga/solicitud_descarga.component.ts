import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Maniobra } from '../../../models/maniobra.models';
import { ManiobraService } from 'src/app/services/service.index';
import { Agencia } from '../../agencias/agencia.models';
import { AgenciaService } from 'src/app/services/service.index';
import { Usuario } from '../../usuarios/usuario.model';
import { UsuarioService } from '../../../services/service.index';
import { Naviera } from '../../navieras/navieras.models';
import { NavieraService } from '../../../services/service.index';
import { Transportista } from '../../transportistas/transportista.models';
import { TransportistaService } from '../../../services/service.index';
import { Cliente } from '../../../models/cliente.models';
import { ClienteService } from '../../../services/service.index';
import { Buque } from '../../buques/buques.models';
import { BuqueService } from '../../../services/service.index';
import { Viaje } from '../../viajes/viaje.models';
import { ViajeService } from '../../../services/service.index';
import { SolicitudService } from '../../../services/service.index';
import { ModalUploadService } from '../../../components/modal-upload/modal-upload.service';
import { SubirArchivoService } from '../../../services/subirArchivo/subir-archivo.service';
import { PATIOS_ARRAY, PATIOS, ESTADOS_CONTENEDOR, ESTADOS_CONTENEDOR_ARRAY, ID_MELFI } from '../../../config/config';
import swal from 'sweetalert';
import { Location } from '@angular/common';


@Component({
  selector: 'app-solicitud_descarga',
  templateUrl: './solicitud_descarga.component.html',
  styleUrls: ['./solicitud_descarga.component.css']
})

export class SolicitudDescargaComponent implements OnInit {

  regForm: FormGroup;
  fileBL: File = null;
  temporalBL = false;
  fileComprobante: File = null;
  temporalComprobante = false;
  edicion = false;
  aprobada = false;
  usuarioLogueado: any;
  navieraMELFI = true;


  agencias: Agencia[] = [];
  navieras: Naviera[] = [];
  buques: Buque[] = [];
  viajes: Viaje[] = [];
  transportistas: Transportista[] = [];
  clientes: Cliente[] = [];
  contenedoresXViaje: Maniobra[] = [];


   listaFacturarA: string[] = ['Agencia Aduanal', 'Cliente'];
  //  tiposContenedor: string[] = ['20\' DC', '20\' HC', '40\' DC', '40\' HC'];
   estadosContenedor = ESTADOS_CONTENEDOR_ARRAY;

   patios = PATIOS_ARRAY;

   formasPago: string [] = ['', ''];

  constructor(
    public _maniobraService: ManiobraService,
    public _usuarioService: UsuarioService,
    public _agenciaService: AgenciaService,
    public _navieraService: NavieraService,
    public _transportistaService: TransportistaService,
    public _clienteService: ClienteService,
    public _SolicitudDService: SolicitudService,
    public _buqueService: BuqueService,
    public _viajeService: ViajeService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService,
    private location: Location) { }

    ngOnInit() {
      this.usuarioLogueado = this._usuarioService.usuario;
      if (this.usuarioLogueado.role === 'ADMIN_ROLE') {
        this._agenciaService.getAgencias().subscribe(ag => {this.agencias = ag.agencias; });
      } else {
        this.agencias = this.usuarioLogueado.empresas;
      }
      this._navieraService.getNavieras().subscribe( navieras => { this.navieras = navieras.navieras; });
      this._transportistaService.getTransportistas().subscribe( transportistas => this.transportistas = transportistas.transportistas );
      this.createFormGroup();
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      if (id !== 'nuevo') {
        this.edicion = true;
        this.cargarSolicitud ( id );
      } else {
        this.credito.disable({onlySelf: true});
      }
      this.contenedores.removeAt(0);
    }

  createFormGroup() {
    this.regForm = this.fb.group({
      agencia: ['', [Validators.required]],
      naviera: ['', [Validators.required]],
      viaje: [''],
      noViaje: [''],
      blBooking: [''],
      buque: [''],
      nombreBuque: [''],
      transportistaTemp: [''],
      cliente: ['', [Validators.required]],
      credito: ['', [Validators.required]],
      observaciones: [''],
      rutaBL: [''],
      rutaComprobante: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      facturarA: ['', [Validators.required]],
      rfc: [{value: '', disabled: true}],
      razonSocial: [{value: '', disabled: true}],
      calle: [{value: '', disabled: true}],
      noExterior: [{value: '', disabled: true}],
      noInterior: [{value: '', disabled: true}],
      colonia: [{value: '', disabled: true}],
      municipio: [{value: '', disabled: true}],
      ciudad: [{value: '', disabled: true}],
      estado: [{value: '', disabled: true}],
      correoFac: ['', [Validators.required]],
      cp: [{value: '', disabled: true}],
      maniobraTemp: [''],
      contenedorTemp: [''],
      tipoTemp: [''],
      estadoTemp: [ESTADOS_CONTENEDOR.VACIO_IMPORT],
      patioTemp: [PATIOS.POLIGONO],
      contenedores: this.fb.array([ this.creaContenedor('', '' , '', '' , '', '', '', '') ]),
      _id: [''],
      tipo: ['D'],
      estatus: ['']
    });
  }

  creaContenedor(cont: string, tipo: string, peso: string, maniobra,
    transportista: string, estatus: string, transportista2: string, patio: string): FormGroup {
    return this.fb.group({
      contenedor: [cont],
      tipo: [tipo],
      peso: [peso],
      maniobra: [maniobra],
      transportista: [transportista],
      transportista2: [transportista2],
      estatus: [estatus],
      patio: [patio],
    });
  }

  addContenedor(cont: string, tipo: string, peso: string, maniobra: string,
                transportista: string, estatus: string, transportista2: string, patio: string): void {
    this.contenedores.push(this.creaContenedor(cont, tipo, peso, maniobra, transportista, estatus, transportista2, patio));
  }

  removeContenedor( index: number ) {
    this.contenedores.removeAt(index);
    this.regForm.markAsDirty();
  }

  get _id() {
    return this.regForm.get('_id');
  }

  get estatus() {
    return this.regForm.get('estatus');
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

  get contenedorTemp() {
    return this.regForm.get('contenedorTemp');
  }
  get tipoTemp() {
    return this.regForm.get('tipoTemp');
  }

  get estadoTemp() {
    return this.regForm.get('estadoTemp');
  }

  get patioTemp() {
    return this.regForm.get('patioTemp');
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
    this._SolicitudDService.cargarSolicitud( id ).subscribe( solicitud => {

      this.regForm.controls['_id'].setValue(solicitud._id);
      this.regForm.controls['tipo'].setValue(solicitud.tipo);
      this.regForm.controls['agencia'].setValue(solicitud.agencia);
      this.cargaClientes({value: solicitud.agencia});
      this.regForm.controls['naviera'].setValue(solicitud.naviera);
      this.cargarBuques({value : solicitud.naviera});
      this.regForm.controls['blBooking'].setValue(solicitud.blBooking);
      this.regForm.controls['buque'].setValue(solicitud.buque);
      this.regForm.controls['nombreBuque'].setValue(solicitud.nombreBuque);
      this.cargarViajes({value: solicitud.buque});
      this.regForm.controls['viaje'].setValue(solicitud.viaje);
      this.regForm.controls['noViaje'].setValue(solicitud.noViaje);
      this.cargarContenedores({value: solicitud.viaje});
      this.regForm.controls['credito'].setValue(solicitud.credito);
      this.regForm.controls['cliente'].setValue(solicitud.cliente);
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
      this.regForm.controls['estatus'].setValue(solicitud.estatus);
      solicitud.contenedores.forEach(element => {
          this.addContenedor(element.contenedor, element.tipo, element.peso,
            element.maniobra, element.transportista._id, '',
            element.transportista.razonSocial, element.patio);
      });
      if (solicitud.estatus === 'APROBADA') {
        this.regForm.disable({onlySelf : true});
        this.aprobada = true;
      }

    });
  }

  cargarBuques(event) {
    if (event.value === ID_MELFI) {
      this._buqueService.getBuqueXNaviera( event.value )
      .subscribe( buques => this.buques = buques.buques);
      this.navieraMELFI = true;
      this.nombreBuque.setValue(undefined);
      this.noViaje.setValue(undefined);
    } else {
      this.navieraMELFI = false;
      this.buque.setValue(undefined);
      this.viaje.setValue(undefined);
    }
  }

  cargarViajes(event) {
    if (event.value !== undefined && event.value !== '') {
      this._viajeService.getViajes(null, null, null, event.value )
      .subscribe( res => this.viajes = res.viajes);
    }
  }

  cargaClientes(event) {
    this._clienteService.getClientesEmpresa(event.value)
    .subscribe( cliente => this.clientes = cliente.clientes);

    const reg = this.agencias.find(x => x._id == event.value);
    if (reg) { this.correo.setValue(reg.correo); }
  }


  cargarContenedores(event) {
    if (event.value !== undefined && event.value !== '') {
      this._maniobraService.getManiobrasXViajeImportacion( event.value )
      .subscribe( res => {
        this.contenedoresXViaje = res;
      });
    }
  }



  onChangeCredito( event ) {
    if (event.checked) {
      if (this.rutaComprobante.value === '') { this.rutaComprobante.setValue('..'); }
      this.rutaComprobante.disable({ onlySelf : true});
    } else {
      if (this.rutaComprobante.value === '..') { this.rutaComprobante.setValue(''); }
      this.rutaComprobante.enable({ onlySelf : true});
    }
  }

  onChangeFacturarA( event) {
    switch (event.value) {
      case 'Cliente':
        if (!this.cliente || this.cliente.value === '') {
          swal('Error', 'No ha seleccionado el cliente', 'error');
          this.facturarA.setValue(null);
          return;
        } else {
          const reg = this.clientes.find(x => x._id == this.cliente.value);
          this.rfc.setValue(reg.rfc);
          this.razonSocial.setValue(reg.razonSocial);
          this.calle.setValue(reg.calle);
          this.noExterior.setValue(reg.noExterior);
          this.noInterior.setValue(reg.noInterior);
          this.colonia.setValue(reg.colonia);
          this.municipio.setValue(reg.municipio);
          this.ciudad.setValue(reg.ciudad);
          this.estado.setValue(reg.estado);
          this.cp.setValue(reg.cp);
          this.correoFac.setValue(reg.correoFac);
          if (reg.credito) {
            this.credito.enable({onlySelf : true});
            this.credito.setValue(true);
            this.onChangeCredito({checked: true});
          } else {
            this.credito.disable({onlySelf : true});
            this.credito.setValue(false);
            this.onChangeCredito({checked: false});
          }
        }
        break;
      case 'Agencia Aduanal':
          if (!this.agencia || this.agencia.value === '') {
            swal('Error', 'No ha seleccionado la agencia aduanal','error');
            this.facturarA.setValue(null);
            return;
          } else {
            const reg = this.agencias.find(x => x._id == this.agencia.value);
            this.rfc.setValue(reg.rfc);
            this.razonSocial.setValue(reg.razonSocial);
            this.calle.setValue(reg.calle);
            this.noExterior.setValue(reg.noExterior);
            this.noInterior.setValue(reg.noInterior);
            this.colonia.setValue(reg.colonia);
            this.municipio.setValue(reg.municipio);
            this.ciudad.setValue(reg.ciudad);
            this.estado.setValue(reg.estado);
            this.cp.setValue(reg.cp);
            this.correoFac.setValue(reg.correoFac);
            if (reg.credito) {
              this.credito.enable({onlySelf : true});
              this.credito.setValue(true);
              this.onChangeCredito({checked: true});
            } else {
              this.credito.disable({onlySelf : true});
              this.credito.setValue(false);
              this.onChangeCredito({checked: false});
            }
          }
        break;
    }
  }

  onFilePDFBLSelected(event) {
    this.fileBL = <File> event.target.files[0];
    this.subirBL();
  }

  subirBL() {
    this._subirArchivoService.subirArchivoBucketTemporal(this.fileBL).subscribe(nombreArchivo => {
      this.regForm.get('rutaBL').setValue(nombreArchivo);
      this.regForm.get('rutaBL').markAsDirty();
      this.temporalBL = true;
      this.guardarSolicitud();
    });
  }

  onFilePDFComprobanteSelected(event) {
    this.fileComprobante = <File> event.target.files[0];
    this.subirComprobante();
  }
  ver() {
    console.log(this.rutaComprobante);
  }

  subirComprobante() {
    this._subirArchivoService.subirArchivoBucketTemporal(this.fileComprobante).subscribe(nombreArchivo => {
      this.regForm.get('rutaComprobante').setValue(nombreArchivo);
      this.regForm.get('rutaComprobante').markAsDirty();
      this.temporalComprobante = true;
      this.guardarSolicitud();
    });
  }

  agregarContenedor() {
    if (!this.navieraMELFI && (this.contenedorTemp.value === '' || this.contenedorTemp.value === undefined  )) {
      swal('Faltan datos', 'No ha seleccionado contenedor', 'error');
      return;
    }
    if (this.navieraMELFI && (this.maniobraTemp.value === '' || this.maniobraTemp.value === undefined) ) {
      swal('Faltan datos', 'No ha seleccionado contenedor', 'error');
      return;
    }

    if (this.transportistaTemp.value === '' || this.transportistaTemp.value === undefined  ) {
      swal('Faltan datos', 'No ha seleccionado transportista', 'error');
      return;
    }
    if (this.estadoTemp.value === '' || this.estadoTemp.value === undefined) {
      swal('Faltan datos', 'No ha seleccionado patio destino', 'error');
      return;
    }
    if (this.patioTemp.value === '' || this.patioTemp.value === undefined) {
      swal('Faltan datos', 'No ha seleccionado estado', 'error');
      return;
    }
    let encontrado = false;
    if (this.navieraMELFI) {
      this.contenedores.controls.forEach(m => {
        if ( m.get('contenedor').value === this.maniobraTemp.value.contenedor ) {
          encontrado = true;
        }
      });
    } else {
      this.contenedores.controls.forEach(m => {
        if ( m.get('contenedor').value === this.contenedorTemp ) {
          encontrado = true;
        }
      });
    }
    if (encontrado) {
      swal('Contenedor Duplicado', 'El contenedor que intenta agregar ya se encuentra en la lista.', 'error');
      return;
    }
    if (this.navieraMELFI) {
      this.addContenedor(this.maniobraTemp.value.contenedor, this.maniobraTemp.value.tipo, this.estadoTemp.value,
        this.maniobraTemp.value._id, this.transportistaTemp.value._id, this.maniobraTemp.value.estatus,
        this.transportistaTemp.value.razonSocial, this.patioTemp.value);
      this.maniobraTemp.setValue(null);
    } else {
      this.addContenedor(this.contenedorTemp.value, this.tipoTemp.value, this.estadoTemp.value,
        undefined, this.transportistaTemp.value._id, '',
        this.transportistaTemp.value.razonSocial, this.patioTemp.value);
      this.contenedorTemp.setValue('');
      this.tipoTemp.setValue('');
    }

  }

  cambiaManiobra (event){
    // this.contenedorTemp.setValue(event.value.contenedor);
    this.tipoTemp.setValue(event.value.tipo);
  }

  guardarSolicitud( ) {
    if (this.regForm.valid) {
      this.transportistaTemp.setValue(null);
      this.estadoTemp.setValue(null);
      this.maniobraTemp.setValue(null);
      this._SolicitudDService.guardarSolicitud(this.regForm.getRawValue()).subscribe(res => {
        this.fileBL = null;
        this.fileComprobante = null;
        this.temporalComprobante = false;
        this.temporalBL = false;
        if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value ===  undefined) {
          this.regForm.get('_id').setValue(res._id);
          this.edicion = true;
          this.router.navigate(['/solicitudes/solicitud_descarga', this.regForm.get('_id').value]);
        }
        this.regForm.markAsPristine();
      });
    }
  }

  back() {
    this.location.back();
  }
}

