import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Lavado } from '../../../models/lavado.models';
import { ManiobraService } from '../../../services/service.index';
import { Reparacion } from '../../../models/reparacion.models';
import { ReparacionService } from '../../../services/reparacion/reparacion.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';
import { Cliente } from '../../../models/cliente.models';
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

@Component({
  selector: 'app-termina_lavado_reparacion',
  templateUrl: './termina_lavado_reparacion.component.html',
  providers: [DatePipe,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    {provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
  ],
})

export class TerminaLavadoReparacionComponent implements OnInit {
  regForm: FormGroup;
  tiposLavado: Lavado[] = [new Lavado('B', 'Basico'), new Lavado('E', 'Especial')];
  tiposReparaciones: Reparacion[] = [];
  grados: string[] = ['A', 'B', 'C'];
  id: string;
  constructor(
    public _maniobraService: ManiobraService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _reparacionService: ReparacionService,
    private fb: FormBuilder, private datePipe: DatePipe) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.cargarTiposReparaciones();
    this.createFormGroup();
    this.cargarManiobra( this.id );
    this.reparaciones.removeAt(0);

  }
  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      contenedor: [{value: '', disabled: true}],
      tipo: [{value: '', disabled: true}],
      cliente: [{value: '', disabled: true}],
      agencia: [{value: '', disabled: true}],
      transportista: [{value: '', disabled: true}],
      camion: [{value: '', disabled: true}],
      operador: [{value: '', disabled: true}],
      fLlegada: [{value: '', disabled: true}],
      hLlegada: [{value: '', disabled: true}],
      hEntrada: [{value: '', disabled: true}],
      hSalida: [{value: '', disabled: true}],
      lavado: [''],
      lavadoObservacion: [''],
      reparaciones: this.fb.array([ this.creaReparacion('', '', 0) ]),
      reparacionesObservacion: [''],
      fTerminacionLavado: [''],
      hTerminacionLavado: [''],
      fTerminacionReparacion: [''],
      hTerminacionReparacion: [''],
      grado: ['']
    });
  }

  get _id() {
    return this.regForm.get('_id');
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
  get hSalida() {
    return this.regForm.get('hSalida');
  }
  get lavado() {
    return this.regForm.get('lavado');
  }
  get lavadoOperacion() {
    return this.regForm.get('lavadoOperacion');
  }
  get fTerminacionLavado() {
    return this.regForm.get('fTerminacionLavado');
  }
  get hTerminacionLavado() {
    return this.regForm.get('hTerminacionLavado');
  }
  get fTerminacionReparacion() {
    return this.regForm.get('fTerminacionReparacion');
  }
  get hTerminacionReparacion() {
    return this.regForm.get('hTerminacionReparacion');
  }
  get grado() {
    return this.regForm.get('grado');
  }
  get reparaciones() {
    return this.regForm.get('reparaciones') as FormArray;
  }
  get reparacionesObservacion() {
    return this.regForm.get('reparacionesObservacion');
  }

  creaReparacion(id: string, desc: string, costo: number): FormGroup {
    return this.fb.group({
      id: [id, [Validators.required]],
      reparacion: [desc, [Validators.required]],
      costo: [costo, [Validators.required]]
    });
  }

  addReparacion(item): void {
    const rep = this.tiposReparaciones.find(x => x._id === item);
    this.reparaciones.push(this.creaReparacion(rep._id, rep.descripcion, rep.costo));
  }


  removeReparacion( index: number ) {
    this.reparaciones.removeAt(index);
  }

  cargarManiobra( id: string) {

    this._maniobraService.getManiobraConIncludes( id ).subscribe( maniob => {
      //console.log(maniob);
      this.regForm.controls['_id'].setValue(maniob.maniobra._id);
      if (maniob.maniobra.agencia) {
        this.regForm.controls['agencia'].setValue(maniob.maniobra.agencia.razonSocial);
      }

      this.regForm.controls['contenedor'].setValue(maniob.maniobra.contenedor);
      this.regForm.controls['tipo'].setValue(maniob.maniobra.tipo);
      if (maniob.maniobra.cliente) {
        this.regForm.controls['cliente'].setValue(maniob.maniobra.cliente.razonSocial);
      }
      this.regForm.controls['transportista'].setValue(maniob.maniobra.transportista.razonSocial);
      this.regForm.controls['camion'].setValue(maniob.maniobra.camion.placa);
      this.regForm.controls['operador'].setValue(maniob.maniobra.operador.nombre);
      this.regForm.controls['fLlegada'].setValue(maniob.maniobra.fLlegada);
      this.regForm.controls['hLlegada'].setValue(maniob.maniobra.hLlegada);
      this.regForm.controls['hEntrada'].setValue(maniob.maniobra.hEntrada);
      this.regForm.controls['hSalida'].setValue(maniob.maniobra.hSalida);

      if (maniob.maniobra.lavado) {
        this.regForm.controls['lavado'].setValue(maniob.maniobra.lavado);
      } else {
        this.regForm.controls['lavado'].setValue(undefined);
      }

      if (maniob.maniobra.lavadoObservacion){
        this.regForm.controls['lavadoObservacion'].setValue(maniob.maniobra.lavado);
      } else {
        this.regForm.controls['lavadoObservacion'].setValue(undefined);
      }

      if (maniob.maniobra.reparaciones){
        maniob.maniobra.reparaciones.forEach(element => {
          this.reparaciones.push(this.creaReparacion(element.id, element.reparacion, element.costo));
        });
      } else {
        this.regForm.controls['reparaciones'].setValue(undefined);
      }

      if (maniob.maniobra.reparacionesObservacion){
        this.regForm.controls['reparacionesObservacion'].setValue(maniob.maniobra.reparacionesObservacion);
      } else {
        this.regForm.controls['reparacionesObservacion'].setValue(undefined);
      }

      if (maniob.maniobra.grado){
        this.regForm.controls['grado'].setValue(maniob.maniobra.grado);
      } else {
        this.regForm.controls['grado'].setValue(undefined);
      }

    });
  }

cargarTiposReparaciones() {
    this._reparacionService.getReparaciones().subscribe((reparaciones) => {
        this.tiposReparaciones = reparaciones.reparaciones;
    });
  }

guardaCambios() {
    if (this.regForm.valid) {
      this._maniobraService.registraFinLavRep(this.regForm.value).subscribe(res => {
        this.regForm.markAsPristine();
      });
    }
  }
}
