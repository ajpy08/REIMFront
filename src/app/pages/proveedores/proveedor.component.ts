import { Component, OnInit, OnDestroy } from '@angular/core';
import { Proveedor } from './proveedor.models';
import { ProveedorService } from './proveedor.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../environments/environment';
import * as io from 'socket.io-client';
import { ROLES } from 'src/app/config/config';
import swal from 'sweetalert';
import { Usuario } from '../usuarios/usuario.model';
@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styles: []
})
export class ProveedorComponent implements OnInit, OnDestroy {
  usuarioLogueado = new Usuario;
  proveedor: Proveedor = new Proveedor();
  regForm: FormGroup;
  url: string;
  act = true;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET );

  constructor(
    public _proveedorService: ProveedorService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder  ) {}

  ngOnInit() {
    this.createFormGroup();


    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.cargarProveedor(id);
    } else {
      // tslint:disable-next-line: forin
      for (const control in this.regForm.controls) {
        this.regForm.controls[control.toString()].setValue(undefined);
      }
    }
    this.url = '/proveedores';

    this.socket.on('update-proveedor', function(data: any) {
      if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
      if (data.data._id) {
        this.createFormGroup();
        this.cargarProveedor(data.data._id);
        if (data.data.usuarioMod !== this.usuarioLogueado._id) {
          swal({
            title: 'Actualizado',
            text: 'Otro usuario ha actualizado este proveedor',
            icon: 'info'
          });
        }
      }
      // } else {
      //   this.cargarBuque(id);
       }
    }.bind(this));

    this.socket.on('delete-proveedor', function() {
      if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
      this.router.navigate(['/proveedores']);
      swal({
        title: 'Eliminado',
        text: 'Se elimino este proveedor por otro usuario',
        icon: 'warning'
      });
      }
    }.bind(this));

  }
  ngOnDestroy() {
    this.socket.removeListener('delete-proveedor');
    this.socket.removeListener('update-proveedor');
    this.socket.removeListener('new-proveedor');
  }

  cargarProveedor(id: string) {
    this._proveedorService.getProveedor(id).subscribe(res => {
      this.proveedor = res;
      // tslint:disable-next-line: forin
      for (const propiedad in this.proveedor) {
        for (const control in this.regForm.controls) {
          if (propiedad === control.toString()) {
            this.regForm.controls[propiedad].setValue(res[propiedad]);
          }
        }
      }
    });
  }


  get rfc() {
    return this.regForm.get('rfc');
  }

  get razonSocial() {
    return this.regForm.get('razonSocial');
  }
  get activo() {
    return this.regForm.get('activo');
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      rfc: [''],
      razonSocial: ['', [Validators.required]],
      activo: [true, [Validators.required]],
      _id: ['']
    });
  }

  guardarProveedor() {
    if (this.regForm.valid) {
      this._proveedorService.guardarProveedor(this.regForm.value).subscribe(res => {
        if ( this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined ) {
          this.regForm.get('_id').setValue(res._id);
          this.socket.emit('newproveedor', res);
          this.router.navigate(['/proveedores/proveedor', this.regForm.get('_id').value]);
        } else {
          this.socket.emit('updateproveedor', res);
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
