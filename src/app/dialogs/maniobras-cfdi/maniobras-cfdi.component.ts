import { Reparacion } from './../../pages/reparaciones/reparacion.models';
import { ManiobraService } from './../../pages/maniobras/maniobra.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Maniobra } from 'src/app/models/maniobra.models';
import { Naviera } from 'src/app/pages/navieras/navieras.models';
import { ReadPropExpr } from '@angular/compiler';

@Component({
  selector: 'app-maniobras-cfdi',
  templateUrl: './maniobras-cfdi.component.html',
  styleUrls: ['./maniobras-cfdi.component.css']
})
export class ManiobrasCFDIComponent implements OnInit {

  regForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<ManiobrasCFDIComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private maniobraService: ManiobraService) { }

  ngOnInit() {
    this.createFormGroup();
    this.maniobras.removeAt(0);
    this.cargarManiobras(this.data.maniobras);
  }

  cargarManiobras(maniobras) {
    if (maniobras.length > 0) {
      maniobras.forEach(element => {
        if (element.cargaDescarga) {
          this.maniobras.push(this.agregarArray(
            new Maniobra(element.cargaDescarga, element.folio, '', '', new Naviera(), '', '', '', '', element.contenedor,
              element.tipo)));
        } else {
          this.maniobraService.getManiobra(element).subscribe((maniobra) => {
            this.maniobras.push(this.agregarArray(
              new Maniobra(maniobra.maniobra.cargaDescarga, maniobra.maniobra.folio, '', '', new Naviera(), '', '', '', '', maniobra.maniobra.contenedor,
                maniobra.maniobra.tipo, '', '', '', '', '', '', '', '', '', '', '', '', false, '', '', '', undefined, '',
                false, false, '', '', '', '', undefined, '', '', '', undefined, '', undefined, '', undefined,
                maniobra.maniobra._id)));
          });
        }
      });
    } else {
      this.regForm.controls['maniobras'].setValue(undefined);
    }
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      cargaDescarga: [''],
      folio: [''],
      contenedor: [''],
      tipo: [''],
      maniobras: this.fb.array([this.agregarArray(
        new Maniobra('C', '1', '1', 'x'))], { validators: Validators.required }),
    });
  }

  agregarArray(maniobra: Maniobra): FormGroup {
    return this.fb.group({
      cargaDescarga: [maniobra.cargaDescarga],
      folio: [maniobra.folio],
      contenedor: [maniobra.contenedor],
      tipo: [maniobra.tipo],
      _id: [maniobra._id]
    });
  }

  quitar(indice: number) {
    this.regForm.markAsDirty();
    this.maniobras.removeAt(indice);
  }

  close(maniobra) {
    this.dialogRef.close(maniobra);
  }

  asignarManiobras(concepto) {
    concepto.maniobras = [];
    this.maniobras.value.forEach(m => {
      concepto.maniobras.push(m._id);
    });
    this.close(concepto);
  }

  /* #region  Properties */
  get _id() {
    return this.regForm.get('_id');
  }

  get cargaDescarga() {
    return this.regForm.get('cargaDescarga');
  }

  get folio() {
    return this.regForm.get('folio');
  }

  get contenedor() {
    return this.regForm.get('contenedor');
  }

  get tipo() {
    return this.regForm.get('tipo');
  }

  get maniobras() {
    return this.regForm.get('maniobras') as FormArray;
  }
  /* #endregion */

}
