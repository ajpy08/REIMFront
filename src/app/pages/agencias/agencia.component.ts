import { Component, OnInit } from '@angular/core';
import { AgenciaService, SubirArchivoService } from '../../services/service.index';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Location } from '@angular/common';
import swal from 'sweetalert';

@Component({
  selector: 'app-agencia',
  templateUrl: './agencia.component.html',
  styles: []
})

export class AgenciaComponent implements OnInit {
  tipoFile = '';
  regForm: FormGroup;
  fileImg: File = null;
  fileImgTemporal = false;
  file: File = null;
  fileTemporal = false;
  act = true;
  url: string;


  constructor(public _agenciaService: AgenciaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _subirArchivoService: SubirArchivoService,
    private fb: FormBuilder,
    public _modalUploadService: ModalUploadService,
    private location: Location) {
  }

  ngOnInit() {
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.cargarAgencia(id);
    } else {
      this.regForm.controls['noInterior'].setValue(undefined);
      this.regForm.controls['noExterior'].setValue(undefined);
    }
    this.url = '/agencias';
    if (this.correoF) {
      this.correoF.removeAt(0);
    }
    if (this.correoFacturacion) {
      this.correoFacturacion.removeAt(0);
    }
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      razonSocial: ['', [Validators.required, Validators.minLength(5)]],
      nombreComercial: ['', [Validators.required]],
      // rfc: ['', [Validators.required, Validators.minLength(12)]],
      rfc: [''],
      calle: [''],
      noExterior: [''],
      noInterior: [''],
      colonia: [''],
      municipio: [''],
      ciudad: [''],
      estado: ['', [Validators.required]],
      cp: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      formatoR1: [''],
      correo: ['', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')],
      correotem: ['', [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      correotemFac: ['', [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      correoF: this.fb.array([this.agregarArray('')], { validators: Validators.required, updateOn: 'blur' }),
      correoFacturacion: this.fb.array([this.agregarFArray('')], { validators: Validators.required, updateOn: 'blur' }),
      correoFac: ['', Validators.email],
      credito: [false, [Validators.required]],
      img: [''],
      activo: [true, [Validators.required]],
      patente: ['', [Validators.required]],
      _id: ['']
    });
  }

  agregarArray(correoO: String): FormGroup {
    return this.fb.group({
      correoO: [correoO]
    });
  }
  agregarFArray(correoFact: String): FormGroup {
    return this.fb.group({
      correoFact: [correoFact]
    });
  }

  addContenedor(correoO: string): void {

    let error = false;
    if (correoO === '') {
      this.correo.disable({ emitEvent: true });
      swal('Error al Agregar', 'El campo Correo Operativo no puede estar Vacio', 'error');
    } else if (this.correoF.controls.length === 0) {
      this.correoF.push(this.agregarArray(correoO));
    } else if (this.correoF.controls) {
      this.correoF.controls.forEach(c => {
        if (this.correotem.value === c.value.correoO) {
          if (error === false) {
            swal('Error al agregar', 'El correo ' + this.correotem.value + ' ya se encuentra registrado en la lista', 'error');
            error = true;
            return false;
          }
        }
      });
      if (!error) {
        this.correoF.push(this.agregarArray(correoO));
      }
    }
  }

  addFContenedor(correoFact: string): void {

    let error = false;
    if (correoFact === '') {
      this.correo.disable({ emitEvent: true });
      swal('Error al Agregar', 'El campo Correo Facturacion no puede estar Vacio', 'error');
    } else if (this.correoFacturacion.controls.length === 0) {
      this.correoFacturacion.push(this.agregarFArray(correoFact));
    } else if (this.correoFacturacion.controls) {
      this.correoFacturacion.controls.forEach(c => {
        if (this.correotemFac.value === c.value.correoFact) {
          if (error === false) {
            swal('Error al agregar', 'El correo ' + this.correotemFac.value + ' ya se encuentra registrado en la lista', 'error');
            error = true;
            return false;
          }
        }
      });
      if (!error) {
        this.correoFacturacion.push(this.agregarFArray(correoFact));
      }
    }
  }

  quitar(indice: number) {
    this.correoF.removeAt(indice);
  }
  quitarF(indice: number) {
    this.correoFacturacion.removeAt(indice);
  }


  get razonSocial() {
    return this.regForm.get('razonSocial');
  }
  get nombreComercial() {
    return this.regForm.get('nombreComercial');
  }
  get rfc() {
    return this.regForm.get('rfc');
  }
  get calle() {
    return this.regForm.get('calle');
  }
  get numeroExterior() {
    return this.regForm.get('noExterior');
  }
  get numeroInterior() {
    return this.regForm.get('noInterior');
  }
  get colonia() {
    return this.regForm.get('colonia');
  }
  get municipioDelegacion() {
    return this.regForm.get('municipio');
  }
  get ciudad() {
    return this.regForm.get('ciudad');
  }
  get estado() {
    return this.regForm.get('estado');
  }
  get cp() {
    return this.regForm.get('cp');
  }
  get formatoR1() {
    return this.regForm.get('formatoR1');
  }
  get correo() {
    return this.regForm.get('correo');
  }
  get correoF() {
    return this.regForm.get('correoF') as FormArray;
  }
  get correoFacturacion() {
    return this.regForm.get('correoFacturacion') as FormArray;
  }
  get correotem() {
    return this.regForm.get('correotem');
  }
  get correotemFac() {
    return this.regForm.get('correotemFac');
  }
  get correoFac() {
    return this.regForm.get('correoFac');
  }
  get credito() {
    return this.regForm.get('credito');
  }
  get img() {
    return this.regForm.get('img');
  }
  get patente() {
    return this.regForm.get('patente');
  }
  get activo() {
    return this.regForm.get('activo');
  }
  get _id() {
    return this.regForm.get('_id');
  }

  cargarAgencia(id: string) {
    this._agenciaService.getAgencia(id)
      .subscribe(res => {
        this.regForm.controls['razonSocial'].setValue(res.razonSocial);
        this.regForm.controls['nombreComercial'].setValue(res.nombreComercial);
        this.regForm.controls['rfc'].setValue(res.rfc);
        this.regForm.controls['calle'].setValue(res.calle);
        this.regForm.controls['noExterior'].setValue(res.noExterior);
        this.regForm.controls['noInterior'].setValue(res.noInterior);
        this.regForm.controls['colonia'].setValue(res.colonia);
        this.regForm.controls['municipio'].setValue(res.municipio);
        this.regForm.controls['ciudad'].setValue(res.ciudad);
        this.regForm.controls['estado'].setValue(res.estado);
        this.regForm.controls['cp'].setValue(res.cp);
        this.regForm.controls['formatoR1'].setValue(res.formatoR1);

        if (res.correo !== '' && res.correo !== undefined && res.correo !== null) {
          const correoArray = res.correo.split(',');
          correoArray.forEach(c => {
            this.addContenedor(c);
          });
        }
        if (res.correoFac !== '' && res.correoFac !== undefined && res.correoFac !== null) {
          const correoFArray = res.correoFac.split(',');
          correoFArray.forEach(c => {
            this.addFContenedor(c);
          });
        }
        // this.regForm.controls['correo'].setValue(res.correo);
        // this.regForm.controls['correoFac'].setValue(res.correoFac);
        this.regForm.controls['credito'].setValue(res.credito);
        this.regForm.controls['img'].setValue(res.img);
        this.regForm.controls['patente'].setValue(res.patente);
        this.regForm.controls['activo'].setValue(res.activo);
        this.regForm.controls['_id'].setValue(res._id);
      });
  }

  guardarAgencia() {
    if (this.regForm.valid) {

      let correos = '';
      this.regForm.controls.correoF.value.forEach(correo => {
        correos += correo.correoO + ',';
      });
      correos = correos.slice(0, -1);

      this.correotem.setValue('');
      this.correo.setValue(correos);

      let correoFactu = '';
      this.regForm.controls.correoFacturacion.value.forEach(cf => {
        correoFactu += cf.correoFact + ',';
      });

      correoFactu = correoFactu.slice(0, -1);
      this.correotemFac.setValue('');
      this.correoFac.setValue(correoFactu);
      
      // console.log (this.regForm.value);
      this._agenciaService.guardarAgencia(this.regForm.value)
        .subscribe(res => {
          this.fileImg = null;
          this.fileImgTemporal = false;
          this.file = null;
          this.fileTemporal = false;
          if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
            this.regForm.get('_id').setValue(res._id);
            this.router.navigate(['/agencias/agencia', this.regForm.get('_id').value]);
          }
          this.regForm.markAsPristine();
        });
    }
  }

  onFileSelected(event) {
    if (this.tipoFile === 'img') {
      if (event.target.files[0] !== undefined) {
        this.fileImg = <File>event.target.files[0];
        this.subirArchivo(this.tipoFile);
      }
    } else {
      if (this.tipoFile === 'formatoR1') {
        if (event.target.files[0] !== undefined) {
          this.file = <File>event.target.files[0];
          this.subirArchivo(this.tipoFile);
        }
      } else {
        console.log('No conozco el tipo de archivo para subir');
      }
    }
  }

  subirArchivo(tipo: string) {
    let file: File;
    if (this.fileImg != null && tipo === 'img') {
      file = this.fileImg;
      this.fileImgTemporal = true;
    } else {
      if (this.file != null && tipo === 'formatoR1') {
        file = this.file;
        this.fileTemporal = true;
      }
    }
    this._subirArchivoService.subirArchivoBucketTemporal(file)
      .subscribe(nombreArchivo => {
        this.regForm.get(tipo).setValue(nombreArchivo);
        this.regForm.get(tipo).markAsDirty();
        this.guardarAgencia();
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
}
