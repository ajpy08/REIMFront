import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavieraService, SubirArchivoService, FacturacionService } from 'src/app/services/service.index';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Location } from '@angular/common';
import swal from 'sweetalert';


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
  act = true;
  correod;
  usosCFDI = [];

  constructor(public _navieraService: NavieraService,
    public router: Router,
    public facturacionService: FacturacionService,
    public activatedRoute: ActivatedRoute,
    public _subirArchivoService: SubirArchivoService,
    private fb: FormBuilder,
    private location: Location) { }

  ngOnInit() {
    this.createFormGroup();
    this.facturacionService.getUsosCFDI().subscribe(usosCFDI => {
      this.usosCFDI = usosCFDI.usosCFDI;
    });
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.edicion = true;
      this.cargarNaviera(id);
    } else {
      this.regForm.controls['noInterior'].setValue(undefined);
      this.regForm.controls['noExterior'].setValue(undefined);
    }
    this.url = '/navieras';

    if (this.correo) {
      this.correo.removeAt(0);
    }
    if (this.correoFacturacion) {
      this.correoFacturacion.removeAt(0);
    }
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
      correosF: ['', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')],
      correoFac: ['', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')],
      correotem: ['', [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      correotempFac: ['', [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      correo: this.fb.array([this.agregarArray('')], { validators: Validators.required }),
      correoFacturacion: this.fb.array([this.agregarFArray('')], { validators: Validators.required }),
      credito: [false, Validators.required],
      img: [''],
      usoCFDI: ['', [Validators.required]],
      caat: ['', [Validators.required]],
      activo: [true, [Validators.required]],
      nombreComercial: ['', [Validators.required]],
      _id: ['']
    });
  }


  agregarArray(correoO: String): FormGroup {
    return this.fb.group({
      correoO: [correoO]
    });
  }
  agregarFArray(correoFa: String): FormGroup {
    return this.fb.group({
      correoFa: [correoFa]
    });
  }

  addContenedor(correoO: string): void {
    let error = false;

    if (correoO === '') {
      this.correo.disable({ emitEvent: true });
      swal('Error al Agregar', 'El campo Correo Operativo no puede estar Vacio', 'error');
    } else if (this.correo.controls.length === 0) {
      this.correo.push(this.agregarArray(correoO));
    } else {
      if (this.correo.controls) {
        this.correo.controls.forEach(c => {
          if (this.correotem.value === c.value.correoO) {
            if (error === false) {
              swal('Error al agregar', 'El correo ' + this.correotem.value +
                ' ya se encuentra registrado en la lista', 'error');
              error = true;
              return false;
            }
          }
        });
        if (!error) {
          this.correo.push(this.agregarArray(correoO));
        }
      }
    }
  }

  addCorreoFac(correoFa: string): void {
    let error = false;

    if (correoFa === '') {
      this.correoFacturacion.disable({ emitEvent: true });
      swal('Error al Agregar', 'El campo Correo Facturacion no puede estar Vacio', 'error');
    } else if (this.correoFacturacion.controls.length === 0) {
      this.correoFacturacion.push(this.agregarFArray(correoFa));
    } else {
      if (this.correoFacturacion.controls) {
        this.correoFacturacion.controls.forEach(c => {
          if (this.correotempFac.value === c.value.correoFa) {
            if (error === false) {
              swal('Error al agregar', 'El correo Facturacion' + this.correotempFac.value +
                ' ya se encuentra registrado en la lista', 'error');
              error = true;
              return false;
            }
          }
        });
        if (!error) {
          this.correoFacturacion.push(this.agregarFArray(correoFa));
        }
      }
    }
  }


  quitar(indice: number) {
    this.correo.removeAt(indice);
  }
  quitarFac(indice: number) {
    this.correoFacturacion.removeAt(indice);
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
    return this.regForm.get('correo') as FormArray;
  }
  get correoFacturacion() {
    return this.regForm.get('correoFacturacion') as FormArray;
  }
  get usoCFDI() {
    return this.regForm.get('usoCFDI');
  }
  get correotem() {
    return this.regForm.get('correotem');
  }
  get correotempFac() {
    return this.regForm.get('correotempFac');
  }
  get correoFac() {
    return this.regForm.get('correoFac');
  }
  get correosF() {
    return this.regForm.get('correosF');
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
  get activo() {
    return this.regForm.get('activo');
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

      if (naviera.correo !== '' && naviera.correo !== undefined && naviera.correo !== null) {
        const correoArray = naviera.correo.split(',');
        correoArray.forEach(c => {
          this.addContenedor(c);
        });
      }

      if (naviera.correoFac !== '' && naviera.correoFac !== undefined && naviera.correoFac !== null) {
        const correoFArray = naviera.correoFac.split(',');
        correoFArray.forEach(c => {
          this.addCorreoFac(c);
        });
      }
      // this.regForm.controls['correosF'].setValue(naviera.correo);
      // this.regForm.controls['correoFac'].setValue(naviera.correoFac);
      this.regForm.controls['credito'].setValue(naviera.credito);
      this.regForm.controls['usoCFDI'].setValue(naviera.usoCFDI ? naviera.usoCFDI._id : '');
      this.regForm.controls['img'].setValue(naviera.img);
      this.regForm.controls['caat'].setValue(naviera.caat);
      this.regForm.controls['activo'].setValue(naviera.activo);
      this.regForm.controls['nombreComercial'].setValue(naviera.nombreComercial);
      this.regForm.controls['_id'].setValue(naviera._id);
    });
  }

  guardarNaviera() {
    if (this.regForm.valid) {

      let correos = '';
      this.regForm.controls.correo.value.forEach(correo => {
        correos += correo.correoO + ',';
      });
      correos = correos.slice(0, -1);

      this.correotem.setValue('');
      this.correosF.setValue(correos);

      let correoFact = '';
      this.regForm.controls.correoFacturacion.value.forEach(cf => {
        correoFact += cf.correoFa + ',';
      });
      correoFact = correoFact.slice(0, -1);
      this.correoFac.setValue(correoFact);
      this.correotempFac.setValue('');

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
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');

  }
}
