import { Component, OnInit, OnDestroy } from '@angular/core';
import { Buque } from './buques.models';
import { BuqueService, NavieraService, UsuarioService } from '../../services/service.index';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Naviera } from 'src/app/pages/navieras/navieras.models';
import { Location } from '@angular/common';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';
import { ROLES } from 'src/app/config/config';
import swal from 'sweetalert';
import { Usuario } from '../usuarios/usuario.model';
@Component({
  selector: 'app-buque',
  templateUrl: './buque.component.html',
  styles: []
})
export class BuqueComponent implements OnInit, OnDestroy {
  usuarioLogueado = new Usuario;
  buque: Buque = new Buque();
  navieras: Naviera[] = [];
  regForm: FormGroup;
  url: string;
  act = true;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET );

  constructor(
    public _buqueService: BuqueService,
    public _navieraService: NavieraService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private location: Location
  ) {}

  ngOnInit() {
    this.createFormGroup();
    this._navieraService.getNavieras(true).subscribe(navieras => {
      this.navieras = navieras.navieras;
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.cargarBuque(id);
    } else {
      // tslint:disable-next-line: forin
      for (const control in this.regForm.controls) {
        this.regForm.controls[control.toString()].setValue(undefined);
      }
    }
    this.url = '/buques';

    this.socket.on('update-buque', function(data: any) {
      if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
      if (data.data._id) {
        this.createFormGroup();
        this.cargarBuque(data.data._id);
        if (data.data.usuarioMod !== this.usuarioLogueado._id) {
          swal({
            title: 'Actualizado',
            text: 'Otro usuario ha actualizado este buque',
            icon: 'info'
          });
        }
      }
      // } else {
      //   this.cargarBuque(id);
       }
    }.bind(this));

    this.socket.on('delete-buque', function(data: any) {
      if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
      this.router.navigate(['/buques']);
      swal({
        title: 'Eliminado',
        text: 'Se elimino este buque por otro usuario',
        icon: 'warning'
      });
      }
    }.bind(this));

  }
  ngOnDestroy() {
    this.socket.removeListener('delete-buque');
    this.socket.removeListener('update-buque');
    this.socket.removeListener('new-buque');
  }

  cargarBuque(id: string) {
    this._buqueService.getBuque(id).subscribe(res => {
      this.buque = res;
      // tslint:disable-next-line: forin
      for (const propiedad in this.buque) {
        for (const control in this.regForm.controls) {
          if (propiedad === control.toString()) {
            this.regForm.controls[propiedad].setValue(res[propiedad]);
          }
        }
      }
    });
  }

  get naviera() {
    return this.regForm.get('naviera');
  }

  get nombre() {
    return this.regForm.get('nombre');
  }
  get activo() {
    return this.regForm.get('activo');
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      naviera: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      activo: [true, [Validators.required]],
      _id: ['']
    });
  }

  guardarBuque() {
    if (this.regForm.valid) {
      this._buqueService.guardarBuque(this.regForm.value).subscribe(res => {
        if ( this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined ) {
          this.regForm.get('_id').setValue(res._id);
          this.socket.emit('newbuque', res);
          this.router.navigate(['/buques/buque', this.regForm.get('_id').value]);
        } else {
          this.socket.emit('updatebuque', res);
        }
        this.regForm.markAsPristine();
      });
    }
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
