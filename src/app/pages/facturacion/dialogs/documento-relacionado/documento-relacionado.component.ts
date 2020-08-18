import { DoctoRelacionado } from './../../models/docto-relacionado.models';
import { VariasService } from './../../varias.service';
import { ValidationService } from './../../validation.service';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogRef
} from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { FacturacionService } from '../../facturacion.service';
import { CFDI } from '../../models/cfdi.models';
import swal from 'sweetalert';

@Component({
  selector: 'app-documento-relacionado',
  templateUrl: './documento-relacionado.component.html',
  styleUrls: ['./documento-relacionado.component.css']
})
export class DocumentoRelacionadoComponent implements OnInit {
  regForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<DocumentoRelacionadoComponent>,
    private facturacionService: FacturacionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createFormGroup();
    this.cargarMontos(this.data);
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      saldo: [{ value: '', disabled: true }, [Validators.required]],
      porPagar: [{ value: '' }, Validators.compose([Validators.required, ValidationService.positiveVal, Validators.min(1)])],
      saldoInsoluto: [{ value: '', disabled: true }, Validators.compose([Validators.required, ValidationService.positiveVal])]
    });
  }

  cargarMontos(cfdi) {
    // this._clienteService.getCliente(id)
    //   .subscribe(res => {
    //     this.regForm.controls['razonSocial'].setValue(res.razonSocial);
    //   });
    const porPagar = 0;
    const yaPAgado = 0;
    this.regForm.controls['saldo'].setValue(this.data.total.$numberDecimal - yaPAgado);
    this.regForm.controls['porPagar'].setValue(this.saldo.value);
    this.regForm.controls['saldoInsoluto'].setValue(this.saldo.value - (this.porPagar.value));
  }

  calcula() {

    if (!this.porPagar.invalid) {
      const saldoInsoluto = this.saldo.value - Math.abs(this.porPagar.value);
      this.regForm.controls['saldoInsoluto'].setValue(VariasService.truncateDecimals(saldoInsoluto, 2));
    } else {
      this.cargarMontos(new CFDI());
    }
  }

  close(result) {
    this.dialogRef.close(result);
  }

  relacionarDocumento() {

    const docto = new DoctoRelacionado();
    docto.idDocumento = this.data.uuid;
    docto.rfc = this.data.rfc;
    docto.serie = this.data.serie;
    docto.folio = this.data.folio;
    docto.monedaDR = this.data.moneda;
    docto.metodoDePagoDR = this.data.metodoPago;
    docto.numParcialidad = 1;
    docto.impSaldoAnt = this.saldo.value;
    docto.impPagado = this.porPagar.value;
    docto.impSaldoInsoluto = this.saldoInsoluto.value;


    this.close(docto);
  }

  /* #region  Properties */
  get saldo() {
    return this.regForm.get('saldo');
  }

  get porPagar() {
    return this.regForm.get('porPagar');
  }

  get saldoInsoluto() {
    return this.regForm.get('saldoInsoluto');
  }

  /* #endregion */

}
