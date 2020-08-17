import { Component, OnInit, OnDestroy } from '@angular/core';
import { Vigencia } from './vigencia.models';
import { VigenciaService, UsuarioService } from '../../services/service.index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';
import { ROLES } from 'src/app/config/config';
import swal from 'sweetalert';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Usuario } from '../usuarios/usuario.model';
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
  selector: 'app-vigencia',
  templateUrl: './vigencia.component.html',
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
  ],
  styleUrls: ['./vigencia.component.css']
})
export class VigenciaComponent implements OnInit, OnDestroy {

  usuarioLogueado = new Usuario;
  vigencia: Vigencia = new Vigencia();
  regForm: FormGroup;
  url: string;
  act = true;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET );

  constructor(
    public _vigenciaService: VigenciaService,
    public usuarioService: UsuarioService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder  ) {}

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.createFormGroup();

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.cargarVigencia(id);
    } else {
      // tslint:disable-next-line: forin
      for (const control in this.regForm.controls) {
        this.regForm.controls[control.toString()].setValue(undefined);
      }
    }
    this.url = '/vigencias';

    this.socket.on('update-vigencia', function(data: any) {
      if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
      if (data.data._id) {
        this.createFormGroup();
        this.cargarVigencia(data.data._id);
        if (data.data.usuarioMod !== this.usuarioLogueado._id) {
          swal({
            title: 'Actualizado',
            text: 'Otro usuario ha actualizado este vigencia',
            icon: 'info'
          });
        }
      }
      // } else {
      //   this.cargarVigencia(id);
       }
    }.bind(this));

    this.socket.on('delete-vigencia', function() {
      if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
      this.router.navigate(['/vigencias']);
      swal({
        title: 'Eliminado',
        text: 'Se elimino este vigencia por otro usuario',
        icon: 'warning'
      });
      }
    }.bind(this));

  }
  ngOnDestroy() {
    this.socket.removeListener('delete-vigencia');
    this.socket.removeListener('update-vigencia');
    this.socket.removeListener('new-vigencia');
  }

  cargarVigencia(id: string) {
    this._vigenciaService.getVigencia(id).subscribe(res => {
      this.vigencia = res;
      // tslint:disable-next-line: forin
      for (const propiedad in this.vigencia) {
        for (const control in this.regForm.controls) {
          if (propiedad === control.toString()) {
            this.regForm.controls[propiedad].setValue(res[propiedad]);
          }
        }
      }
    });
  }

  get contenedor() {
    return this.regForm.get('contenedor');
  }

  get fManufactura() {
    return this.regForm.get('fManufactura');
  }

  get fVencimiento() {
    return this.regForm.get('fVencimiento');
  }

  get observaciones() {
    return this.regForm.get('observaciones');
  }

  get activo() {
    return this.regForm.get('activo');
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      contenedor: ['', [Validators.required]],
      fManufactura: ['', [Validators.required]],
      fVencimiento: ['', [Validators.required]],
      observaciones: [''],
      activo: [true, [Validators.required]],
      _id: ['']
    });
  }

  guardarVigencia() {
    if (this.regForm.valid) {
      this._vigenciaService.guardarVigencia(this.regForm.value).subscribe(res => {
        if ( this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined ) {
          this.regForm.get('_id').setValue(res._id);
          this.socket.emit('newvigencia', res);
          this.router.navigate(['/vigencias/vigencia', this.regForm.get('_id').value]);
        } else {
          this.socket.emit('updatevigencia', res);
        }
        this.regForm.markAsPristine();
      });
    }
  }

  calculaFVencimiento(fecha) {
    const fEntrada = moment(fecha);
    let hoy = moment();
    let fVencimiento = moment();
    if (fEntrada !== undefined) {
      fVencimiento = fEntrada.add(10, 'y');
    } else {
      fVencimiento = hoy;
    }

    this.fVencimiento.setValue(fVencimiento);
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');
    // this.location.back();
  }

}
