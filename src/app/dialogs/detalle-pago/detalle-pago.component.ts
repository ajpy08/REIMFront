import { FacturacionService } from 'src/app/services/service.index';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.css']
})
export class DetallePagoComponent implements OnInit {

  regForm: FormGroup;
  formasPago = [];
  constructor(public dialogRef: MatDialogRef<DetallePagoComponent>,
    private facturacionService: FacturacionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createFormGroup();

    this.facturacionService.getFormasPago().subscribe(formasPago => {
      this.formasPago = formasPago.formasPago;
      this.formaPago.setValue(formasPago.formasPago[2].formaPago);
    });
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      fecha: [''],
      formaPago: [''],
      moneda: [''],
      numeroOperacion: [''],
      // doctosRelacionados: this.fb.array([this.agregarArray(new Impuesto('TRASLADO', 0, '002', 16.00, 'Tasa'))], { validators: Validators.required }),
      numeroCuentaOrd: [''],
      rfcEntidadEmisoraOrd: [''],
      bancoOrd: [''],
      numeroCuentaBen: [''],
      rfcEntidadEmisoraBen: [''],
      tipoCadenaPago: [''],
      cadenaOriginal: [''],
      certificado: [''],
      sello: ['']
    });
  }

  // agregarArray(impuesto: Impuesto): FormGroup {
  //   return this.fb.group({
  //     TR: [impuesto.TR],
  //     impuesto: [impuesto.impuesto],
  //     tasaCuota: [impuesto.tasaCuota],
  //     tipoFactor: [impuesto.tipoFactor]
  //   });
  // }

  close(result: string) {
    this.dialogRef.close(result);
  }

  asignarPago() {

    const pago = {
    };

    this.close('Se agrego pago !!!');
  }

  /* #region Properties */

  get fecha() {
    return this.regForm.get('fecha');
  }

  get formaPago() {
    return this.regForm.get('formaPago');
  }

  get moneda() {
    return this.regForm.get('moneda');
  }

  get numeroOperacion() {
    return this.regForm.get('numeroOperacion');
  }


  get numeroCuentaOrd() {
    return this.regForm.get('numeroCuentaOrd');
  }

  get rfcEntidadEmisoraOrd() {
    return this.regForm.get('rfcEntidadEmisoraOrd');
  }

  get bancoOrd() {
    return this.regForm.get('bancoOrd');
  }

  get numeroCuentaBen() {
    return this.regForm.get('numeroCuentaBen');
  }

  get rfcEntidadEmisoraBen() {
    return this.regForm.get('rfcEntidadEmisoraBen');
  }

  get tipoCadenaPago() {
    return this.regForm.get('tipoCadenaPago');
  }

  get cadenaOriginal() {
    return this.regForm.get('cadenaOriginal');
  }

  get certificado() {
    return this.regForm.get('certificado');
  }

  get sello() {
    return this.regForm.get('sello');
  }

  // get doctosRelacionados() {
  //   return this.regForm.get('doctosRelacionados') as FormArray;
  // }
  /* #endregion */

}
