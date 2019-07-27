import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { Maniobra } from '../../models/maniobra.models';
import { ManiobraService } from '../../services/service.index';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Transportista } from '../../models/transportista.models';
import { TransportistaService } from '../../services/service.index';
import { Agencia } from '../../models/agencia.models';
import { AgenciaService } from '../../services/service.index';
import { Operador } from '../../models/operador.models';
import { OperadorService } from '../../services/service.index';
import { Camion } from '../../models/camion.models';
import { CamionService } from '../../services/service.index';

import {MatDatepickerModule} from '@angular/material/datepicker'

import { Router, ActivatedRoute } from '@angular/router';
import { ModalDropzoneService } from '../../components/modal-dropzone/modal-dropzone.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;

 

@Component({
  selector: 'app-llegada',
  templateUrl: './llegada.component.html',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
  ],
})


export class LlegadaComponent implements OnInit {
  agencias: Agencia[] = [];
  transportistas: Transportista[] = [];
  operadores: Operador[] = [];
  camiones: Camion[] = [];
  regForm: FormGroup;
  maniobra: Maniobra;



  constructor(
    public _maniobraService: ManiobraService,
    public _transportistaService: TransportistaService,
    public _agenciaService: AgenciaService,        
    public _operadorService: OperadorService,
    public _camionService: CamionService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder) { }


  ngOnInit() {
    this._agenciaService.getAgencias().subscribe( resp => this.agencias = resp.agencias );
    this._transportistaService.getTransportistas().subscribe( resp => this.transportistas = resp.transportistas );
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.maniobra = new Maniobra('', '', '', '', '', '', '', '', '', '' , '', '', '', null, '', '', '', null, null, '', null, '');
    this.createFormGroup();
    this.cargarManiobra( id );
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      agencia: [''],
      transportista: [''],
      camion: [''],
      operador: [''],
      fLlegada: [new Date()],
      hLlegada: [''],
    });
  }

  get _id() {
    return this.regForm.get('_id');
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

  cargarManiobra( id: string) {
    this._maniobraService.getManiobra( id ).subscribe( maniob => {
      this.maniobra = maniob.maniobra;
      this.regForm.controls['_id'].setValue(maniob.maniobra._id);
      this.regForm.controls['agencia'].setValue(maniob.maniobra.agencia);
      if(maniob.maniobra.transportista) this.cargaOperadores(maniob.maniobra.transportista);
      this.regForm.controls['transportista'].setValue(maniob.maniobra.transportista);
      this.regForm.controls['camion'].setValue(maniob.maniobra.camion);
      this.regForm.controls['operador'].setValue(maniob.maniobra.operador);
    });
  }

  cargaOperadores( id: string) {
    console.log(id);
    this._operadorService.getOperadoresTransportista( id )
    .subscribe( resp => this.operadores = resp.operadores);
    this.cargaCamiones(id);
  }
  
  cargaCamiones( id: string ) {
    this._camionService.getCamionesXIdTransportista( id )
    .subscribe(resp => this.camiones = resp.camiones);
  }

  registraLlegada() {

  }

}
