import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cfdi',
  templateUrl: './cfdi.component.html',
  styleUrls: ['./cfdi.component.css']
})
export class CFDIComponent implements OnInit {
  regForm: FormGroup;
  url: string;
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {
    // this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.cargarCFDI(id);
    } else {
      // tslint:disable-next-line: forin
      // for (const control in this.regForm.controls) {
      //   this.regForm.controls[control.toString()].setValue(undefined);
      // }
    }

    // this.impuestos.removeAt(0);
    this.url = '/cfdis';
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      serie: [''],
      folio: [''],
      sucursal: ['', [Validators.required]],
      forma_pago: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      tipo_comprobante: ['', [Validators.required]],
      TR: [''],
      impuesto: [''],
      valor: [16.0000],
      // impuestos: this.fb.array([this.agregarArray(new Impuesto)]),
      _id: ['']
    });
  }

  cargarCFDI(id: string) {

  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');
  }
}
