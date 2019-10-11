import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ManiobraService } from '../maniobras/maniobra.service';
import { OperadorService } from '../operadores/operador.service';
import { Operador } from '../operadores/operador.models';
import { Camion } from '../camiones/camion.models';
import { Maniobra } from 'src/app/models/maniobra.models';
import { CamionService } from '../camiones/camion.service';
import { Transportista } from '../transportistas/transportista.models';
import { Agencia } from '../agencias/agencia.models';
import { AgenciaService } from '../agencias/agencia.service';
import { TransportistaService } from 'src/app/services/service.index';
import { Lavado } from 'src/app/models/lavado.models';
import { Reparacion } from '../reparaciones/reparacion.models';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MatAccordion } from '@angular/material';
const moment = _moment;

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

declare var swal: any;

@Component({
  selector: 'app-detalle-maniobra',
  templateUrl: './detalle-maniobra.component.html',
  styleUrls: ['./detalle-maniobra.component.css'],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
  ],
})
export class DetalleManiobraComponent implements OnInit {

  @ViewChild('firstAccordion') firstAccordion: MatAccordion;

  agencias: Agencia[] = [];
  transportistas: Transportista[] = [];
  operadores: Operador[] = [];
  camiones: Camion[] = [];
  tiposLavado: Lavado[] = [new Lavado('B', 'Basico'), new Lavado('E', 'Especial')];
  grados: string[] = ['A', 'B', 'C'];
  tiposReparaciones: Reparacion[] = [];
  regForm: FormGroup;
  maniobra: Maniobra;
  cargando: boolean = true;
  _hLlegada;
  _hEntrada;
  espera;

  constructor(private maniobraService: ManiobraService, public operadorService: OperadorService,
    private agenciaService: AgenciaService, private transportistaService: TransportistaService,
    private camionService: CamionService, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private datePipe: DatePipe) { }

  ngOnInit() {
    this.agenciaService.getAgencias().subscribe(resp => this.agencias = resp.agencias);
    this.transportistaService.getTransportistas().subscribe(resp => this.transportistas = resp.transportistas);
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.createFormGroup();
    this.reparaciones.removeAt(0);
    this.cargarManiobra(id);
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      cargaDescarga: [{ value: '', disabled: true }], //*
      patio: [{ value: '', disabled: true }], //*
      estatus: [{ value: '', disabled: true }], //*
      folio: [{ value: '', disabled: true }], //*
      contenedor: [{ value: '', disabled: true }], //*
      tipo: [{ value: '', disabled: true }],
      peso: [{ value: '', disabled: true }],
      cliente: [],
      agencia: [{ value: '', disabled: true }], //*
      transportista: [{ value: '', disabled: true }, [Validators.required]], //*
      camion: [{ value: '', disabled: true }, [Validators.required]], //*
      operador: [{ value: '', disabled: true }, [Validators.required]], //*
      fLlegada: [{ value: moment(), disabled: true }, [Validators.required]], //*
      hLlegada: [{ value: this.datePipe.transform(new Date(), 'HH:mm'), disabled: true }, [Validators.required]], //*
      hEntrada: [{ value: this.datePipe.transform(new Date(), 'HH:mm'), disabled: true }, [Validators.required]], //*
      hSalida: [{ value: '', disabled: true }],
      hDescarga: [{ value: '', disabled: true }], //*
      descargaAutorizada: [{ value: '', disabled: true }],
      facturaManiobra: [{ value: { value: '', disabled: true }, disabled: true }],
      grado: [{ value: { value: '', disabled: true }, disabled: true }], //*
      lavado: [{ value: '', disabled: true }], //*
      lavadoObservacion: [{ value: '', disabled: true }], //*
      reparaciones: this.fb.array([this.creaReparacion('', '', 0)]), //*
      reparacionesObservacion: [{ value: '', disabled: true }], //*
      mostrarFotosRNaviera: [{ value: '', disabled: false }],
      mostrarFotosRAA: [{ value: '', disabled: false }],
      fIniLavado: [{ value: '', disabled: true }], //*
      hIniLavado: [{ value: '', disabled: true }], //*
      hFinLavado: [{ value: '', disabled: true }], //*
      fIniReparacion: [{ value: '', disabled: true }], //*
      hIniReparacion: [{ value: '', disabled: true }], //*
      fFinReparacion: [{ value: '', disabled: true }], //*
      hFinReparacion: [{ value: '', disabled: true }], //*
      usuarioAlta: [{ value: '', disabled: true }],
      fAlta: [{ value: '', disabled: true }],
    });
  }

  cargarManiobra(id: string) {
    this.cargando = true;
    this.maniobraService.getManiobra(id).subscribe(maniob => {
      this.maniobra = maniob.maniobra;
      console.log(this.maniobra)
      this._hLlegada = moment(maniob.maniobra.hLlegada, 'HH:mm');
      this._hEntrada = moment(maniob.maniobra.hEntrada, 'HH:mm');
      this.espera = moment.duration(this._hEntrada - this._hLlegada).humanize()

      this.regForm.controls['_id'].setValue(maniob.maniobra._id);
      this.regForm.controls['cargaDescarga'].setValue(maniob.maniobra.cargaDescarga);
      this.regForm.controls['patio'].setValue(maniob.maniobra.patio);
      this.regForm.controls['estatus'].setValue(maniob.maniobra.estatus);
      this.regForm.controls['folio'].setValue(maniob.maniobra.folio);
      this.regForm.controls['agencia'].setValue(maniob.maniobra.agencia);
      this.regForm.controls['contenedor'].setValue(maniob.maniobra.contenedor);
      this.regForm.controls['tipo'].setValue(maniob.maniobra.tipo);
      this.regForm.controls['cliente'].setValue(maniob.maniobra.cliente);
      if (maniob.maniobra.transportista) {
        this.cargaOperadores(maniob.maniobra.transportista);
      }
      this.regForm.controls['transportista'].setValue(maniob.maniobra.transportista);
      this.regForm.controls['camion'].setValue(maniob.maniobra.camion);
      this.regForm.controls['operador'].setValue(maniob.maniobra.operador);
      if (maniob.maniobra.fLlegada) {
        this.regForm.controls['fLlegada'].setValue(maniob.maniobra.fLlegada);
      }
      if (maniob.maniobra.hLlegada) {
        this.regForm.controls['hLlegada'].setValue(maniob.maniobra.hLlegada);
      }
      if (maniob.maniobra.hEntrada) {
        this.regForm.controls['hEntrada'].setValue(maniob.maniobra.hEntrada);
      }
      if (maniob.maniobra.lavado) {
        this.regForm.controls['lavado'].setValue(maniob.maniobra.lavado);
      } else {
        this.regForm.controls['lavado'].setValue(undefined);
      }
      if (maniob.maniobra.lavadoObservacion) {
        this.regForm.controls['lavadoObservacion'].setValue(maniob.maniobra.lavado);
      } else {
        this.regForm.controls['lavadoObservacion'].setValue(undefined);
      }
      if (maniob.maniobra.reparaciones) {
        maniob.maniobra.reparaciones.forEach(element => {
          this.reparaciones.push(this.creaReparacion(element.id, element.reparacion, element.costo));
        });
      } else {
        this.regForm.controls['reparaciones'].setValue(undefined);
      }
      if (maniob.maniobra.reparacionesObservacion) {
        this.regForm.controls['reparacionesObservacion'].setValue(maniob.maniobra.reparacionesObservacion);
      } else {
        this.regForm.controls['reparacionesObservacion'].setValue(undefined);
      }

      this.regForm.controls['mostrarFotosRNaviera'].setValue(maniob.maniobra.mostrarFotosRNaviera);
      this.regForm.controls['mostrarFotosRAA'].setValue(maniob.maniobra.mostrarFotosRAA);
    });
    this.cargando = false;
  }

  cargaOperadores(id: string) {
    this.operadorService.getOperadores(id, true)
      .subscribe(resp => this.operadores = resp.operadores);
    this.cargaCamiones(id);
  }

  cargaCamiones(idTransportista: string) {
    this.camionService.getCamiones(idTransportista)
      .subscribe(resp => this.camiones = resp.camiones);
  }

  creaReparacion(id: string, desc: string, costo: number): FormGroup {
    return this.fb.group({
      id: [id, [Validators.required]],
      reparacion: [desc, [Validators.required]],
      costo: [costo, [Validators.required]]
    });
  }

  ponHora() {
    if (this.hEntrada.value === '') {
      this.hEntrada.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }
  }

  ponHoraIniLavado() {
    if (this.hIniLavado.value === undefined || this.hIniLavado.value === '') {
      this.hIniLavado.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }

  }
  ponHoraFinLavado() {
    if (this.hFinLavado.value === undefined || this.hFinLavado.value === '') {
      this.hFinLavado.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }
  }
  ponHoraIniReparacion() {
    if (this.hIniReparacion.value === undefined || this.hIniReparacion.value === '') {
      this.hIniReparacion.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }

  }
  ponHoraFinReparacion() {
    if (this.hFinReparacion.value === undefined || this.hFinReparacion.value === '') {
      this.hFinReparacion.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }
  }

  openAllFirst() {
    this.firstAccordion.openAll();
  }

  habilitaMostrarFotosReparacion(maniobra, event, tipo) {
    // swal({
    //   title: '¿Esta seguro?',
    //   text: 'Esta apunto de deshabilitar a ' + operador.nombre,
    //   icon: 'warning',
    //   buttons: true,
    //   dangerMode: true,
    //   })
    //   .then(borrar => {
    //     if (borrar) {
    this.maniobraService.habilitaDeshabilitaMostrarFotosReparacion(maniobra, event.checked, tipo)
      .subscribe(actualizado => {
        console.log(actualizado)
      });
    // } else {
    //   event.source.checked = !event.checked;
    // }
    // });
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
  get agencia() {
    return this.regForm.get('agencia');
  }
  get transportista() {
    return this.regForm.get('transportista');
  }
  get camion() {
    return this.regForm.get('camion');
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

  get lavado() {
    return this.regForm.get('lavado');
  }
  get lavadoOperacion() {
    return this.regForm.get('lavadoOperacion');
  }
  get reparaciones() {
    return this.regForm.get('reparaciones') as FormArray;
  }
  get reparacionesObservacion() {
    return this.regForm.get('reparacionesObservacion');
  }

  get mostrarFotosReparacion() {
    return this.regForm.get('mostrarFotosReparacion');
  }

  get fIniLavado() {
    return this.regForm.get('fIniLavado');
  }
  get hIniLavado() {
    return this.regForm.get('hIniLavado');
  }
  get hFinLavado() {
    return this.regForm.get('hFinLavado');
  }
  get fIniReparacion() {
    return this.regForm.get('fIniReparacion');
  }
  get hIniReparacion() {
    return this.regForm.get('hIniReparacion');
  }
  get fFinReparacion() {
    return this.regForm.get('fFinReparacion');
  }
  get hFinReparacion() {
    return this.regForm.get('hFinReparacion');
  }
}
