import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { Maniobra } from '../../../models/maniobra.models';
import { ManiobraService } from '../../../services/service.index';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Transportista } from '../../transportistas/transportista.models';
import { TransportistaService } from '../../../services/service.index';
import { Agencia } from '../../agencias/agencia.models';
import { AgenciaService } from '../../../services/service.index';
import { Operador } from '../../operadores/operador.models';
import { OperadorService } from '../../../services/service.index';
import { Camion } from '../../camiones/camion.models';
import { CamionService } from '../../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { ETAPAS_MANIOBRA } from '../../../config/config';
import { Location } from '@angular/common';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


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

@Component({
  selector: 'app-carga-contenedor',
  templateUrl: './carga_contenedor.component.html',
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
  ],
})

export class CargaContenedorComponent implements OnInit {
  agencias: Agencia[] = [];
  transportistas: Transportista[] = [];
  operadores: Operador[] = [];
  camiones: Camion[] = [];
  contenedores: Maniobra[] = [];
  regForm: FormGroup;
  maniobra: Maniobra;
  mensajeExito = '';
  mensajeError = '';

  contenedoresFiltrados: Observable<Maniobra[]>;

  constructor(
    public _maniobraService: ManiobraService,
    public _transportistaService: TransportistaService,
    public _agenciaService: AgenciaService,
    public _operadorService: OperadorService,
    public _camionService: CamionService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder, private datePipe: DatePipe,
    private location: Location) { }

  ngOnInit() {
    this._maniobraService.getManiobras('D', ETAPAS_MANIOBRA.DISPONIBLE).subscribe(resp => this.contenedores = resp.maniobras);
    this._agenciaService.getAgencias().subscribe(resp => this.agencias = resp.agencias);
    this._transportistaService.getTransportistas().subscribe(resp => this.transportistas = resp.transportistas);
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.maniobra = new Maniobra('', '', '', '', '', '', '', '', '', '', '', '', '', null, '', '', '', null, null, '', null, '');
    this.createFormGroup();
    this.cargarManiobra(id);

    this.contenedoresFiltrados = this.contenedorTemp.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.contenedor),
      map(cont => cont ? this._filter(cont) : this.contenedores.slice())
    );

  }
//   private _filter(value: string): Maniobra[] {
//     const filterValue = value.toLowerCase();
//     let filtrados: Maniobra[] = [];
//     this.contenedores.forEach(element => {
//       if (element.contenedor.toLowerCase().indexOf(filterValue) === 0) {
//         filtrados.push(element);
//       }
//     });
//   return filtrados;
// //    return this.contenedores.contenedor.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
//   }

  private _filter(cont: string): Maniobra[] {
    const filterValue = cont.toLowerCase();

    return this.contenedores.filter(option => option.contenedor.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(maniobra?: Maniobra): string | undefined {
    return maniobra ? maniobra.contenedor + ' | Grado: ' + maniobra.grado + ' | Tamaño:' + maniobra.tipo : undefined;
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      contenedor: [''],
      contenedorTemp: [''],
      tipo: [''],
      grado: [''],
      maniobraAsociada: [''],
      hSalida: [''],
      hDescarga: [''],
      estatus: [{ value: '', disabled: true }],
      folio: [{ value: '', disabled: true }],
      cliente: [{ value: '', disabled: true }],
      agencia: [{ value: '', disabled: true }],
      transportista: [{ value: '', disabled: true }],
      camion: [{ value: '', disabled: true }],
      operador: [{ value: '', disabled: true }],
      fLlegada: [{ value: '', disabled: true }],
      hLlegada: [{ value: '', disabled: true }],
      hEntrada: [{ value: '', disabled: true }],
    });
  }

  get _id() {
    return this.regForm.get('_id');
  }
  get contenedor() {
    return this.regForm.get('contenedor');
  }
  get contenedorTemp() {
    return this.regForm.get('contenedorTemp');
  }
  get tipo() {
    return this.regForm.get('tipo');
  }
  get grado() {
    return this.regForm.get('grado');
  }
  get maniobraAsociada() {
    return this.regForm.get('maniobraAsociada');
  }
  get estatus() {
    return this.regForm.get('estatus');
  }
  get folio() {
    return this.regForm.get('folio');
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
  get hDescarga() {
    return this.regForm.get('hDescarga');
  }
  get hSalida() {
    return this.regForm.get('hSalida');
  }

  cargarManiobra(id: string) {
    this._maniobraService.getManiobra(id).subscribe(maniob => {
      this.maniobra = maniob.maniobra;
      this.regForm.controls['_id'].setValue(maniob.maniobra._id);
      this.regForm.controls['agencia'].setValue(maniob.maniobra.agencia);
      this.regForm.controls['maniobraAsociada'].setValue(maniob.maniobra.maniobraAsociada);
      this.regForm.controls['contenedor'].setValue(maniob.maniobra.contenedor);
      this.regForm.controls['tipo'].setValue(maniob.maniobra.tipo);
      this.regForm.controls['grado'].setValue(maniob.maniobra.grado);
      this.regForm.controls['folio'].setValue(maniob.maniobra.folio);
      this.regForm.controls['cliente'].setValue(maniob.maniobra.cliente);
      this.regForm.controls['hDescarga'].setValue(maniob.maniobra.hDescarga);
      this.regForm.controls['hSalida'].setValue(maniob.maniobra.hSalida);
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

  cargaContenedor(maniobraDisponible) {
    console.log(this.contenedorTemp.value);
    this.contenedor.setValue(this.contenedorTemp.value.contenedor);
    this.tipo.setValue(this.contenedorTemp.value.tipo);
    this.grado.setValue(this.contenedorTemp.value.grado);
    this.maniobraAsociada.setValue(this.contenedorTemp.value._id);
  }

  ponHoraDescarga() {
    if (this.hDescarga.value === undefined || this.hDescarga.value === '') {
      this.hDescarga.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }
  }
  ponHoraSalida() {
    if (this.hSalida.value === undefined || this.hSalida.value === '') {
      this.hSalida.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    }
  }


  guardaCambios() {
    if (this.regForm.valid) {
      this._maniobraService.registraCargaContenedor(this.regForm.value).subscribe(res => {
        this.regForm.markAsPristine();
        this.mensajeExito = 'CONTENEDOR ASIGANDO CON EXITO';
        this.mensajeError = '';
        if (res.estatus !== ETAPAS_MANIOBRA.XCARGAR) {
          this.router.navigate(['/maniobras']);
        }
      }, error => {
        this.mensajeExito = '';
        this.mensajeError = error.error.mensaje;
      });
    }
  }



  back() {
    this.location.back();
  }
}
