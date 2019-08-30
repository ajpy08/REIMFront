import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { Maniobra } from '../../../models/maniobra.models';
import { ManiobraService } from '../../../services/service.index';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { Transportista } from '../../../models/transportista.models';
import { TransportistaService } from '../../../services/service.index';
import { Agencia } from '../../../models/agencia.models';
import { AgenciaService } from '../../../services/service.index';
import { Operador } from '../../../models/operador.models';
import { OperadorService } from '../../../services/service.index';
import { Camion } from '../../../models/camion.models';
import { CamionService } from '../../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-solicitud_transportista',
  templateUrl: './solicitud_transportista.component.html',
  providers: [],
})

export class SolicitudTransportistaComponent implements OnInit {
  agencias: Agencia[] = [];
  transportistas: Transportista[] = [];
  operadores: Operador[] = [];
  camiones: Camion[] = [];
  regForm: FormGroup;

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
    this.createFormGroup();
    this.cargarManiobra( id );

  }
  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      contenedor: [{value: '', disabled: true}],
      tipo: [{value: '', disabled: true}],
      cliente: [{value: '', disabled: true}],
      agencia: [{value: '', disabled: true}],
      transportista: [{value: '', disabled: false}],
      camion: ['', [Validators.required]],
      operador: ['' , [Validators.required]],
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

  cargarManiobra( id: string) {
    this._maniobraService.getManiobra( id ).subscribe( maniob => {
      this.regForm.controls['_id'].setValue(maniob.maniobra._id);
      this.regForm.controls['agencia'].setValue(maniob.maniobra.agencia);
      this.regForm.controls['contenedor'].setValue(maniob.maniobra.contenedor);
      this.regForm.controls['tipo'].setValue(maniob.maniobra.tipo);
      this.regForm.controls['cliente'].setValue(maniob.maniobra.cliente);
      if ( maniob.maniobra.transportista ) {
        this.cargaOperadores(maniob.maniobra.transportista);
      }
      this.regForm.controls['transportista'].setValue(maniob.maniobra.transportista);
      this.regForm.controls['camion'].setValue(maniob.maniobra.camion);
      this.regForm.controls['operador'].setValue(maniob.maniobra.operador);

    });
  }

  cargaOperadores( id: string) {
    this._operadorService.getOperadoresTransportista( id, true )
    .subscribe( resp => this.operadores = resp.operadores);
    this.cargaCamiones(id);
  }

  cargaCamiones( id: string ) {
    this._camionService.getCamionesXIdTransportista( id )
    .subscribe(resp => this.camiones = resp.camiones);
  }

  guardaCambios() {
    if (this.regForm.valid) {
      this._maniobraService.asignaCamionOperador(this.regForm.value).subscribe(res => {
        this.regForm.markAsPristine();
        });
      }
  }
}
