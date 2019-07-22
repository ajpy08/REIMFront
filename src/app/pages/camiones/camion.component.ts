import { Component, OnInit } from '@angular/core';
import { Camion } from '../../models/camion.models';
import { CamionService, SubirArchivoService, OperadorService } from '../../services/service.index';
import { Transportista } from '../../models/transportista.models';
import { TransportistaService } from '../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

// datapiker
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Operador } from 'src/app/models/operador.models';
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';
// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-camion',
  templateUrl: './camion.component.html',
  styles: [],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
  ],
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
  edicion = false;

  constructor(public _camionService: CamionService,
    public _transportistaService: TransportistaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _subirArchivoService: SubirArchivoService,
    private fb: FormBuilder,
    public _modalUploadService: ModalUploadService,
    private serviceOperadores: OperadorService) {}

  ngOnInit() {
    this.createFormGroup();
    this._transportistaService.getTransportistas()
      .subscribe((transportistas) => {
        this.transportistas = transportistas.transportistas;
      });  

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.edicion = true;
      this.cargarCamion(id);
    }
    else {
      for (var control in this.regForm.controls) {
        this.regForm.controls[control.toString()].setValue(undefined);
      }
      // this.regForm.controls['transportista'].setValue(undefined);
      // this.regForm.controls['placa'].setValue(undefined);
      // this.regForm.controls['noEconomico'].setValue(undefined);
      // this.regForm.controls['vigenciaSeguro'].setValue(undefined);
      // this.regForm.controls['pdfSeguro'].setValue(undefined);
    }
  }

  cambioTransportista( role: string ) {
    this.serviceOperadores.getOperadores().subscribe((operadores) => {
      this.operadores = operadores.operadores;
    });
  }

  cargarCamion(id: string) {
    this._camionService.getCamion(id)
      .subscribe(res => {      
        for (var propiedad in this.camion) {
          //console.log(propiedad);
          for (var control in this.regForm.controls) {
            //console.log(control);
            //if( propiedad == control.toString() && res[propiedad] != null && res[propiedad] != undefined) {
            if( propiedad == control.toString()) {
              console.log(propiedad + ': ' + res[propiedad]);
              this.regForm.controls[propiedad].setValue(res[propiedad]);
             } 
          }                   
        }
        //this.regForm.controls['transportista'].setValue(res.transportista);
        // this.regForm.controls['placa'].setValue(res.placa);
        // this.regForm.controls['noEconomico'].setValue(res.noEconomico);
        //this.regForm.controls['vigenciaSeguro'].setValue(res.vigenciaSeguro);
        //this.regForm.controls['pdfSeguro'].setValue(res.pdfSeguro);
        //this.regForm.controls['_id'].setValue(res._id);
      });
  }

  get transportista() {
    return this.regForm.get('transportista');
  }

  get placa() {
    return this.regForm.get('placa');
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
      transportista: ['', [Validators.required]],
      operador: ['', [Validators.required]],
      placa: ['', [Validators.required, Validators.minLength(7)]],
      noEconomico: ['', [Validators.required, Validators.minLength(2)]],
      vigenciaSeguro: [''],
      pdfSeguro: [''],
      _id: ['']
    });
  }

  guardarCamion() {
    if (this.regForm.valid) {
      console.log (this.regForm.value);
      this._camionService.guardarCamion(this.regForm.value)
        .subscribe(res => {
          // this.fileImg = null;
          // this.fileImgTemporal = false;
          this.file = null;
          this.fileTemporal = false;
          if (this.regForm.get('_id').value === '') {
            this.regForm.get('_id').setValue(res._id);
            this.router.navigate(['/camion', this.regForm.get('_id').value]);
            this.edicion = true;
          }
          this.regForm.markAsPristine();
        });
    }
  }

  onFileSelected(event) {
    // if (this.tipoFile == 'img') {
    //   //console.log('Fue Foto');
    //   this.fileImg = <File>event.target.files[0];
    //   this.subirArchivo(this.tipoFile);
    // } else {
    if (this.tipoFile == 'pdfSeguro') {
      //console.log('Fue pdfSeguro');
      this.file = <File>event.target.files[0];
      this.subirArchivo(this.tipoFile);
    } else {
      console.log('No conozco el tipo de archivo para subir')
    }
    //}
  }

  subirArchivo(tipo: string) {
    let file: File;
    // if (this.fileImg != null) {
    //   file = this.fileImg;
    // } else {
    if (this.file != null) {
      file = this.file;
    }
    // }
    this._subirArchivoService.subirArchivoTemporal(file, '')
      .subscribe(nombreArchivo => {
        this.regForm.get(tipo).setValue(nombreArchivo);
        this.regForm.get(tipo).markAsDirty();
        // this.fileImgTemporal = true;
        this.fileTemporal = true;
        this.guardarCamion();
      });
  }
}
