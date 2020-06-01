import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import swal from 'sweetalert';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Impuesto } from 'src/app/pages/facturacion/models/impuesto.models';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TR_ARRAY, IMPUESTOS_ARRAY } from 'src/app/config/config';

@Component({
  selector: 'app-impuestos-cfdi',
  templateUrl: './impuestos-cfdi.component.html',
  styleUrls: ['./impuestos-cfdi.component.css']
})
export class ImpuestosCFDIComponent implements OnInit {

  TRs = TR_ARRAY;
  tipoImpuestos = IMPUESTOS_ARRAY;
  regForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<ImpuestosCFDIComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createFormGroup();
    this.impuestos.removeAt(0);
    this.cargarImpuestos(this.data.impuestos);
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      TR: [''],
      impuesto: [''],
      tasaCuota: [''],
      tipoFactor: [''],
      impuestos: this.fb.array([this.agregarArray(new Impuesto('TRASLADO', 0, '002', 16.00, 'Tasa'))], { validators: Validators.required }),
    });
  }

  cargarImpuestos(impuestos) {
    if (impuestos.length > 0) {
      impuestos.forEach(element => {
        this.impuestos.push(this.agregarArray(new Impuesto(element.TR, element.importe, element.impuesto, element.tasaCuota, element.tipoFactor)));
      });
    } else {
      this.regForm.controls['impuestos'].setValue(undefined);
    }
  }

  agregarArray(impuesto: Impuesto): FormGroup {
    return this.fb.group({
      TR: [impuesto.TR],
      impuesto: [impuesto.impuesto],
      tasaCuota: [impuesto.tasaCuota],
      tipoFactor: [impuesto.tipoFactor]
    });
  }

  addImpuesto(TR: string, impuesto: string, tasaCuota: number, tipoFactor: string): void {
    const impuestoObj = new Impuesto(TR, 0, impuesto, tasaCuota, tipoFactor);
    const tmp = this.impuestos.value.filter(i => i.TR === TR && i.impuesto === impuesto &&
      i.tasaCuota === tasaCuota);

    if (tmp.length > 0) {
      swal('No puedes agregar este impuesto por que ya existe', '', 'error');
    } else {
      if (TR === '' || impuesto === '' || tasaCuota === 0 || tipoFactor === '') {
        swal('Error al Agregar', 'No puede estar vacio ningun campo', 'error');
      } else {
        this.impuestos.push(this.agregarArray(impuestoObj));

        this.TR.setValue('');
        // this.impuesto.setValue('');
        this.tasaCuota.setValue(0);
        this.tipoFactor.setValue('');
      }
    }
  }

  quitar(indice: number) {
    this.regForm.markAsDirty();
    this.impuestos.removeAt(indice);
  }

  cambioImpuesto(impuesto: string) {
    if (impuesto === 'ISR') {
      this.impuesto.setValue('001');
    } else {
      if (impuesto === 'IVA') {
        this.impuesto.setValue('002');
      } else {
        if (impuesto === 'IEPS') {
          this.impuesto.setValue('003');
        } else { }
      }
    }
  }

  close(concepto) {
    this.dialogRef.close(concepto);
  }

  asignarImpuestos(concepto) {
    concepto.impuestos = this.impuestos.value;
    this.close(concepto);
  }

  /* #region  Properties */
  get TR() {
    return this.regForm.get('TR');
  }

  get impuesto() {
    return this.regForm.get('impuesto');
  }

  get tasaCuota() {
    return this.regForm.get('tasaCuota');
  }

  get tipoFactor() {
    return this.regForm.get('tipoFactor');
  }

  get impuestos() {
    return this.regForm.get('impuestos') as FormArray;
  }
  /* #endregion */

}
