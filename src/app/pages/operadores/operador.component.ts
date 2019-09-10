import { Component, OnInit } from '@angular/core';
import { OperadorService, SubirArchivoService, UsuarioService } from '../../services/service.index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Operador } from './operador.models';
import { Transportista } from '../transportistas/transportista.models';
import { TransportistaService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { ROLES } from 'src/app/config/config';
import { Usuario } from '../usuarios/usuario.model';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


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
  selector: 'app-operador',
  templateUrl: './operador.component.html',
  styleUrls: ['./operador.component.css'],
  providers: [{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
              {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
              {provide: MAT_DATE_LOCALE, useValue: 'es-mx' }]
})
export class OperadorComponent implements OnInit {
  tipoFile = '';
  regForm: FormGroup;
  fileFoto: File = null;
  fileFotoTemporal = false;
  fileLicencia: File = null;
  fileLicenciaTemporal = false;
  transportistas: Transportista[] = [];
  operador: Operador = new Operador();
  usuarioLogueado: Usuario;

  constructor(
    public _operadorService: OperadorService,
    public _transportistaService: TransportistaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _subirArchivoService: SubirArchivoService,
    private fb: FormBuilder,
    public _modalUploadService: ModalUploadService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.cargarOperador(id);
    }
    else {
      for (var control in this.regForm.controls) {
        this.regForm.controls[control.toString()].setValue(undefined);
      }
      this.activo.setValue(true);
      if (this.usuarioLogueado.role == ROLES.TRANSPORTISTA_ROLE) {
        this.transportista.setValue(this.usuarioLogueado.empresas[0]._id);
      }
    }

    if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.REIMADMIN_ROLE) {
      this._transportistaService.getTransportistas()
        .subscribe((transportistas) => {
          this.transportistas = transportistas.transportistas;
        });
    } else {
      if(this.usuarioLogueado.role == ROLES.TRANSPORTISTA_ROLE) {
        this.transportistas = this.usuarioLogueado.empresas;
      }
    }
  }

  cargarOperador(id: string) {
    this._operadorService.getOperador(id)
      .subscribe(res => {
        for (var propiedad in this.operador) {
          for (var control in this.regForm.controls) {
            if (propiedad == control.toString()) {
              this.regForm.controls[propiedad].setValue(res[propiedad]);
            }
          }
        }
      });
  }


  get transportista() {
    return this.regForm.get('transportista');
  }

  get nombre() {
    return this.regForm.get('nombre');
  }

  get foto() {
    return this.regForm.get('foto');
  }

  get vigenciaLicencia() {
    return this.regForm.get('vigenciaLicencia');
  }

  get licencia() {
    return this.regForm.get('licencia');
  }

  get fotoLicencia() {
    return this.regForm.get('fotoLicencia');
  }

  get activo() {
    return this.regForm.get('activo');
  }

  get _id() {
    return this.regForm.get('_id');
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      transportista: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      foto: [''],
      vigenciaLicencia: ['', [Validators.required]],
      licencia: ['', [Validators.required, Validators.minLength(5)]],
      fotoLicencia: [''],
      activo: ['', [Validators.required]],
      _id: ['']
    });
  }

  guardarOperador() {
    if (this.regForm.valid) {
      // console.log (this.regForm.value);
      this._operadorService.guardarOperador(this.regForm.value)
        .subscribe(res => {
          this.fileFoto = null;
          this.fileFotoTemporal = false;
          this.fileLicencia = null;
          this.fileLicenciaTemporal = false;
          if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
            this.regForm.get('_id').setValue(res._id);
            this.router.navigate(['/operadores/operador', this.regForm.get('_id').value]);
            
          }
          this.regForm.markAsPristine();
        });
    }
  }

  onFileSelected(event) {
    if (this.tipoFile == 'foto') {
      if (event.target.files[0] != undefined) {
        this.fileFoto = <File>event.target.files[0];
        this.subirArchivo(this.tipoFile);
      }
    } else {
      if (this.tipoFile == 'fotoLicencia') {
        if (event.target.files[0] != undefined) {
          this.fileLicencia = <File>event.target.files[0];
          this.subirArchivo(this.tipoFile);
        }
      } else {
        console.log('No conozco el tipo de archivo para subir')
      }
    }
  }

  subirArchivo(tipo: string) {
    let file: File;
    if (this.fileFoto != null && tipo == 'foto') {
      file = this.fileFoto;
      this.fileFotoTemporal = true;  
    } else {
      if (this.fileLicencia != null && tipo == 'fotoLicencia') {
        file = this.fileLicencia;
        this.fileLicenciaTemporal = true;  
      }
    }    
    this._subirArchivoService.subirArchivoTemporal(file, '')
      .subscribe(nombreArchivo => {
        this.regForm.get(tipo).setValue(nombreArchivo);
        this.regForm.get(tipo).markAsDirty();
        this.guardarOperador();
      });
  }
}
