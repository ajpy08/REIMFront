import { Router, ActivatedRoute } from '@angular/router';
import { FacturacionService } from './../facturacion.service';
import { Component, OnInit } from '@angular/core';
import { ClaveProductosServicio } from './clave-producto.servicio.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-clave-productos-servicio',
  templateUrl: './clave-productos-servicio.component.html',
  styleUrls: ['./clave-productos-servicio.component.css']
})
export class ClaveProductosServicioComponent implements OnInit {
  ClaveProductosServicio: ClaveProductosServicio = new ClaveProductosServicio();
  regForm: FormGroup;
  url: string;

  constructor(public facturacionService: FacturacionService,
    public router: Router, public activatedRoute: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.cargarClaveProductoServicio(id);
    }


    this.url = '/clave-productos-servicios';
  }


   cargarClaveProductoServicio(id: string) {
    this.facturacionService.getClaveProductoServicio(id).subscribe(resp => {
      this.ClaveProductosServicio = resp;
      // tslint:disable-next-line: forin
      for (const propiedad in this.ClaveProductosServicio) {
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
      this.facturacionService.guardarClaveProductoServicio(this.regForm.value).subscribe(res => {
        if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
          this.regForm.get('_id').setValue(res._id);
          this.router.navigate(['/clave-producto-servicio/', this.regForm.get('_id').value]);
        }
      });
      this.regForm.markAsPristine();
    }

  }

  createFormGroup() {
    this.regForm = this.fb.group({
      claveProdServ: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      incluir_IVA_trasladado: ['', [Validators.required]],
      incluir_IEPS_trasladado: ['', [Validators.required]],
      palabras_similares: ['', [Validators.required]],
      _id: ['']
    });
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');
  }





  /* #region  PROPIEDADES */
  get claveProdServ() {
    return this.regForm.get('claveProdServ');
  }

  get descripcion() {
    return this.regForm.get('descripcion');
  }

  get incluir_IVA_trasladado() {
    return this.regForm.get('incluir_IVA_trasladado');
  }

  get incluir_IEPS_trasladado() {
    return this.regForm.get('incluir_IEPS_trasladado');
  }

  get  palabras_similares() {
    return this.regForm.get(' palabras_similares');
  }
  /* #endregion */
}
