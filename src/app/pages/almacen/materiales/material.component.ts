import { UnidadService } from '../../../services/shared/unidades.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Material } from './material.models';
import { ModalUploadService } from '../../../components/modal-upload/modal-upload.service';
import { ROLES, TIPOS_MATERIAL_ARRAY } from 'src/app/config/config';
import { Usuario } from '../../usuarios/usuario.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Location } from '@angular/common';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import * as io from 'socket.io-client';
import swal from 'sweetalert';

import * as _moment from 'moment';
import { MaterialService } from './material.service';
import { UsuarioService } from '../../usuarios/usuario.service';
import { Unidad } from 'src/app/models/unidad.models';
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
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  { provide: MAT_DATE_LOCALE, useValue: 'es-mx' }]
})
export class MaterialComponent implements OnInit {
  regForm: FormGroup;
  material: Material = new Material();
  usuarioLogueado: Usuario;
  url: string;
  unidades: Unidad[] = [];
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);
  tipos = TIPOS_MATERIAL_ARRAY;

  constructor(
    public materialService: MaterialService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public _modalUploadService: ModalUploadService,
    private usuarioService: UsuarioService,
    private location: Location,
    private unidadService: UnidadService
  ) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.createFormGroup();    

    this.unidadService.getUnidades().subscribe(unidades => {
      this.unidades = unidades.unidades;
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.cargarMaterial(id);
    } else {
      // tslint:disable-next-line: forin
      for (const control in this.regForm.controls) {
        this.regForm.controls[control.toString()].setValue(undefined);
      }      

      this.tipo.setValue('I');
      this.minimo.setValue(1);
      this.activo.setValue(true);
    }

    this.url = '/materiales';

    this.socket.on('update-material', function (data: any) {
      if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
        if (data.data._id) {
          this.createFormGroup();
          this.cargarMaterial(data.data._id);
          if (data.data.usuarioMod !== this.usuarioLogueado._id) {
            swal({
              title: 'Actualizado',
              text: 'Otro usuario ha actualizado este material',
              icon: 'info'
            });
          }
        }
      }
    }.bind(this));

    this.socket.on('delete-material', function (data: any) {
      if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
        this.router.navigate(['/materiales']);
        swal({
          title: 'Eliminado',
          text: 'Se elimino este material por otro usuario',
          icon: 'warning'
        });

      }
    }.bind(this));
  }

  ngOnDestroy() {
    this.socket.removeListener('delete-material');
    this.socket.removeListener('update-material');
  }

  cargarMaterial(id: string) {
    this.materialService.getMaterial(id)
      .subscribe(res => {
        // tslint:disable-next-line: forin
        for (const propiedad in this.material) {
          for (const control in this.regForm.controls) {
            if (propiedad === control.toString()) {
              if (res[propiedad].$numberDecimal !== undefined) {
                this.regForm.controls[propiedad].setValue(res[propiedad].$numberDecimal);
              } else {
                this.regForm.controls[propiedad].setValue(res[propiedad]);
              }
            }
          }
        }
      });
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      unidadMedida: ['', [Validators.required]],
      costo: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      activo: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      minimo: ['', [Validators.required]],
      _id: ['']
    });
  }

  guardarMaterial() {
    if (this.regForm.valid) {
      // console.log (this.regForm.value);
      this.materialService.guardarMaterial(this.regForm.value)
        .subscribe(res => {         
          if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
            this.regForm.get('_id').setValue(res._id);
            this.socket.emit('newmaterial', res);
            this.router.navigate(['/materiales/material', this.regForm.get('_id').value]);
          } else {
            this.socket.emit('updatematerial', res);
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
  }

  /* #region Properties */
  get codigo() {
    return this.regForm.get('codigo');
  }

  get descripcion() {
    return this.regForm.get('descripcion');
  }

  get unidadMedida() {
    return this.regForm.get('unidadMedida');
  }

  get costo() {
    return this.regForm.get('costo');
  }

  get precio() {
    return this.regForm.get('precio');
  }

  get activo() {
    return this.regForm.get('activo');
  }

  get tipo() {
    return this.regForm.get('tipo');
  }

  get minimo() {
    return this.regForm.get('minimo');
  }

  get _id() {
    return this.regForm.get('_id');
  }
  /* #endregion */

}
