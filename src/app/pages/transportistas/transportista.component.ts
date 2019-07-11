import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Transportista } from '../../models/transportista.models';
import { TransportistaService } from '../../services/service.index';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';

@Component({
  selector: 'app-transportista',
  templateUrl: './transportista.component.html',
  styles: []
})
export class TransportistaComponent implements OnInit {
  regForm: FormGroup;
  fileImg: File = null;
  fileImgTemporal = false;
  file: File = null;
  fileTemporal = false;
  edicion = false;
  
  constructor(public _transportistaService: TransportistaService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _subirArchivoService: SubirArchivoService,
    private fb: FormBuilder){}

  ngOnInit() {
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.edicion = true;
      this.cargarTransportista( id );
    }
    else
    {
    this.regForm.controls['noInterior'].setValue(undefined);
    this.regForm.controls['noExterior'].setValue(undefined);
    }
  }
  
  createFormGroup() {
    this.regForm = this.fb.group({
      razonSocial: ['', [Validators.required, Validators.minLength(5)]],
      rfc: ['', [Validators.required,  Validators.minLength(12)]],
      calle: [''],
      noExterior: [''],
      noInterior: [''],
      colonia: [''],
      municipio: [''],
      ciudad: [''],
      estado: [''],
      cp: [''],
      formatoR1: [''],
      correo: [''],
      correoFac: [''],
      credito: [false],
      img: [''],
      caat: [''],
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

  cargarTransportista( id: string ) {
    this._transportistaService.getTransportistaXID(id).subscribe(res => {
      this.regForm.controls['razonSocial'].setValue(res.razonSocial);
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
      this.regForm.controls['correo'].setValue(res.correo);
      this.regForm.controls['correoFac'].setValue(res.correoFac);
      this.regForm.controls['credito'].setValue(res.credito);
      this.regForm.controls['img'].setValue(res.img);
      this.regForm.controls['caat'].setValue(res.caat);
      this.regForm.controls['nombreComercial'].setValue(res.nombreComercial);
      this.regForm.controls['_id'].setValue(res._id);
    });
  }

  guardarTransportista() {
    if (this.regForm.valid) {
      console.log (this.regForm.value);
      this._transportistaService.guardarTransportista( this.regForm.value )
                .subscribe( res => {
                  this.fileImg = null;
                  this.fileImgTemporal = false;
                  this.file = null;
                  this.fileTemporal = false;
                  console.log (res);
                  if (this.regForm.get('_id').value === '') {
                    this.regForm.get('_id').setValue(res._id);
                    this.router.navigate(['/transportista', this.regForm.get('_id').value ]);
                    this.edicion = true;
                  }
                  this.regForm.markAsPristine();
                });
    }
  }

  onFileSelected(event) {
     this.fileImg = <File> event.target.files[0];
    this.subirFoto();
  }
  
  onFileSelected2(event) {
    this.file = <File> event.target.files[0];
   this.subirFormato();
 }
 subirFoto() {
        this._subirArchivoService.subirArchivoTemporal(this.fileImg, '')
        .subscribe( nombreArchivo => {
          this.regForm.get('img').setValue(nombreArchivo);
          this.regForm.get('img').markAsDirty();
          this.fileImgTemporal = true;
          this.guardarTransportista();
    });
  }
  subirFormato() {
    this._subirArchivoService.subirArchivoTemporal(this.file, '')
    .subscribe( nombreArchivo => {
      this.regForm.get('formatoR1').setValue(nombreArchivo);
      this.regForm.get('formatoR1').markAsDirty();
      this.fileTemporal = true;
      this.guardarTransportista();
});
}


}
