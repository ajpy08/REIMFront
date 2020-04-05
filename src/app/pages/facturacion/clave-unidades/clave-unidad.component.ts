import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FacturacionService } from './../facturacion.service';
import { Component, OnInit } from '@angular/core';
import { ClaveUnidadServicio } from './clave-unidad.service.models';

@Component({
  selector: 'app-clave-unidad',
  templateUrl: './clave-unidad.component.html',
  styleUrls: ['./clave-unidad.component.css']
})
export class ClaveUnidadComponent implements OnInit {
  ClaveUnidadServicio: ClaveUnidadServicio = new ClaveUnidadServicio();
  regForm: FormGroup;
  url: string;

  constructor(public facturacionService: FacturacionService, public router: Router,
    public activatedRoute: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {

    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.cargarClaveUnidad(id);
    }
    this.url = '/clave-unidades';
  }
  createFormGroup() {
    this.regForm = this.fb.group({
      claveUnidad: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      nota: ['', [Validators.required]],
      _id: ['']
    });

  }

  cargarClaveUnidad(id: string) {
    this.facturacionService.getClaveUnidad(id).subscribe(resp => {
      this.ClaveUnidadServicio = resp;
      // tslint:disable-next-line: forin
      for (const propiedad in this.ClaveUnidadServicio) {
        for (const control in this.regForm.controls) {
          if (propiedad === control.toString()) {
            this.regForm.controls[propiedad].setValue(resp[propiedad]);
          }
        }
      }
    });
  }

  guardarClaveProductoServicio() {
    if (this.regForm.valid) {
      this.facturacionService.guardarClaveUnidad(this.regForm.value).subscribe(res => {
        if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
          this.regForm.get('_id').setValue(res._id);
          this.router.navigate(['/clave-unidad/', this.regForm.get('_id').value]);
        }
      });
      this.regForm.markAsPristine();
    }

  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');
  }

  /* #region  PROPIEDADES */

  get claveUnidad() {
    return this.regForm.get('claveUnidad');
  }

  get nombre() {
    return this.regForm.get('nombre');
  }
  get descripcion() {
    return this.regForm.get('descripcion');
  }
  get nota() {
    return this.regForm.get('nota');
  }
  /* #endregion */

}
