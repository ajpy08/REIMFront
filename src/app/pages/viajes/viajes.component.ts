import { Component, OnInit } from '@angular/core';
import { Viaje } from './viaje.models';
import { ViajeService } from '../../services/service.index';
import { FormGroup, FormBuilder } from '@angular/forms';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
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
  selector: 'app-viajes',
  templateUrl: './viajes.component.html',
  styles: [],
  providers: [{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  {provide: MAT_DATE_LOCALE, useValue: 'es-mx' }]

})

export class ViajesComponent implements OnInit {
  viajes: any[] = [];
  cargando = false;
  totalRegistros = 0;
  regForm: FormGroup;

  constructor(public _viajeService: ViajeService, private fb: FormBuilder,) { }
  ngOnInit() {
    this.createFormGroup();
    this.viaje.setValue(undefined);
    this.buque.setValue(undefined);
    this.cargarViajes();
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      viaje: [''],
      buque: [''],
      fIniArribo: [moment().subtract(365, 'days')],
      fFinArribo: [moment()],
    });
  }

  get viaje() {
    return this.regForm.get('viaje');
  }
  get buque() {
    return this.regForm.get('buque');
  }
  get fIniArribo() {
    return this.regForm.get('fIniArribo');
  }
  get fFinArribo() {
    return this.regForm.get('fFinArribo');
  }

  cargarViajes() {
    this.cargando = true;
    this._viajeService.getViajes(this.fIniArribo.value ? this.fIniArribo.value.format('DD-MM-YYYY') : '',
    this.fFinArribo.value ? this.fFinArribo.value.format('DD-MM-YYYY') : '' ,
    this.viaje.value,
    this.buque.value)
    .subscribe(res => {
      if (res.ok) {
        this.totalRegistros = res.total;
        this.viajes = res.viajes;
        this.cargando = false;
      }
    });
  }

  filtrarViajes() {
    this.cargarViajes();
  }

  borrarViaje (viaje: Viaje) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a el viaje ' + viaje.viaje,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
      })
      .then(borrar => {
        if (borrar) {
          this._viajeService.borrarViaje(viaje._id)
          .subscribe(borrado => {
            this.cargarViajes();
          });
        }
      });
  }



}
