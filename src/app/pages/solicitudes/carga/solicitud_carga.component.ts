import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Agencia } from '../../../models/agencia.models';
import { AgenciaService } from 'src/app/services/service.index';
import { Usuario } from '../../../models/usuarios.model';
import { UsuarioService } from '../../../services/service.index';
import { Transportista } from '../../../models/transportista.models';
import { TransportistaService } from '../../../services/service.index';
import { Cliente } from '../../../models/cliente.models';
import { ClienteService } from '../../../services/service.index';
import { SolicitudService } from '../../../services/service.index';
import { ModalUploadService } from '../../../components/modal-upload/modal-upload.service';
import { SubirArchivoService } from '../../../services/subirArchivo/subir-archivo.service';

import { PATIOS_ARRAY, PATIOS, ESTADOS_CONTENEDOR, ESTADOS_CONTENEDOR_ARRAY, GRADOS_CONTENEDOR, GRADOS_CONTENEDOR_ARRAY } from '../../../config/config';
import swal from 'sweetalert';

@Component({
  selector: 'app-solicitud-carga',
  templateUrl: './solicitud_carga.component.html',
  styleUrls: []
})

export class SolicitudCargaComponent implements OnInit {
  regForm: FormGroup;
  
  fileComprobante: File = null;
  temporalComprobante = false;
  edicion = false;
  agencias: Agencia[] = [];
  transportistas: Transportista[] = [];
  
  clientes: Cliente[] = [];
  tiposContenedor: string[] = ['20\' DC', '20\' HC', '40\' DC', '40\' HC'];
  listaFacturarA: string[] = ['Agencia Aduanal', 'Cliente'];
  grados = GRADOS_CONTENEDOR_ARRAY;
  estadosContenedor = ESTADOS_CONTENEDOR_ARRAY;
  patios = PATIOS_ARRAY;
  aprobada = false;

  constructor(
    public _usuarioService: UsuarioService,
    public _agenciaService: AgenciaService,
    public _transportistaService: TransportistaService,
    public _clienteService: ClienteService,
    public _SolicitudService: SolicitudService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService) { }

    ngOnInit() {
      this._agenciaService.getAgencias().subscribe(ag => {this.agencias = ag.agencias; });
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
      cliente: ['', [Validators.required]],
      blBooking: ['', [Validators.required]],
      credito: ['', [Validators.required]],
      observaciones: [''],
      rutaComprobante: [''],
      correo: [''],
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
      contenedorTemp:[''],
      tipoTemp:[''],
      gradoTemp: [''],
      transportistaTemp: [''],
      estadoTemp: [ESTADOS_CONTENEDOR.VACIO_IMPORT],
      patioTemp: [PATIOS.POLIGONO],
      contenedores: this.fb.array([ this.creaContenedor('', '' , '', '', '', '', '', '') ]),
      _id: [''],
      tipo: ['C'],
      estatus: ['']
    });
  }

  creaContenedor(tipo: string, peso: string, grado: string, maniobra: string,
    transportista: string, transportista2: string, patio: string, estatus: string): FormGroup {
    return this.fb.group({
      tipo: [tipo],
      peso: [peso],
      grado: [grado],
      transportista: [transportista],
      transportista2: [transportista2],
      patio: [patio],
      maniobra: [maniobra],
      estatus: [estatus],
    });
  }

  addContenedor(tipo: string, peso: string, grado: string, maniobra: string,
    transportista: string, transportista2: string, patio: string, estatus: string): void {
    this.contenedores.push(this.creaContenedor(tipo, peso, grado, maniobra,transportista, transportista2, patio, estatus));
  }

  removeContenedor( index: number ) {
    this.contenedores.removeAt(index);
    this.regForm.markAsDirty();
  }

  get _id() {
    return this.regForm.get('_id');
  }
  get agencia() {
    return this.regForm.get('agencia');
  }
  get cliente() {
    return this.regForm.get('cliente');
  }
  get blBooking() {
    return this.regForm.get('blBooking');
  }
  get observaciones() {
    return this.regForm.get('observaciones');
  }
  get credito() {
    return this.regForm.get('credito');
  }

  get rutaComprobante() {
    return this.regForm.get('rutaComprobante');
  }
  get correo() {
    return this.regForm.get('correo');
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
  get contenedores() {
    return this.regForm.get('contenedores') as FormArray;
  }
  get maniobraTemp() {
    return this.regForm.get('maniobraTemp');
  }

  get transportistaTemp() {
    return this.regForm.get('transportistaTemp');
  }

  get contenedorTemp() {
    return this.regForm.get('contenedorTemp');
  }
  get tipoTemp() {
    return this.regForm.get('tipoTemp');
  }
  get gradoTemp() {
    return this.regForm.get('gradoTemp');
  }
  get estadoTemp() {
    return this.regForm.get('estadoTemp');
  }

  get patioTemp() {
    return this.regForm.get('patioTemp');
  }


  cargarSolicitud( id: string ) {
    this._SolicitudService.cargarSolicitud( id ).subscribe( solicitud => {
      this.regForm.controls['_id'].setValue(solicitud._id);
      this.regForm.controls['tipo'].setValue(solicitud.tipo);
      this.regForm.controls['agencia'].setValue(solicitud.agencia);
      this.cargaClientes({value: solicitud.agencia});
      this.regForm.controls['transportista'].setValue(solicitud.transportista);
      this.regForm.controls['credito'].setValue(solicitud.credito);
      this.regForm.controls['cliente'].setValue(solicitud.cliente);
      this.regForm.controls['blBooking'].setValue(solicitud.blBooking);
      this.regForm.controls['observaciones'].setValue(solicitud.observaciones);
      this.regForm.controls['rutaComprobante'].setValue(solicitud.rutaComprobante);
      this.regForm.controls['correo'].setValue(solicitud.correo);
      this.regForm.controls['correoFac'].setValue(solicitud.correoFacturacion);
      solicitud.contenedores.forEach(element => {
        this.addContenedor(element.tipo, element.estado, element.grado,
                            element.maniobra, element.transportista, 
                            element.transportista.razonSocial, element.patio, '');
      });

      if (solicitud.estatus === 'APROBADA') {
        this.regForm.disable({onlySelf : true});
        this.aprobada = true;
      }
    });
  }


  cargaCliente(event) {
    let cliente = new Cliente();
    cliente = this.clientes.find(x => x._id === event.value);
    if (cliente.credito) {
      this.credito.enable({onlySelf : true});
      this.credito.setValue(true);
    } else {
      this.credito.disable({onlySelf : true});
      this.credito.setValue(false);
    }
    this.correo.setValue(cliente.correo);
    this.correoFac.setValue(cliente.correoFac);
  }

  cargaClientes(event) {
    this._clienteService.getClientesEmpresa(event.value)
    .subscribe( cliente => this.clientes = cliente.clientes);

    const reg = this.agencias.find(x => x._id == event.value);
    if (reg) { this.correo.setValue(reg.correo); }
  }

  agregarContenedor() {
    // if (!this.navieraMELFI && (this.contenedorTemp.value === '' || this.contenedorTemp.value === undefined  )) {
    //   swal('Faltan datos', 'No ha seleccionado contenedor', 'error');
    //   return;
    // }
    // if (this.navieraMELFI && (this.maniobraTemp.value === '' || this.maniobraTemp.value === undefined) ) {
    //   swal('Faltan datos', 'No ha seleccionado contenedor', 'error');
    //   return;
    // }
    if (this.estadoTemp.value === '' || this.estadoTemp.value === undefined) {
      swal('Faltan datos', 'No ha seleccionado patio destino', 'error');
      return;
    }
    if (this.gradoTemp.value === '' || this.gradoTemp.value === undefined) {
      swal('Faltan datos', 'No ha seleccionado grado', 'error');
      return;
    }
    if (this.transportistaTemp.value === '' || this.transportistaTemp.value === undefined  ) {
      swal('Faltan datos', 'No ha seleccionado transportista', 'error');
      return;
    }
    if (this.patioTemp.value === '' || this.patioTemp.value === undefined) {
      swal('Faltan datos', 'No ha seleccionado estado', 'error');
      return;
    }
      this.addContenedor(this.tipoTemp.value, this.estadoTemp.value, this.gradoTemp.value ,
        undefined, this.transportistaTemp.value._id, '',
        this.transportistaTemp.value.razonSocial, this.patioTemp.value);
      this.contenedorTemp.setValue('');
      this.tipoTemp.setValue('');
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
    console.log(event);
    switch (event.value) {
      case 'Cliente':
        if (!this.cliente || this.cliente.value === '') {
          swal('Error', 'No ha seleccionado el cliente','error');
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

  onFilePDFComprobanteSelected(event) {
    this.fileComprobante = <File> event.target.files[0];
    this.subirComprobante();
  }

  subirComprobante() {
    this._subirArchivoService.subirArchivoTemporal(this.fileComprobante, '').subscribe(nombreArchivo => {
      this.regForm.get('rutaComprobante').setValue(nombreArchivo);
      this.regForm.get('rutaComprobante').markAsDirty();
      this.temporalComprobante = true;
      this.guardarSolicitud();
    });
  }
  guardarSolicitud( ) {
    if (this.regForm.valid) {
      this._SolicitudService.guardarSolicitud(this.regForm.value).subscribe(res => {
        this.fileComprobante = null;
        this.temporalComprobante = false;
        if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value ===  undefined) {
          this.regForm.get('_id').setValue(res._id);
          this.edicion = true;
          this.router.navigate(['/solicitud_carga', this.regForm.get('_id').value]);
        }
        this.regForm.markAsPristine();
      });
    }
  }
}
