import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Lavado } from '../../../models/lavado.models';
import { ManiobraService } from '../../../services/service.index';
import { Reparacion } from '../../reparaciones/reparacion.models';
import { ReparacionService } from '../../reparaciones/reparacion.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Location } from '@angular/common';
import * as _moment from 'moment';
import { GRADOS_CONTENEDOR_ARRAY } from '../../../config/config';
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
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
  ],
})

export class TerminaLavadoReparacionComponent implements OnInit {
  regForm: FormGroup;
  tiposLavado: Lavado[] = [new Lavado('B', 'Basico'), new Lavado('E', 'Especial')];
  tiposReparaciones: Reparacion[] = [];
  grados = GRADOS_CONTENEDOR_ARRAY;
  id: string;
  url: string;

  constructor(
    public _maniobraService: ManiobraService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _reparacionService: ReparacionService,
    private fb: FormBuilder, private datePipe: DatePipe,
    private location: Location) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.cargarTiposReparaciones();
    this.createFormGroup();
    this.reparaciones.removeAt(0);
    this.cargarManiobra(this.id);
    this.url = '/maniobras';
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      contenedor: [{ value: '', disabled: true }],
      tipo: [{ value: '', disabled: true }],
      cliente: [{ value: '', disabled: true }],
      agencia: [{ value: '', disabled: true }],
      transportista: [{ value: '', disabled: true }],
      camion: [{ value: '', disabled: true }],
      operador: [{ value: '', disabled: true }],
      fLlegada: [{ value: '', disabled: true }],
      hLlegada: [{ value: '', disabled: true }],
      hEntrada: [{ value: '', disabled: true }],
      hSalida: [{ value: '', disabled: true }],
      lavado: [''],
      lavadoObservacion: [''],
      reparaciones: this.fb.array([this.creaReparacion('', '', 0)]),
      reparacionesObservacion: [''],
      fIniLavado: [''],
      hIniLavado: [''],
      hFinLavado: [''],
      fIniReparacion: [''],
      hIniReparacion: [''],
      fFinReparacion: [''],
      hFinReparacion: [''],
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

  removeReparacion(index: number) {
    this.reparaciones.removeAt(index);
  }

  cargarManiobra(id: string) {
    this._maniobraService.getManiobraConIncludes(id).subscribe(maniob => {
      this.regForm.controls['_id'].setValue(maniob.maniobra._id);
      if (maniob.maniobra.agencia) {
        this.regForm.controls['agencia'].setValue(maniob.maniobra.agencia.nombreComercial);
      }
      this.regForm.controls['contenedor'].setValue(maniob.maniobra.contenedor);
      this.regForm.controls['tipo'].setValue(maniob.maniobra.tipo);
      if (maniob.maniobra.cliente) {
        this.regForm.controls['cliente'].setValue(maniob.maniobra.cliente.nombreComercial);
      }
      if (maniob.maniobra.transportista) {
        this.regForm.controls['transportista'].setValue(maniob.maniobra.transportista.nombreComercial);
      }
      if (maniob.maniobra.camion) {
        this.regForm.controls['camion'].setValue(maniob.maniobra.camion.placa);
      }
      if (maniob.maniobra.operador) {
        this.regForm.controls['operador'].setValue(maniob.maniobra.operador.nombre);
      }
      this.regForm.controls['fLlegada'].setValue(maniob.maniobra.fLlegada);
      this.regForm.controls['hLlegada'].setValue(maniob.maniobra.hLlegada);
      this.regForm.controls['hEntrada'].setValue(maniob.maniobra.hEntrada);
      this.regForm.controls['hSalida'].setValue(maniob.maniobra.hSalida);

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
      if (maniob.maniobra.fIniLavado) {
        this.regForm.controls['fIniLavado'].setValue(maniob.maniobra.fIniLavado);
      } else {
        this.regForm.controls['fIniLavado'].setValue(undefined);
      }
      if (maniob.maniobra.hIniLavado) {
        this.regForm.controls['hIniLavado'].setValue(maniob.maniobra.hIniLavado);
      } else {
        this.regForm.controls['hIniLavado'].setValue(undefined);
      }
      if (maniob.maniobra.hFinLavado) {
        this.regForm.controls['hFinLavado'].setValue(maniob.maniobra.hFinLavado);
      } else {
        this.regForm.controls['hFinLavado'].setValue(undefined);
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

      if (maniob.maniobra.fIniReparacion) {
        this.regForm.controls['fIniReparacion'].setValue(maniob.maniobra.fIniReparacion);
      } else {
        this.regForm.controls['fIniReparacion'].setValue(undefined);
      }
      if (maniob.maniobra.hIniReparacion) {
        this.regForm.controls['hIniReparacion'].setValue(maniob.maniobra.hIniReparacion);
      } else {
        this.regForm.controls['hIniReparacion'].setValue(undefined);
      }
      if (maniob.maniobra.fFinReparacion) {
        this.regForm.controls['fFinReparacion'].setValue(maniob.maniobra.fFinReparacion);
      } else {
        this.regForm.controls['fFinReparacion'].setValue(undefined);
      }
      if (maniob.maniobra.hFinReparacion) {
        this.regForm.controls['hFinReparacion'].setValue(maniob.maniobra.hFinReparacion);
      } else {
        this.regForm.controls['hFinReparacion'].setValue(undefined);
      }

      if (maniob.maniobra.grado) {
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

  guardaCambios() {
    if (this.regForm.valid) {
      this._maniobraService.registraFinLavRep(this.regForm.value).subscribe(res => {
        this.regForm.markAsPristine();
      });
    }
  }

  // back() {
  //   if (localStorage.getItem('history')) {
  //     this.url = localStorage.getItem('history')
  //   }
  //   this.router.navigate([this.url]);
  //   localStorage.removeItem('history')
  //   // this.location.back();
  // }

  open(id: string, tipo: string) {

    let navigationExtras: NavigationExtras = {
      queryParams: { 'opcion': tipo }
    };

    var history;
    var array = [];
    //Si tengo algo en localStorage en la variable historyArray lo obtengo
    if (localStorage.getItem('historyArray')) {
      //asigno a mi variable history lo que obtengo de localStorage (historyArray)
      history = JSON.parse(localStorage.getItem('historyArray'));

      //realizo este ciclo para asignar los valores del JSON al Array
      for (var i in history) {
        array.push(history[i]);
      }
    }
    //Agrego mi nueva ruta a donde debo regresar al array
    array.push("/maniobras/maniobra/" + id + "/termina_lavado_reparacion");

    //sobreescribo la variable historyArray de localStorage con el nuevo JSON que incluye ya, la nueva ruta.
    localStorage.setItem('historyArray', JSON.stringify(array));

    //Voy a pagina.
    this.router.navigate(['/fotos', id], navigationExtras);
  }

  back() {
    var history;
    var array = [];
    //Si tengo algo en localStorage en la variable historyArray lo obtengo
    if (localStorage.getItem('historyArray')) {
      //asigno a mi variable history lo que obtengo de localStorage (historyArray)
      history = JSON.parse(localStorage.getItem('historyArray'));

      //realizo este ciclo para asignar los valores del JSON al Array
      for (var i in history) {
        array.push(history[i]);
      }

      //Asigno a mi variable el valor del ultimo elemento del array para saber a donde regresare.
      //pop() elimina del array el ultimo elemento
      this.url = array.pop();

      //Asigno a localStorage (history) el nuevo JSON
      localStorage.setItem('historyArray', JSON.stringify(array));
    }
    localStorage.removeItem('historyArray');
    this.router.navigate([this.url]);
  }
}
