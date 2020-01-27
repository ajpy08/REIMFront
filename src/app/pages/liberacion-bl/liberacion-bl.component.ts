import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, FormGroupDirective, NgForm } from '@angular/forms';

import swal from 'sweetalert';
import { Location } from '@angular/common';
import { Agencia } from '../agencias/agencia.models';
import { Naviera } from '../navieras/navieras.models';
import { Transportista } from '../transportistas/transportista.models';
import { Cliente } from 'src/app/models/cliente.models';
import { SubirArchivoService, TiposContenedoresService, AgenciaService, NavieraService, UsuarioService, TransportistaService, ClienteService } from 'src/app/services/service.index';
import { GRADOS_CONTENEDOR_ARRAY, ESTADOS_CONTENEDOR, PATIOS_ARRAY, ROLES, PATIOS } from 'src/app/config/config';
import { ActivatedRoute, Router } from '@angular/router';
import { LiberacionBLService } from './liberacion-bl.service';

@Component({
  selector: 'app-liberacion-bl',
  templateUrl: './liberacion-bl.component.html',
  styleUrls: ['./liberacion-bl.component.css']
})
export class LiberacionBLComponent implements OnInit {
  regForm: FormGroup;

  fileComprobante: File = null;
  temporalComprobante = false;
  edicion = false;
  // agencias: Agencia[] = [];
  navieras: Naviera[] = [];
  transportistas: Transportista[] = [];
  clientes: Cliente[] = [];
  tiposContenedor: any[] = [];
  listaFacturarA: string[] = ['Naviera', 'Cliente'];
  grados = GRADOS_CONTENEDOR_ARRAY;
  estadosContenedor = [ESTADOS_CONTENEDOR.VACIO_EXPORT];
  patios = PATIOS_ARRAY;
  aprobada = false;
  usuarioLogueado: any;
  navieraMELFI = true;
  navieraMSC = true;
  url: string;
  navieraCargaSelected;
  constructor(private _tipoContenedorService: TiposContenedoresService,
    public _navieraService: NavieraService,
    private _usuarioService: UsuarioService,
    private _transportistaService: TransportistaService,
    private _clienteService: ClienteService,
    private liberacionService: LiberacionBLService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _subirArchivoService: SubirArchivoService,
    private location: Location) { }

  ngOnInit() {
    this.usuarioLogueado = this._usuarioService.usuario;

    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
      this._navieraService.getNavieras().subscribe(ag => { this.navieras = ag.navieras; this.navieraCargaSelected = this.navieras[0]; });
    } else {
      if (this.usuarioLogueado.empresas) {
        this.usuarioLogueado.empresas.forEach(empresa => {
          this._navieraService.getNaviera(empresa._id).subscribe(ag => { this.navieras.push(ag) });
        });
        this.navieraCargaSelected = this.usuarioLogueado.empresas[0]._id;
        this.cargaClientes({ value: this.navieraCargaSelected });
      }
    }
    // this._navieraService.getNavieras().subscribe(navieras => { this.navieras = navieras.navieras; });
    this._transportistaService.getTransportistas().subscribe(transportistas => this.transportistas = transportistas.transportistas);
    this._tipoContenedorService.getTiposContenedor().subscribe(tipos => this.tiposContenedor = tipos.tiposContenedor);
    this.createFormGroup();
    this.usuarioLogueado = this._usuarioService.usuario;
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id !== 'nuevo') {
      this.edicion = true;
      this.cargaliberacion(id);
    } else {
      this.credito.disable({ onlySelf: true });
    }
    this.contenedores.removeAt(0);

    if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.PATIOADMIN_ROLE) {
      this.url = '/solicitudes/aprobaciones';
    } else if (this.usuarioLogueado.role == ROLES.NAVIERA_ROLE) {
      this.url = '/liberaciones_bl';
    }
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      // agencia: ['', [Validators.required]],
      naviera: ['', [Validators.required]],
      cliente: ['', [Validators.required]],
      blBooking: ['', [Validators.required]],
      credito: ['', [Validators.required]],
      observaciones: [''],
      rutaComprobante: [''],
      correo: [''],
      facturarA: ['', [Validators.required]],
      rfc: [{ value: '', disabled: true }],
      razonSocial: [{ value: '', disabled: true }],
      calle: [{ value: '', disabled: true }],
      noExterior: [{ value: '', disabled: true }],
      noInterior: [{ value: '', disabled: true }],
      colonia: [{ value: '', disabled: true }],
      municipio: [{ value: '', disabled: true }],
      ciudad: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      correoFac: [''],
      cp: [{ value: '', disabled: true }],
      maniobraTemp: [''],
      contenedorTemp: [''],
      tipoTemp: [''],
      gradoTemp: [''],
      transportistaTemp: [''],
      estadoTemp: [ESTADOS_CONTENEDOR.VACIO_EXPORT],
      patioTemp: [PATIOS.POLIGONO],
      contenedores: this.fb.array([this.creaContenedor('', '', '', '', '', '', '', '', '')], { validators: Validators.required }),
      _id: [''],
      cantidad: ['1'],
      tipo: ['C'],
      estatus: ['']
    });
  }

  creaContenedor(tipo: string, peso: string, grado: string, maniobra: string,
    transportista: string, transportista2: string,
    correoTransportista: string, patio: string, estatus: string): FormGroup {
    return this.fb.group({
      tipo: [tipo],
      peso: [peso],
      grado: [grado],
      transportista: [transportista],
      transportista2: [transportista2],
      correoTransportista: [correoTransportista],
      patio: [patio],
      maniobra: [maniobra],
      estatus: [estatus],
    });
  }

  addContenedor(tipo: string, peso: string, grado: string, maniobra: string,
    transportista: string, transportista2: string, correoTransportista: string, patio: string, estatus: string): void {
    this.contenedores.push(this.creaContenedor(tipo, peso, grado, maniobra, transportista, transportista2, correoTransportista, patio, estatus));
  }

  removeContenedor(index: number) {
    this.contenedores.removeAt(index);
    this.regForm.markAsDirty();
  }

  get _id() {
    return this.regForm.get('_id');
  }
  // get agencia() {
  //   return this.regForm.get('agencia');
  // }
  get naviera() {
    return this.regForm.get('naviera');
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
  get cantidad() {
    return this.regForm.get('cantidad');
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


  cargaliberacion(id: string) {
    this.liberacionService.cargarSolicitud(id).subscribe(solicitud => {
      this.regForm.controls['_id'].setValue(solicitud._id);
      this.regForm.controls['tipo'].setValue(solicitud.tipo);
      // this.regForm.controls['agencia'].setValue(solicitud.agencia);
      this.regForm.controls['naviera'].setValue(solicitud.naviera);
      this.regForm.controls['naviera'].setValue(solicitud.naviera);
      this.regForm.controls['blBooking'].setValue(solicitud.blBooking);
      this.regForm.controls['credito'].setValue(solicitud.credito);
      this.regForm.controls['cliente'].setValue(solicitud.cliente);
      this.regForm.controls['observaciones'].setValue(solicitud.observaciones);
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
      this.onChangeCredito({ checked: this.credito });
      solicitud.contenedores.forEach(element => {
        this.addContenedor(element.tipo, element.peso, element.grado,
          element.maniobra, element.transportista,
          element.transportista.nombreComercial, element.transportista.correo, element.patio, '');
      });

      if (solicitud.estatus === 'APROBADA') {
        this.regForm.disable({ onlySelf: true });
        this.aprobada = true;
      }
    });
  }


  cargaCliente(event) {
    let cliente = new Cliente();
    cliente = this.clientes.find(x => x._id === event.value);
    if (cliente.credito) {
      this.credito.enable({ onlySelf: true });
      this.credito.setValue(true);
    } else {
      this.credito.disable({ onlySelf: true });
      this.credito.setValue(false);
    }
    this.correo.setValue(cliente.correo);
    this.correoFac.setValue(cliente.correoFac);
  }

  cargaClientes(event) {
    this._clienteService.getClientesEmpresa(event.value)
      .subscribe(cliente => this.clientes = cliente.clientes);


    const reg = this.navieras.find(x => x._id == event.value);
    if (reg) { this.correo.setValue(reg.correo); }
  }

  agregarContenedor() {
    if (this.tipoTemp.value === '' || this.tipoTemp.value === undefined) {
      swal('Faltan datos', 'No ha seleccionado el tipo de contenedor.', 'error');
      return;
    }
    if (this.estadoTemp.value === '' || this.estadoTemp.value === undefined) {
      swal('Faltan datos', 'No ha seleccionado el estado del contenedor', 'error');
      return;
    }
    if (this.gradoTemp.value === '' || this.gradoTemp.value === undefined) {
      swal('Faltan datos', 'No ha seleccionado grado', 'error');
      return;
    }
    // if (this.transportistaTemp.value === '' || this.transportistaTemp.value === undefined) {
    //   swal('Faltan datos', 'No ha seleccionado transportista', 'error');
    //   return;
    // }
    if (this.patioTemp.value === '' || this.patioTemp.value === undefined) {
      swal('Faltan datos', 'No ha seleccionado estado', 'error');
      return;
    }
    for (let i = 0; i < this.cantidad.value; i++) {

      this.addContenedor(this.tipoTemp.value, this.estadoTemp.value, this.gradoTemp.value,
        undefined, this.transportistaTemp.value._id,
        this.transportistaTemp.value.nombreComercial, this.transportistaTemp.value.correo, this.patioTemp.value, '');
    }
    this.contenedorTemp.setValue('');
    this.tipoTemp.setValue('');



  }

  onChangeCredito(event) {

    if (event.checked) {
      if (this.rutaComprobante.value === '') { this.rutaComprobante.setValue('..'); }
      this.rutaComprobante.disable({ onlySelf: true });
    } else {
      if (this.rutaComprobante.value === '..') { this.rutaComprobante.setValue(''); }
      this.rutaComprobante.enable({ onlySelf: true });
    }
  }

  onChangeFacturarA(event) {
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
          this.correo.setValue(reg.correo);
          this.correoFac.setValue(reg.correoFac);
          if (reg.credito) {
            this.credito.enable({ onlySelf: true });
            this.credito.setValue(true);
            this.onChangeCredito({ checked: true });
          } else {
            this.credito.disable({ onlySelf: true });
            this.credito.setValue(false);
            this.onChangeCredito({ checked: false });
          }
        }
        break;
      // case 'Agencia Aduanal':
      //   if (!this.agencia || this.agencia.value === '') {
      //     swal('Error', 'No ha seleccionado la agencia aduanal', 'error');
      //     this.facturarA.setValue(null);
      //     return;
      //   } else {
      //     const reg = this.agencias.find(x => x._id == this.agencia.value);
      //     this.rfc.setValue(reg.rfc);
      //     this.razonSocial.setValue(reg.razonSocial);
      //     this.calle.setValue(reg.calle);
      //     this.noExterior.setValue(reg.noExterior);
      //     this.noInterior.setValue(reg.noInterior);
      //     this.colonia.setValue(reg.colonia);
      //     this.municipio.setValue(reg.municipio);
      //     this.ciudad.setValue(reg.ciudad);
      //     this.estado.setValue(reg.estado);
      //     this.cp.setValue(reg.cp);
      //     this.correo.setValue(reg.correo);
      //     this.correoFac.setValue(reg.correoFac);
      //     if (reg.credito) {
      //       this.credito.enable({ onlySelf: true });
      //       this.credito.setValue(true);
      //       this.onChangeCredito({ checked: true });
      //     } else {
      //       this.credito.disable({ onlySelf: true });
      //       this.credito.setValue(false);
      //       this.onChangeCredito({ checked: false });
      //     }
      //   }
      //   break;
      case 'Naviera':
        if (!this.naviera || this.naviera.value === '') {
          swal('Error', 'No ha seleccionado la naviera', 'error');
          this.facturarA.setValue(null);
          return;
        } else {
          const reg = this.navieras.find(x => x._id == this.naviera.value);
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
          this.correo.setValue(reg.correo);
          this.correoFac.setValue(reg.correoFac);
          if (reg.credito) {
            this.credito.enable({ onlySelf: true });
            this.credito.setValue(true);
            this.onChangeCredito({ checked: true });
          } else {
            this.credito.disable({ onlySelf: true });
            this.credito.setValue(false);
            this.onChangeCredito({ checked: false });
          }
        }
    }
  }

  onFilePDFComprobanteSelected(event) {
    this.fileComprobante = <File>event.target.files[0];
    this.subirComprobante();
  }

  subirComprobante() {
    this._subirArchivoService.subirArchivoBucketTemporal(this.fileComprobante).subscribe(nombreArchivo => {
      this.regForm.get('rutaComprobante').setValue(nombreArchivo);
      this.regForm.get('rutaComprobante').markAsDirty();
      this.temporalComprobante = true;
      this.guardarSolicitud();
    });
  }

  guardarSolicitud() {
    if (this.regForm.valid) {
      this.transportistaTemp.setValue(null);
      this.estadoTemp.setValue(null);
      this.maniobraTemp.setValue(null);
      this.liberacionService.guardarliberacion(this.regForm.getRawValue()).subscribe(res => {
        this.fileComprobante = null;
        this.temporalComprobante = false;
        if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
          this.regForm.get('_id').setValue(res._id);
          this.edicion = true;
          this.router.navigate(['/liberacion_bl', this.regForm.get('_id').value]);
        }
        this.regForm.markAsPristine();
      });
    }
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history')
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history')
    // this.location.back();
  }

}
