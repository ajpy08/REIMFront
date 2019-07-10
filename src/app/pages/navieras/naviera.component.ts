import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Naviera } from '../../models/navieras.models';
import { NavieraService } from 'src/app/services/service.index';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';



@Component({
  selector: 'app-naviera',
  templateUrl: './naviera.component.html',
  styles: []
})
export class NavieraComponent implements OnInit {
  regForm: FormGroup;
  fileImg: File = null;
  fileImgTemporal = false;
  file: File = null;
  fileTemporal = false;
  edicion = false;

  constructor(public _navieraService: NavieraService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder
    ) {}

  ngOnInit() {
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.edicion = true;
      this.cargarNaviera( id );
    }
  }
  createFormGroup() {
    this.regForm = this.fb.group({
      razonSocial: ['', [Validators.required, Validators.minLength(5)]],
      rfc: ['', [Validators.required,  Validators.minLength(12)]],
      calle: [''],
      numeroExterior: [''],
      numeroInterior: [''],
      colonia: [''],
      municipioDelegacion: [''],
      ciudad: [''],
      estado: [''],
      cp: [''],
      formatoR1: [''],
      correo: [''],
      correoFac: [''],
      credito: [''],
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
    return this.regForm.get('numeroExterior');
  }
  get numeroInterior() {
    return this.regForm.get('numeroInterior');
  }
  get colonia() {
    return this.regForm.get('colonia');
  }
  get municipioDelegacion() {
    return this.regForm.get('municipioDelegacion');
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

  cargarNaviera( id: string ) {
    this._navieraService.getNavieraXID(id).subscribe(naviera => {
      this.regForm.controls['razonSocial'].setValue(naviera.razonSocial);
      this.regForm.controls['rfc'].setValue(naviera.rfc);
      this.regForm.controls['calle'].setValue(naviera.calle);
      this.regForm.controls['numeroExterior'].setValue(naviera.numeroExterior);
      this.regForm.controls['numeroInterior'].setValue(naviera.numeroInterior);
      this.regForm.controls['colonia'].setValue(naviera.colonia);
      this.regForm.controls['municipioDelegacion'].setValue(naviera.municipioDelegacion);
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
      this._navieraService.guardarNaviera( this.regForm.value )
                .subscribe( usuario => {
                  this.fileImg = null;
                  this.fileImgTemporal = false;
                  this.file = null;
                  this.fileTemporal = false;
                  if (this.regForm.get('_id').value === '') {
                    this.regForm.get('_id').setValue(usuario._id);
                    this.router.navigate(['/naviera', this.regForm.get('_id').value ]);
                    this.edicion = true;
                  }
                  this.regForm.markAsPristine();
                });
    }
  }

}
