import { Component, OnInit } from '@angular/core';
import { OperadorService, SubirArchivoService } from '../../services/service.index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Operador } from 'src/app/models/operador.models';
import { Transportista } from '../../models/transportista.models';
import { TransportistaService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

// datapiker
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import swal from 'sweetalert';

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
  selector: 'app-operador',
  templateUrl: './operador.component.html',
  styleUrls: ['./operador.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
  ],
})
export class OperadorComponent implements OnInit {
  tipoFile = '';
  regForm: FormGroup;
  fileFoto: File = null;
  fileFotoTemporal = false;
  fileLicencia: File = null;
  fileLicenciaTemporal = false;
  edicion = false;
  transportistas: Transportista[] = [];
  operador: Operador = new Operador();

  constructor(
    public _operadorService: OperadorService,
    public _transportistaService: TransportistaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _subirArchivoService: SubirArchivoService,
    private fb: FormBuilder,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.edicion = true;
      this.cargarOperador(id);
    }
    else {
      for (var control in this.regForm.controls) {
        this.regForm.controls[control.toString()].setValue(undefined);
      }
    }

    this._transportistaService.getTransportistas()
      .subscribe(transportistas => this.transportistas = transportistas.transportistas);
  }

  cargarOperador(id: string) {
    this._operadorService.getOperador(id)
      .subscribe(res => {
        for (var propiedad in this.operador) {
          //console.log(propiedad);
          for (var control in this.regForm.controls) {
            //console.log(control);
            //if( propiedad == control.toString() && res[propiedad] != null && res[propiedad] != undefined) {
            if (propiedad == control.toString()) {
              //console.log(propiedad + ': ' + res[propiedad]);
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
            this.router.navigate(['/operador', this.regForm.get('_id').value]);
            this.edicion = true;
          }
          this.regForm.markAsPristine();
        });
    }
  }

  onFileSelected(event) {
    if (this.tipoFile == 'foto') {
      //console.log('Fue Foto');
      if (event.target.files[0] != undefined) {
        this.fileFoto = <File>event.target.files[0];
        this.subirArchivo(this.tipoFile);
      }
    } else {
      if (this.tipoFile == 'fotoLicencia') {
        //console.log('Fue FotoLicencia');
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
