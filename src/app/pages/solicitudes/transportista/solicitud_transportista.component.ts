import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { Maniobra } from '../../../models/maniobra.models';
import { ManiobraService, UsuarioService } from '../../../services/service.index';
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
import { Location } from '@angular/common';
import { RegisterComponent } from '../../register/register.component';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import swal from 'sweetalert';
import * as io from 'socket.io-client';
import { ROLES } from 'src/app/config/config';
@Component({
  // tslint:disable-next-line: component-selector
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
  url: string;
  usuarioLogueado: any;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  constructor(
    public _maniobraService: ManiobraService,
    public _transportistaService: TransportistaService,
    public _agenciaService: AgenciaService,
    public _operadorService: OperadorService,
    public _camionService: CamionService,
    public router: Router,
    private usuarioService: UsuarioService,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this._agenciaService.getAgencias().subscribe(resp => this.agencias = resp.agencias);

    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
      this._transportistaService.getTransportistas().subscribe(resp => this.transportistas = resp.transportistas);
    } else {
      if (this.usuarioLogueado.empresas && this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE) {
        this.transportistas = this.usuarioLogueado.empresas;
        // this.usuarioLogueado.empresas.forEach(empresa => {
        // });
      }
    }
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.createFormGroup();
    this.cargarManiobra(id);
    this.url = '/solicitudes_transportista';

    this.socket.on('update-papeleta', function (data: any) {
      if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) ||
       (data.data.transportista === this.usuarioLogueado.empresas[0]._id && this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE)) {
        if (data.data._id) {
          this.createFormGroup();
          this.cargarManiobra(data.data._id);
          if (data.data.usuarioModifico !== this.usuarioLogueado._id || data.data.usuarioModificado !== undefined) {
            swal({
              title: 'Actualizado',
              text: 'Otro usuario ha actualizado esta asignación',
              icon: 'info'
            });
          }
        }
      }
    }.bind(this));


  }

    // tslint:disable-next-line: use-life-cycle-interface
    ngOnDestroy() {
      this.socket.removeListener('update-papeleta');
    }

  createFormGroup() {
    this.regForm = this.fb.group({
      _id: [''],
      contenedor: [{ value: '', disabled: true }],
      tipo: [{ value: '', disabled: true }],
      cliente: [{ value: '', disabled: true }],
      agencia: [{ value: '', disabled: true }],
      transportista: [{ value: '', disabled: true }],
      camion: ['', [Validators.required]],
      operador: ['', [Validators.required]],
      folio: [{ value: '', disabled: true }],
      peso: [{ value: '', disabled: true }],
      grado: [{ value: '', disabled: true }],
      cargaDescarga: [{ value: '', disabled: true }]
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

  get folio() {
    return this.regForm.get('folio');
  }
  get peso() {
    return this.regForm.get('peso');
  }
  get grado() {
    return this.regForm.get('grado');
  }
  get cargaDescarga() {
    return this.regForm.get('cargaDescarga');
  }


  cargarManiobra(id: string) {
    this._maniobraService.getManiobra(id).subscribe(maniob => {
      this.regForm.controls['_id'].setValue(maniob.maniobra._id);
      this.regForm.controls['agencia'].setValue(maniob.maniobra.agencia);
      this.regForm.controls['contenedor'].setValue(maniob.maniobra.contenedor);
      this.regForm.controls['tipo'].setValue(maniob.maniobra.tipo);
      this.regForm.controls['cliente'].setValue(maniob.maniobra.cliente);
      this.regForm.controls['folio'].setValue(maniob.maniobra.folio);
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
      this.regForm.controls['peso'].setValue(maniob.maniobra.peso);
      this.regForm.controls['grado'].setValue(maniob.maniobra.grado);
      this.regForm.controls['cargaDescarga'].setValue(maniob.maniobra.cargaDescarga);



    });
  }

  cargaOperadores(transportista: string) {
    this._operadorService.getOperadores(transportista, true)
      .subscribe(resp => this.operadores = resp.operadores);
    this.cargaCamiones(transportista);
  }

  cargaCamiones(idTransportista: string) {
    this._camionService.getCamiones(idTransportista)
      .subscribe(resp => this.camiones = resp.camiones);
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');
    // this.location.back();
  }

  guardaCambios() {
    if (this.regForm.valid) {
      this._maniobraService.asignaCamionOperador(this.regForm.value).subscribe(res => {
        this.socket.emit('updatepapeleta', res);
        this.regForm.markAsPristine();
      });
    }
  }


  nuevoCamion(id: string) {
    localStorage.setItem('history', '/solicitud_transportista/' + id);
    this.router.navigate(['/camiones/camion/nuevo']);
  }
  nuevoOperador(id: string) {
    localStorage.setItem('history', '/solicitud_transportista/' + id);
    this.router.navigate(['/operadores/operador/nuevo']);
  }
}
