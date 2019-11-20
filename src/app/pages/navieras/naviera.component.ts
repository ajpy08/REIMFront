import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavieraService, SubirArchivoService } from 'src/app/services/service.index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';


@Component({
  selector: 'app-naviera',
  templateUrl: './naviera.component.html',
  styles: []
})
export class NavieraComponent implements OnInit {
  tipoFile = '';
  regForm: FormGroup;
  fileImg: File = null;
  fileImgTemporal = false;
  file: File = null;
  fileTemporal = false;
  edicion = false;
  url: string;

  constructor(public _navieraService: NavieraService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _subirArchivoService: SubirArchivoService,
    private fb: FormBuilder,
    private location: Location) { }

  ngOnInit() {
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.edicion = true;
      this.cargarNaviera(id);
    } else {
      this.regForm.controls['noInterior'].setValue(undefined);
      this.regForm.controls['noExterior'].setValue(undefined);
    }
    this.url = '/navieras';
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      razonSocial: ['', [Validators.required, Validators.minLength(5)]],
      // rfc: ['', [Validators.required, Validators.minLength(12)]],
      rfc: [''],
      calle: [''],
      noExterior: [''],
      noInterior: [''],
      colonia: [''],
      municipio: [''],
      ciudad: [''],
      estado: ['', [Validators.required]],
      cp: ['', [Validators.required]],
      formatoR1: ['', [Validators.required]],
      correo: ['', [Validators.email]],
      correoFac: ['', [Validators.email]],
      credito: [false, Validators.required],
      img: [''],
      caat: ['', [Validators.required]],
      nombreComercial: [''],
      _id: ['']
    });
  }

  get razonSocial() {
    return this.regForm.get('razonSocial');
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
  get correoFac() {
    return this.regForm.get('correoFac');
  }
  get credito() {
    return this.regForm.get('credito');
  }
  get img() {
    return this.regForm.get('img');
  }
  get caat() {
    return this.regForm.get('caat');
  }
  get nombreComercial() {
    return this.regForm.get('nombreComercial');
  }
  get _id() {
    return this.regForm.get('_id');
  }

  cargarNaviera(id: string) {
    this._navieraService.getNaviera(id).subscribe(naviera => {
      this.regForm.controls['razonSocial'].setValue(naviera.razonSocial);
      this.regForm.controls['rfc'].setValue(naviera.rfc);
      this.regForm.controls['calle'].setValue(naviera.calle);
      this.regForm.controls['noExterior'].setValue(naviera.noExterior);
      this.regForm.controls['noInterior'].setValue(naviera.noInterior);
      this.regForm.controls['colonia'].setValue(naviera.colonia);
      this.regForm.controls['municipio'].setValue(naviera.municipio);
      this.regForm.controls['ciudad'].setValue(naviera.ciudad);
      this.regForm.controls['estado'].setValue(naviera.estado);
      this.regForm.controls['cp'].setValue(naviera.cp);
      this.regForm.controls['formatoR1'].setValue(naviera.formatoR1);
      this.regForm.controls['correo'].setValue(naviera.correo);
      this.regForm.controls['correoFac'].setValue(naviera.correoFac);
      this.regForm.controls['credito'].setValue(naviera.credito);
      this.regForm.controls['img'].setValue(naviera.img);
      this.regForm.controls['caat'].setValue(naviera.caat);
      this.regForm.controls['nombreComercial'].setValue(naviera.nombreComercial);
      this.regForm.controls['_id'].setValue(naviera._id);
    });
  }

  guardarNaviera() {
    if (this.regForm.valid) {
      this._navieraService.guardarNaviera(this.regForm.value)
        .subscribe(res => {
          this.fileImg = null;
          this.fileImgTemporal = false;
          this.file = null;
          this.fileTemporal = false;
          if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
            this.regForm.get('_id').setValue(res._id);
            this.router.navigate(['/navieras/naviera', this.regForm.get('_id').value]);
            this.edicion = true;
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
        this.guardarNaviera();
      });
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history')
    }
    this.router.navigate([this.url]);
    //this.location.back();
  }
}
