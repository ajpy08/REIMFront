import { Impuesto } from './../models/impuesto.models';
import { Component, OnInit } from '@angular/core';
import { ProductoServicio } from '../models/producto-servicio.models';
import { FacturacionService } from '../../../services/service.index';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
import { TR_ARRAY, IMPUESTOS_ARRAY } from 'src/app/config/config';
// import * as io from 'socket.io-client';
import swal from 'sweetalert';

@Component({
  selector: 'app-producto-servicio',
  templateUrl: './producto-servicio.component.html',
  styleUrls: ['./producto-servicio.component.css']
})
export class ProductoServicioComponent implements OnInit {
  productoServicio: ProductoServicio = new ProductoServicio();
  impuesto_s: Impuesto[] = [];
  regForm: FormGroup;
  url: string;
  // socket = io(URL_SOCKET_IO, PARAM_SOCKET);
  TRs = TR_ARRAY;
  tipoImpuestos = IMPUESTOS_ARRAY;
  clavesSAT;
  clavesUnidad;

  constructor(
    public facturacionService: FacturacionService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.facturacionService.getClavesSAT().subscribe((claves) => {
      this.clavesSAT = claves.clavesSAT;
    });

    this.facturacionService.getClavesUnidad().subscribe((clavesUnidad) => {
      this.clavesUnidad = clavesUnidad.clavesUnidad;
    });

    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'nuevo') {
      this.impuestos.removeAt(0);
      this.cargarProductoServicio(id);
    } else {
      // tslint:disable-next-line: forin
      // for (const control in this.regForm.controls) {
      //   this.regForm.controls[control.toString()].setValue(undefined);
      // }
    }
    this.url = '/productos-servicios';
  }

  cargarProductoServicio(id: string) {
    this.facturacionService.getProductoServicio(id).subscribe(res => {
      this.productoServicio = res;
      // tslint:disable-next-line: forin
      for (const propiedad in this.productoServicio) {
        for (const control in this.regForm.controls) {
          if (propiedad === control.toString() && propiedad !== 'impuestos') {
            this.regForm.controls[propiedad].setValue(res[propiedad]);
          }
        }
      }

      if (res.impuestos.length > 0) {
        res.impuestos.forEach(element => {
          this.impuestos.push(this.agregarArray(new Impuesto(element.TR, element.impuesto, element.valor)));
        });
      } else {
        this.regForm.controls['impuestos'].setValue(undefined);
      }
    });
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      codigo: [''],
      unidad: [1],
      descripcion: ['', [Validators.required]],
      valorUnitario: [0.0000, [Validators.required]],
      claveSAT: ['', [Validators.required]],
      unidadSAT: ['', [Validators.required]],
      TR: [''],
      impuesto: [''],
      valor: [],
      impuestos: this.fb.array([this.agregarArray(new Impuesto('TRASLADO', 'IVA', 16.00))], { validators: Validators.required }),
      _id: ['']
    });
  }

  guardarProductoServicio() {
    if (this.regForm.valid) {
      this.facturacionService.guardarProductoServicio(this.regForm.value).subscribe(res => {
        if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
          this.regForm.get('_id').setValue(res._id);
          this.router.navigate(['/producto-servicio/', this.regForm.get('_id').value]);
        }
        this.regForm.markAsPristine();
      });
    }
  }

  agregarArray(impuesto: Impuesto): FormGroup {
    return this.fb.group({
      TR: [impuesto.TR],
      impuesto: [impuesto.impuesto],
      valor: [impuesto.valor]
    });
  }

  addImpuesto(TR: string, impuesto: string, valor: number): void {
    const impuestoObj = new Impuesto(TR, impuesto, valor);
    const tmp = this.impuestos.value.filter(i => i.TR === TR && i.impuesto === impuesto && i.valor === valor);

    if (tmp.length > 0) {
      swal('No puedes agregar este impuesto por que ya existe', '', 'error');
    } else {
      if (TR === '' || impuesto === '' || valor === 0) {
        swal('Error al Agregar', 'No puede estar vacio ningun campo', 'error');
      } else {
        this.impuestos.push(this.agregarArray(impuestoObj));

        this.TR.setValue('');
        this.impuesto.setValue('');
        this.valor.setValue(0);
      }
    }
  }

  // quit(control: AbstractControl) {
  //   if (!control.valid) {
  //     control.setValue('');
  //   }
  // }

  quitar(indice: number) {
    this.regForm.markAsDirty();
    this.impuestos.removeAt(indice);
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');
  }

  /* #region  Properties */
  get codigo() {
    return this.regForm.get('codigo');
  }

  get unidad() {
    return this.regForm.get('unidad');
  }

  get descripcion() {
    return this.regForm.get('descripcion');
  }

  get valorUnitario() {
    return this.regForm.get('valorUnitario');
  }

  get claveSAT() {
    return this.regForm.get('claveSAT');
  }

  get unidadSAT() {
    return this.regForm.get('unidadSAT');
  }

  // get impuestos() {
  //   return this.regForm.get('impuestos');
  // }

  get TR() {
    return this.regForm.get('TR');
  }

  get impuesto() {
    return this.regForm.get('impuesto');
  }

  get valor() {
    return this.regForm.get('valor');
  }

  get impuestos() {
    return this.regForm.get('impuestos') as FormArray;
  }

  /* #endregion */
}
