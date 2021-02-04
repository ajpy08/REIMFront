import { TIPOS_LAVADO_ARRAY } from './../../config/config';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
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
import { TransportistaService, UsuarioService, ReparacionService } from 'src/app/services/service.index';
import { Lavado } from 'src/app/models/lavado.models';
import { Reparacion } from '../reparaciones/reparacion.models';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MatAccordion } from '@angular/material';
import { ROLES, GRADOS_CONTENEDOR_ARRAY, ETAPAS_MANIOBRA_ARRAY } from 'src/app/config/config';
import { Location } from '@angular/common';
import { MantenimientoComponent } from '../maniobras/mantenimientos/mantenimiento.component';
import {MantenimientoService} from '../../services/service.index'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
  tiposLavado = TIPOS_LAVADO_ARRAY;
  grados = GRADOS_CONTENEDOR_ARRAY;
  etapas = ETAPAS_MANIOBRA_ARRAY;
  tiposReparaciones: Reparacion[] = [];
  regForm: FormGroup;
  maniobra: Maniobra;
  cargando = true;
  _hLlegada;
  _hEntrada;
  _hSalida;
  _hDescarga;
  espera;
  url: string;
  listaMantenimientos;

  constructor(private maniobraService: ManiobraService, public operadorService: OperadorService,
    private _mantenimientoService: MantenimientoService,
    private agenciaService: AgenciaService, private transportistaService: TransportistaService,
    private camionService: CamionService, private usuarioService: UsuarioService, private location: Location,
    private activatedRoute: ActivatedRoute, private fb: FormBuilder, private datePipe: DatePipe, private router: Router,
    private _reparacionService: ReparacionService, private _maniobraService: ManiobraService,
    public matDialog: MatDialog) { }

  ngOnInit() {
    if (this.usuarioService.usuario.role !== ROLES.ADMIN_ROLE) {
      if (this.usuarioService.usuario.role !== ROLES.PATIOADMIN_ROLE) {
        this.router.navigate(['/']);
      }
    }
    this.cargarTiposReparaciones();
    this.agenciaService.getAgencias(true).subscribe(resp => this.agencias = resp.agencias);
    this.transportistaService.getTransportistas(true).subscribe(resp => this.transportistas = resp.transportistas);
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.createFormGroup();
    this.reparaciones.removeAt(0);
    this.cargarManiobra(id);

    this.url = '/facturacion-maniobras';
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      cargaDescarga: [{ value: '', disabled: true }],
      patio: [{ value: '', disabled: true }],
      estatus: [''],
      folio: [{ value: '', disabled: true }],
      contenedor: [{ value: '', disabled: true }],
      tipo: [{ value: '', disabled: true }],
      peso: [{ value: '', disabled: true }],
      cliente: [''],
      agencia: [{ value: '', disabled: true }],
      transportista: [{ value: '', disabled: true }, [Validators.required]],
      camion: ['', [Validators.required]],
      operador: ['', [Validators.required]],
      fLlegada: [''],
      hLlegada: [{ value: this.datePipe.transform(new Date(), 'HH:mm') }],
      hEntrada: [{ value: this.datePipe.transform(new Date(), 'HH:mm') }],
      hSalida: [{ value: this.datePipe.transform(new Date(), 'HH:mm') }],
      hDescarga: [{ value: this.datePipe.transform(new Date(), 'HH:mm') }],
      descargaAutorizada: [{ value: '', disabled: true }],
      facturaManiobra: [{ value: { value: '', disabled: true }, disabled: true }],
      grado: [''],
      sello: [''],
      lavado: [''],
      lavadoObservacion: [''],
      reparaciones: this.fb.array([this.creaReparacion('', '', 0)]),
      reparacionesObservacion: [''],
      mostrarFotosRNaviera: [{ value: '', disabled: false }],
      mostrarFotosRAA: [{ value: '', disabled: false }],
      fIniLavado: [''],
      hIniLavado: [''],
      hFinLavado: [''],
      fIniReparacion: [''],
      hIniReparacion: [''],
      fFinReparacion: [''],
      hFinReparacion: [''],
      usuarioAlta: [''],
      fAlta: [''],
    });
  }

  addReparacion(item): void {
    const rep = this.tiposReparaciones.find(x => x._id === item);
    this.reparaciones.push(this.creaReparacion(rep._id, rep.reparacion, rep.costo));
  }

  removeReparacion(index: number) {
    this.reparaciones.removeAt(index);
  }

  cargarTiposReparaciones() {
    this._reparacionService.getReparaciones().subscribe((reparaciones) => {
      this.tiposReparaciones = reparaciones.reparaciones;
    });
  }

  cargarManiobra(id: string) {
    this.cargando = true;
    this.maniobraService.getManiobra(id).subscribe(maniob => {
      this.maniobra = maniob.maniobra;
      this._hLlegada = moment(maniob.maniobra.hLlegada, 'HH:mm');
      this._hEntrada = moment(maniob.maniobra.hEntrada, 'HH:mm');
      this._hDescarga = moment(maniob.maniobra.hDescarga, 'HH:mm');
      this._hSalida = moment(maniob.maniobra.hSalida, 'HH:mm');
      this.espera = moment.duration(this._hEntrada - this._hLlegada).humanize();

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
      if (maniob.maniobra.hSalida) {
        this.regForm.controls['hSalida'].setValue(maniob.maniobra.hSalida);
      }
      if (maniob.maniobra.hDescarga) {
        this.regForm.controls['hDescarga'].setValue(maniob.maniobra.hDescarga);
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
      if (maniob.maniobra.sello) {
        this.regForm.controls['sello'].setValue(maniob.maniobra.sello);
      } else {
        this.regForm.controls['sello'].setValue(undefined);
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
      this.regForm.controls['mostrarFotosRNaviera'].setValue(maniob.maniobra.mostrarFotosRNaviera);
      this.regForm.controls['mostrarFotosRAA'].setValue(maniob.maniobra.mostrarFotosRAA);
      this.cargaMantenimientos(maniob.maniobra._id);
    });
    this.cargando = false;
  }

  cargaOperadores(id: string) {
    this.operadorService.getOperadores(id, true)
      .subscribe(resp => this.operadores = resp.operadores);
    this.cargaCamiones(id);
  }

  cargaCamiones(idTransportista: string) {
    this.camionService.getCamiones(true, idTransportista)
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
    this.maniobraService.habilitaDeshabilitaMostrarFotosReparacion(maniobra, event.checked, tipo)
      .subscribe(actualizado => {
      });
  }

  // back() {
  //   if (localStorage.getItem('history')) {
  //     this.url = localStorage.getItem('history')
  //   }
  //   this.router.navigate([this.url]);
  //   localStorage.removeItem('history')
  //   // this.location.back();
  // }

  guardaCambios() {
    if (this.regForm.valid) {
      this._maniobraService.actualizaDetalleManiobra(this.regForm.value).subscribe(res => {
        this.regForm.markAsPristine();
      });
    }
  }

  open(id: string, tipo: string) {

    const navigationExtras: NavigationExtras = {
      queryParams: { 'opcion': tipo }
    };

    let history;
    const array = [];
    // Si tengo algo en localStorage en la variable historyArray lo obtengo
    if (localStorage.getItem('historyArray')) {
      // asigno a mi variable history lo que obtengo de localStorage (historyArray)
      history = JSON.parse(localStorage.getItem('historyArray'));

      // realizo este ciclo para asignar los valores del JSON al Array
      // tslint:disable-next-line: forin
      for (const i in history) {
        array.push(history[i]);
      }
    }
    // Agrego mi nueva ruta a donde debo regresar al array
    array.push('/maniobras/maniobra/' + id + '/detalle');

    // sobreescribo la variable historyArray de localStorage con el nuevo JSON que incluye ya, la nueva ruta.
    localStorage.setItem('historyArray', JSON.stringify(array));

    // Voy a pagina.
    this.router.navigate(['/fotos', id], navigationExtras);
  }

  back() {
    let history;
    const array = [];
    // Si tengo algo en localStorage en la variable historyArray lo obtengo
    if (localStorage.getItem('historyArray')) {
      // asigno a mi variable history lo que obtengo de localStorage (historyArray)
      history = JSON.parse(localStorage.getItem('historyArray'));

      // realizo este ciclo para asignar los valores del JSON al Array
      // tslint:disable-next-line: forin
      for (const i in history) {
        array.push(history[i]);
      }

      // Asigno a mi variable el valor del ultimo elemento del array para saber a donde regresare.
      // pop() elimina del array el ultimo elemento
      this.url = array.pop();

      // Asigno a localStorage (history) el nuevo JSON
      localStorage.setItem('historyArray', JSON.stringify(array));
    }
    localStorage.removeItem('historyArray');
    this.router.navigate([this.url]);
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
  get sello() {
    return this.regForm.get('sello');
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


  cargaMantenimientos(id:string): void {
    this._mantenimientoService.getMantenimientosxManiobra(id).subscribe(mantenimientos => {
      this.listaMantenimientos = mantenimientos.mantenimientos;
    });

  }
  openDialogMantenimiento(id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {_id:id,maniobra:this.regForm.get('_id').value};
    const dialogRef = this.matDialog.open(MantenimientoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(detalle => {
      if (detalle) {
        this.cargaMantenimientos(this.regForm.get('_id').value);
      }
    });
  }

  removeMantenimiento(id: string) {
    this._mantenimientoService.eliminaMantenimiento(id).subscribe(mantenimientos => {
      this.cargaMantenimientos(this.regForm.get('_id').value);
    });
  }

}
