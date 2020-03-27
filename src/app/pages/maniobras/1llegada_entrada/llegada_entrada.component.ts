import { Component, OnInit } from '@angular/core';
import { Maniobra } from '../../../models/maniobra.models';
import { ManiobraService, TransportistaService, AgenciaService, 
  CamionService, OperadorService, ClienteService, SolicitudService } from '../../../services/service.index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transportista } from '../../transportistas/transportista.models';
import { Cliente } from '../../../models/cliente.models';
import { Agencia } from '../../agencias/agencia.models';
import { Operador } from '../../operadores/operador.models';
import { Camion } from '../../camiones/camion.models';
import { Router, ActivatedRoute } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { ETAPAS_MANIOBRA } from '../../../config/config';
import * as _moment from 'moment';
const moment = _moment;
import { Location } from '@angular/common';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import * as io from 'socket.io-client';

export const MY_FORMATS = {
  parse: {
    dateInput: ['l', 'L'],
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-llegada_entrada',
  templateUrl: './llegada_entrada.component.html',
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
  ],
})

export class LlegadaEntradaComponent implements OnInit {
  agencias: Agencia[] = [];
  clientes: Cliente[] = [];
  transportistas: Transportista[] = [];
  operadores: Operador[] = [];
  camiones: Camion[] = [];
  regForm: FormGroup;
  maniobra: Maniobra;
  mensajeError = '';
  mensajeExito = '';
  url: string;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  constructor(
    private _maniobraService: ManiobraService,
    private _transportistaService: TransportistaService,
    private _agenciaService: AgenciaService,
    private _operadorService: OperadorService,
    private _camionService: CamionService,
    private _clienteService: ClienteService,
    private router: Router,
    private SolicitudService: SolicitudService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private location: Location) { }

  ngOnInit() {
    this._agenciaService.getAgencias().subscribe(resp => this.agencias = resp.agencias);
    this._transportistaService.getTransportistas().subscribe(resp => this.transportistas = resp.transportistas);
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.createFormGroup();
    this.cargarManiobra(id);

    this.url = '/maniobras';
  }
  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      folio: [{ value: '', disabled: true }],
      contenedor: [{ value: '', disabled: true }],
      tipo: [{ value: '', disabled: true }],
      cliente: [{ value: '', disabled: true }],
      blBooking: [{ value: '', disabled: true }],
      agencia: [{ value: '', disabled: true }],
      estatus: [{ value: '', disabled: true }],
      transportista: [''],
      camion: ['', [Validators.required]],
      sello: [''],
      operador: ['', [Validators.required]],
      fLlegada: [moment()],
      hLlegada: [this.datePipe.transform(new Date(), 'HH:mm'), [Validators.required]],
      hEntrada: [''],
    });
  }

  get _id() {
    return this.regForm.get('_id');
  }
  get folio() {
    return this.regForm.get('folio');
  }
  get contenedor() {
    return this.regForm.get('contenedor');
  }
  get tipo() {
    return this.regForm.get('tipo');
  }
  get cliente() {
    return this.regForm.get('cliente');
  }
  get blBooking() {
    return this.regForm.get('blBooking');
  }
  get agencia() {
    return this.regForm.get('agencia');
  }
  get estatus() {
    return this.regForm.get('estatus');
  }
  get transportista() {
    return this.regForm.get('transportista');
  }
  get camion() {
    return this.regForm.get('camion');
  }
  get sello() {
    return this.regForm.get('sello');
  }
  get operador() {
    return this.regForm.get('operador');
  }
  get fLlegada() {
    return this.regForm.get('fLlegada');
  }
  get hLlegada() {
    return this.regForm.get('hLlegada');
  }
  get hEntrada() {
    return this.regForm.get('hEntrada');
  }

  cargarManiobra(id: string) {
    this._maniobraService.getManiobra(id).subscribe(maniob => {
      this.regForm.controls['_id'].setValue(maniob.maniobra._id);
      this.regForm.controls['folio'].setValue(maniob.maniobra.folio);
      this.regForm.controls['agencia'].setValue(maniob.maniobra.agencia);
      if (maniob.maniobra.agencia) {
        this._clienteService.getClientesEmpresa(maniob.maniobra.agencia).subscribe(resp => this.clientes = resp.clientes);
      }

      this.regForm.controls['contenedor'].setValue(maniob.maniobra.contenedor);
      this.regForm.controls['tipo'].setValue(maniob.maniobra.tipo);
      this.regForm.controls['cliente'].setValue(maniob.maniobra.cliente);
      var blBooking = maniob.maniobra.solicitud !== undefined ? maniob.maniobra.solicitud.blBooking : '';
      this.regForm.controls['blBooking'].setValue(blBooking);
      this.regForm.controls['estatus'].setValue(maniob.maniobra.estatus);
      if (maniob.maniobra.transportista) {
        this.cargaOperadores(maniob.maniobra.transportista);
      }
      // this.regForm.controls['transportista'].setValue(maniob.maniobra.transportista);
      // this.regForm.controls['camion'].setValue(maniob.maniobra.camion);
      // this.regForm.controls['operador'].setValue(maniob.maniobra.operador);
      if (maniob.maniobra.transportista) {
        this.regForm.controls['transportista'].setValue(maniob.maniobra.transportista);
      }
      if (maniob.maniobra.camion) {
        this.regForm.controls['camion'].setValue(maniob.maniobra.camion);
      }
      if (maniob.maniobra.operador) {
        this.regForm.controls['operador'].setValue(maniob.maniobra.operador);
      }
      if (maniob.maniobra.fLlegada) {
        this.regForm.controls['fLlegada'].setValue(maniob.maniobra.fLlegada);
      }
      if (maniob.maniobra.hLlegada) {
        this.regForm.controls['hLlegada'].setValue(maniob.maniobra.hLlegada);
      }
      if (maniob.maniobra.hEntrada) {
        this.regForm.controls['hEntrada'].setValue(maniob.maniobra.hEntrada);
      }
      if (maniob.maniobra.sello) {
        this.regForm.controls['sello'].setValue(maniob.maniobra.sello);
      }
    });
  }

  cargaOperadores(id: string) {
    this._operadorService.getOperadores(id, true)
      .subscribe(resp => this.operadores = resp.operadores);
    this.cargaCamiones(id);
  }

  cargaCamiones(idTransportista: string) {
    this._camionService.getCamiones(idTransportista)
      .subscribe(resp => this.camiones = resp.camiones);
  }

  ponHora() {
    if (this.hEntrada.value === '') {
      this.hEntrada.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }
  }

  guardaCambios() {
    if (this.regForm.valid) {
      this.mensajeError = '';
      this.mensajeExito = '';
      this._maniobraService.registraLlegadaEntrada(this.regForm.value).subscribe(res => {
        this.regForm.markAsPristine();
        this.mensajeExito = 'Cambios Realizados con éxito.';
        this.estatus.setValue(res.estatus);
        this.socket.emit('cambiomaniobra', res);
        if (res.estatus === ETAPAS_MANIOBRA.REVISION) {
          
          this.router.navigate([this.url]);
        }
      }, error => {
        this.mensajeError = error.error.mensaje;
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
