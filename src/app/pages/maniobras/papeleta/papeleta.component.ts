import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Maniobra } from '../../../models/maniobra.models';
import { ManiobraService } from '../maniobra.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Location } from '@angular/common';

import * as moment from 'moment';
import { TiposContenedoresService } from '../../tipos-contenedores/tipos-contenedores.service';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import swal from 'sweetalert';
import * as io from 'socket.io-client';

import { ROLES } from 'src/app/config/config';
import { UsuarioService } from '../../../services/service.index';
import { Usuario } from '../../usuarios/usuario.model';

@Component({
  selector: 'app-papeleta',
  templateUrl: './papeleta.component.html',
  styleUrls: ['./papeleta.component.css']
})
export class PapeletaComponent implements OnInit {
  regForm: FormGroup;
  maniobra = new Maniobra();
  id: string;
  propiedades: [];
  url: string;
  usuarioLogueado = new Usuario();
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  constructor(private activateRoute: ActivatedRoute,
    public router: Router,
    private maniobraService: ManiobraService,
    private fb: FormBuilder,
    private location: Location,
    private tipoContenedorService: TiposContenedoresService,
    private usuarioService: UsuarioService,
  ) {
  }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.id = this.activateRoute.snapshot.paramMap.get('id');
    this.cargarManiobra(this.id);

    this.url = '/solicitudes_transportista';

    if (this.maniobra === undefined) {
      this.router.navigate([this.url]);
    }

    this.createFormGroup();


    this.socket.on('update-papeleta', function (data: any) {
      if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) ||
        (data.data.transportista === this.usuarioLogueado.empresas[0]._id && this.usuarioLogueado.role === ROLES.TRANSPORTISTA_ROLE)) {
        if (data.data._id) {
          this.cargarManiobra(data.data._id);
          if (data.data.usuarioModifico !== this.usuarioLogueado._id || data.data.usuarioModificado !== undefined) {
          swal ({
            title: 'Actualizado',
            text: 'Esta papeleta fue actualizada por otro ususario',
            icon: 'warning'
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
      folio: ['', [Validators.required]],
      fAsignacionPapeleta: ['', [Validators.required]],
      fExpiracionPapeleta: ['', [Validators.required, this.validaFechaExpiracion('fExpiracionPapeleta')]],
      // fExpiracionPapeleta: ['', [Validators.required]],
      cargaDescarga: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      grado: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      descripcion: [''],
      codigoISO: [''],
      contenedor: ['', [Validators.required]],
      buque: ['', [Validators.required]],
      viaje: ['', [Validators.required]],
      BL: [''],
      cliente: ['', [Validators.required]],
      patio: ['', [Validators.required]],
      agencia: ['', [Validators.required]],
      transportista: ['', [Validators.required]],
      operador: ['', [Validators.required]],
      placa: ['', [Validators.required]],
      licencia: ['', [Validators.required]],
      noEconomico: ['', [Validators.required]],
    });
  }


  validaFechaExpiracion(controlKey: string) {
    return (control: AbstractControl): { [s: string]: boolean } => {
      // control.parent es el FormGroup
      if (this.regForm) { // en las primeras llamadas control.parent es undefined
        if (control.value !== undefined) {
          const CurrentDate = moment().startOf('day').toISOString();
          const fecha = moment(control.value).endOf('day').toISOString();
          if (fecha <= CurrentDate) {
            return {
              fechaInvalida: true
            };
          }
        }
      }
      return {};
    };
  }

  cargarManiobra(id: string) {
    this.maniobraService.getManiobraConIncludes(id).subscribe((maniobra) => {
      this.tipoContenedorService.getTipoContenedorXTipo(maniobra.maniobra.tipo).subscribe((t) => {
        // console.log(t[0]);
        if (t[0] !== undefined) {
          this.regForm.controls['descripcion'].setValue(t[0].descripcion);
          this.regForm.controls['codigoISO'].setValue(t[0].codigoISO);
        }
      });
      this.regForm.controls['_id'].setValue(maniobra.maniobra._id);
      this.regForm.controls['folio'].setValue(maniobra.maniobra.folio);
      if (maniobra.maniobra.fAsignacionPapeleta) {
        this.regForm.controls['fAsignacionPapeleta'].setValue(maniobra.maniobra.fAsignacionPapeleta);
      } else {
        this.asignaFecha();
      }
      this.regForm.controls['fExpiracionPapeleta'].setValue(maniobra.maniobra.fExpiracionPapeleta);
      this.regForm.controls['cargaDescarga'].setValue(maniobra.maniobra.cargaDescarga);
      this.regForm.controls['peso'].setValue(maniobra.maniobra.peso);
      this.regForm.controls['grado'].setValue(maniobra.maniobra.grado);
      this.regForm.controls['tipo'].setValue(maniobra.maniobra.tipo);
      this.regForm.controls['contenedor'].setValue(maniobra.maniobra.contenedor);
      this.regForm.controls['buque'].setValue(maniobra.maniobra.viaje !== undefined &&
        maniobra.maniobra.viaje.buque.nombre !== undefined ? maniobra.maniobra.viaje.buque.nombre : '');
      this.regForm.controls['viaje'].setValue(maniobra.maniobra.viaje !== undefined ? maniobra.maniobra.viaje.viaje : '');
      this.regForm.controls['BL'].setValue(maniobra.maniobra.solicitud !== undefined ? maniobra.maniobra.solicitud.blBooking : 'DEBE TENER BL/BOOKING');
      this.regForm.controls['cliente'].setValue(maniobra.maniobra.cliente.nombreComercial);
      this.regForm.controls['patio'].setValue(maniobra.maniobra.patio);
      this.regForm.controls['agencia'].setValue(maniobra.maniobra.agencia.nombreComercial);
      this.regForm.controls['transportista'].setValue(maniobra.maniobra.transportista.nombreComercial);
      this.regForm.controls['operador'].setValue(maniobra.maniobra.operador !== undefined ? maniobra.maniobra.operador.nombre : '');
      this.regForm.controls['placa'].setValue(maniobra.maniobra.camion !== undefined ? maniobra.maniobra.camion.placa : '');
      this.regForm.controls['licencia'].setValue(maniobra.maniobra.operador !== undefined ? maniobra.maniobra.operador.licencia : '');
      this.regForm.controls['noEconomico'].setValue(maniobra.maniobra.camion !== undefined ? maniobra.maniobra.camion.noEconomico : '');

      if (maniobra.maniobra.cargaDescarga === 'C') {
        this.regForm.controls['contenedor'].clearValidators();
        this.regForm.controls['contenedor'].updateValueAndValidity();
        this.regForm.controls['buque'].clearValidators();
        this.regForm.controls['buque'].updateValueAndValidity();
        this.regForm.controls['viaje'].clearValidators();
        this.regForm.controls['viaje'].updateValueAndValidity();
      } else {
        this.regForm.controls['grado'].clearValidators();
        this.regForm.controls['grado'].updateValueAndValidity();
      }
      this.regForm.controls['fExpiracionPapeleta'].updateValueAndValidity();
    });
  }

  asignaFecha() {
    this.maniobraService.asignaFecha({ _id: this.id }).subscribe(() => {
      this.cargarManiobra(this.id);
    });
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');
    // this.location.back();
  }

  get _id() {
    return this.regForm.get('_id');
  }
  get folio() {
    return this.regForm.get('folio');
  }
  get fAsignacionPapeleta() {
    return this.regForm.get('fAsignacionPapeleta');
  }
  get fExpiracionPapeleta() {
    return this.regForm.get('fExpiracionPapeleta');
  }
  get cargaDescarga() {
    return this.regForm.get('cargaDescarga');
  }
  get peso() {
    return this.regForm.get('peso');
  }
  get grado() {
    return this.regForm.get('grado');
  }
  get tipo() {
    return this.regForm.get('tipo');
  }
  get descripcion() {
    return this.regForm.get('descripcion');
  }
  get codigoISO() {
    return this.regForm.get('codigoISO');
  }
  get contenedor() {
    return this.regForm.get('contenedor');
  }
  get buque() {
    return this.regForm.get('buque');
  }
  get viaje() {
    return this.regForm.get('viaje');
  }
  get BL() {
    return this.regForm.get('BL');
  }
  get cliente() {
    return this.regForm.get('cliente');
  }
  get patio() {
    return this.regForm.get('patio');
  }
  get agencia() {
    return this.regForm.get('agencia');
  }
  get transportista() {
    return this.regForm.get('transportista');
  }
  get operador() {
    return this.regForm.get('operador');
  }
  get placa() {
    return this.regForm.get('placa');
  }
  get licencia() {
    return this.regForm.get('licencia');
  }
  get noEconomico() {
    return this.regForm.get('noEconomico');
  }
}
