import { Component, OnInit, ViewChild } from '@angular/core';
import { Viaje } from './viaje.models';
import { ViajeService } from '../../services/service.index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
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
  cargando: boolean = true;
  totalRegistros = 0;
  regForm: FormGroup;
  pdfTemporal = false;

  displayedColumns = ['actions' , 'viaje', 'buque', 'fArribo' , 'pdfTemporal', 'fVigenciaTemporal', 'anio'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _viajeService: ViajeService, private fb: FormBuilder) { }

  ngOnInit() {

    this.createFormGroup();
    this.viaje.setValue(undefined);
    this.buque.setValue(undefined);
    this.cargarViajes();
  }



 createFormGroup() {
   this.regForm = this.fb.group({
     viaje: [''],
     buque: ['', [Validators.required]],
     fIniArribo: [moment().local().startOf('day').subtract(1, 'year')],
     fFinArribo: [moment().local().startOf('day')],
     anio: [''],
     _id: [''],
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
  get anio() {
    return this.regForm.get('anio');
  }

  get _id(){
    return this.regForm.get('_id');
  }

  cargarViajes() {

    this._viajeService.getViajes(
      this.fIniArribo.value ? this.fIniArribo.value.utc().format('DD-MM-YYYY') : '',
      this.fFinArribo.value ? this.fFinArribo.value.utc().format('DD-MM-YYYY') : '',
      //fecha2 ? fecha2.local().endOf('day') : '' ,
      this.viaje.value,
      this.buque.value)
    .subscribe(res => {
      if (res.ok) {
        this.totalRegistros = res.total;
        this.dataSource = new MatTableDataSource(res.viajes);
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = res.viajes.length;
      }
    });
    this.cargando = false;
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
