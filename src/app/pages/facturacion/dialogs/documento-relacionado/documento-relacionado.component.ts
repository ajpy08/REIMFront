import { ValidationService } from './../../validation.service';
import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogRef
} from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { FacturacionService } from '../../facturacion.service';

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
      saldo: [{ value: '', disabled: true }],
      porPagar: ['', [Validators.required, ValidationService.emailValidator]],
      // saldoInsoluto: [{ value: '', disabled: true }]
      saldoInsoluto: ['', Validators.compose([Validators.required, ValidationService.positiveVal])]
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
    this.regForm.controls['saldoInsoluto'].setValue(this.saldo.value - this.porPagar.value);
  }

  close(result: string) {
    this.dialogRef.close(result);
  }

  relacionarDocumento() {

    const docto = {
    };

    this.close('Se agrego documento Relacionado !!!');
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
