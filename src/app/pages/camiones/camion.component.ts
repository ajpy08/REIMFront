import { Component, OnInit } from '@angular/core';
import { Camion } from './camion.models';
import { CamionService, SubirArchivoService, OperadorService, UsuarioService } from '../../services/service.index';
import { Transportista } from '../transportistas/transportista.models';
import { TransportistaService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Operador } from '../operadores/operador.models';
import { Usuario } from '../usuarios/usuario.model';
import { ROLES } from "../../config/config";

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Location } from '@angular/common';


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
  selector: 'app-camion',
  templateUrl: './camion.component.html',
  styles: [],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  { provide: MAT_DATE_LOCALE, useValue: 'es-mx' }]
})

export class CamionComponent implements OnInit {
  tipoFile = ''; //preparado por si hay dos tipos de archivos para subir (ahora solo 1)
  transportistas: Transportista[] = [];
  operadores: Operador[] = [];
  camion: Camion = new Camion();
  regForm: FormGroup;
  fileImgTemporal = false;
  file: File = null;
  fileTemporal = false;
  usuarioLogueado = new Usuario;
  bloquearControl: boolean = false;
  url: string;

  constructor(public _camionService: CamionService,
    public _transportistaService: TransportistaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _subirArchivoService: SubirArchivoService,
    private fb: FormBuilder,
    public _modalUploadService: ModalUploadService,
    private serviceOperadores: OperadorService,
    private usuarioService: UsuarioService,
    private location: Location) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.createFormGroup();

    if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.PATIOADMIN_ROLE) {
      this._transportistaService.getTransportistas()
        .subscribe((transportistas) => {
          this.transportistas = transportistas.transportistas;
        });
    } else {
      if (this.usuarioLogueado.role == ROLES.TRANSPORTISTA_ROLE) {
        this.transportistas = this.usuarioLogueado.empresas;
      }
    }

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.cargarCamion(id);
    }
    else {
      for (var control in this.regForm.controls) {
        this.regForm.controls[control.toString()].setValue(undefined);
      }
      if (this.usuarioLogueado.role == ROLES.TRANSPORTISTA_ROLE) {
        this.transportista.setValue(this.usuarioLogueado.empresas[0]._id);
        this.serviceOperadores.getOperadores(this.usuarioLogueado.empresas[0]._id, true).subscribe((operadores) => {
          this.operadores = operadores.operadores;
        });

      }
    }
    this.url = '/camiones';
  }

  cambioTransportista(transportista: string) {
    this.serviceOperadores.getOperadores(transportista, true).subscribe((operadores) => {
      this.operadores = operadores.operadores;
    });
  }

  cargarCamion(id: string) {
    this._camionService.getCamion(id)
      .subscribe(res => {
        this.camion = res;
        // console.log(this.camion)
        this.serviceOperadores.getOperadores(this.camion.transportista.toString(), true).subscribe((operadores) => {
          this.operadores = operadores.operadores;
        });
        for (var propiedad in this.camion) {
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

  get placa() {
    return this.regForm.get('placa');
  }

  get operador() {
    return this.regForm.get('operador');
  }

  get noEconomico() {
    return this.regForm.get('noEconomico');
  }

  get vigenciaSeguro() {
    return this.regForm.get('vigenciaSeguro');
  }

  get pdfSeguro() {
    return this.regForm.get('pdfSeguro');
  }

  get _id() {
    return this.regForm.get('_id');
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      transportista: [''],
      operador: [''],
      placa: ['', [Validators.required, Validators.minLength(6)]],
      noEconomico: ['', [Validators.required, Validators.minLength(2)]],
      vigenciaSeguro: ['', [Validators.required]],
      pdfSeguro: [''],
      _id: ['']
    });
  }

  guardarCamion() {
    if (this.regForm.valid) {
      this._camionService.guardarCamion(this.regForm.value)
        .subscribe(res => {
          this.file = null;
          this.fileTemporal = false;
          if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
            this.regForm.get('_id').setValue(res._id);
            this.router.navigate(['/camiones/camion', this.regForm.get('_id').value]);
          }
          this.regForm.markAsPristine();
        });
    }
  }

  onFileSelected(event) {
    if (this.tipoFile == 'pdfSeguro') {
      if (event.target.files[0] != undefined) {
        this.file = <File>event.target.files[0];
        this.subirArchivo(this.tipoFile);
      }
    } else {
      console.log('No conozco el tipo de archivo para subir')
    }
  }

  subirArchivo(tipo: string) {
    let file: File;
    if (this.file != null && tipo == 'pdfSeguro') {
      file = this.file;
      this.fileTemporal = true;
    }
    this._subirArchivoService.subirArchivoBucketTemporal(file)
      .subscribe(nombreArchivo => {
        this.regForm.get(tipo).setValue(nombreArchivo);
        this.regForm.get(tipo).markAsDirty();
        this.guardarCamion();
      });
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history')
    //this.location.back();
  }
}
