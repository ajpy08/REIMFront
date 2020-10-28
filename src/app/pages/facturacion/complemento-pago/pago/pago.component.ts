import { FacturacionService } from 'src/app/services/service.index';
import { FacturasPpdComponent } from './../facturas-ppd/facturas-ppd.component';
import { CFDI } from './../../models/cfdi.models';
import { DoctoRelacionado } from './../../models/docto-relacionado.models';
import { Component, OnInit, Inject } from '@angular/core';
import { Usuario } from 'src/app/pages/usuarios/usuario.model';
import { Pago } from '../../models/pago.models';

import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
// import { ROLES } from 'src/app/config/config';
// import { URL_SOCKET_IO, PARAM_SOCKET } from 'src/environments/environment';
// import * as io from 'socket.io-client';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import {
  MAT_DIALOG_DATA, MatDialogConfig, MatDialog
} from '@angular/material/dialog';
const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: ['l', 'L'],
  },
  display: {
    // dateInput: 'L',
    dateInput: ['YYYY-MM-DDTHH:mm:ss'],
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  { provide: MAT_DATE_LOCALE, useValue: 'es-mx' }]
})
export class PagoComponent implements OnInit {

  usuarioLogueado = new Usuario;
  pago: Pago = new Pago();
  regForm: FormGroup;
  url: string;
  act = true;
  // socket = io(URL_SOCKET_IO, PARAM_SOCKET);
  formasPago = [];
  idSelect;
  indiceSelect;
  ObjetoSelect = [];
  infoAd = '';

  docsRelacionados = new SelectionModel<Pago>(true, []);
  facturasAComplementar = new SelectionModel<CFDI>(true, []);
  constructor(
    public dialogRef: MatDialogRef<PagoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public matDialog: MatDialog,
    public facturacionService: FacturacionService
  ) { }

  ngOnInit() {

    this.docsRelacionados = this.data;

    this.createFormGroup();

    this.moneda.setValue('MXN');
    /////////////////////////////////// FECHA /////////////////////////////////////
    const timeZone = moment().format('Z');
    const fecha = moment().utcOffset(timeZone).format('YYYY-MM-DDTHH:mm:ss');
    this.fechaPago.setValue(fecha);
    ///////////////////////////////////////////////////////////////////////////////

    // this.socket.on('update-buque', function (data: any) {
    //   if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
    //     if (data.data._id) {
    //       this.createFormGroup();
    //       this.cargarBuque(data.data._id);
    //       if (data.data.usuarioMod !== this.usuarioLogueado._id) {
    //         swal({
    //           title: 'Actualizado',
    //           text: 'Otro usuario ha actualizado este buque',
    //           icon: 'info'
    //         });
    //       }
    //     }
    //     // } else {
    //     //   this.cargarBuque(id);
    //   }
    // }.bind(this));

    // this.socket.on('delete-buque', function (data: any) {
    //   if ((this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE)) {
    //     this.router.navigate(['/pagos']);
    //     swal({
    //       title: 'Eliminado',
    //       text: 'Se elimino este buque por otro usuario',
    //       icon: 'warning'
    //     });
    //   }
    // }.bind(this));

    // this.facturacionService.getFormasPago().subscribe(formasPago => {
    //   this.formasPago = formasPago.formasPago;
    //   this.formaPago.setValue(formasPago.formasPago[2].formaPago);
    // });
    this.formaPago.setValue('03');
    this.doctosRelacionados.removeAt(0);
  }

  cargarPago() {
    // this._pagoService.getPago(id).subscribe(res => {
    //   this.pago = res;
    //   // tslint:disable-next-line: forin
    //   for (const propiedad in this.pago) {
    //     for (const control in this.regForm.controls) {
    //       if (propiedad === control.toString()) {
    //         this.regForm.controls[propiedad].setValue(res[propiedad]);
    //       }
    //     }
    //   }
    // });
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      fechaPago: ['', [Validators.required]],
      formaPago: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      noOperacion: ['', [Validators.required]],
      doctosRelacionados: this.fb.array([this.agregarArray(new DoctoRelacionado)], { validators: Validators.required }),
      numeroCuentaOrd: ['', [Validators.required]],
      rfcEntidadEmisoraOrd: ['', [Validators.required]],
      bancoOrd: ['', [Validators.required]],
      numeroCuentaBen: ['', [Validators.required]],
      rfcEntidadEmisoraBen: ['', [Validators.required]],
      tipoCadenaPago: [''],
      certPago: [''],
      cadPago: [''],
      selloPago: ['']
    });
  }

  agregarArray(doc: DoctoRelacionado): FormGroup {
    return this.fb.group({
      idDocumento: [doc.idDocumento],
      // fEmision: [doc.fEmision],
      rfc: [doc.rfc],
      serie: [doc.serie],
      folio: [doc.folio],
      monedaDR: [doc.monedaDR],
      metodoDePagoDR: [doc.metodoDePagoDR],
      numParcialidad: [doc.numParcialidad],
      impSaldoAnt: [doc.impSaldoAnt],
      impPagado: [doc.impPagado],
      impSaldoInsoluto: [doc.impSaldoInsoluto]
    });
  }

  onChange(objeto, indice, event) {
    let pos = 0;
    if (event.checked === true) {
      this.idSelect = objeto;
      this.ObjetoSelect.push({ pago: objeto, indice: indice });
    } else if (this.ObjetoSelect.length > 0) {
      pos = this.ObjetoSelect.findIndex(a => a.maniobra.maniobras[0] === objeto.maniobras[0] && a.maniobra._id === objeto._id);
      this.ObjetoSelect.splice(pos, 1);
      this.ObjetoSelect.length === 0 ? this.idSelect = undefined : this.idSelect = this.ObjetoSelect[0].maniobra;
    }
  }

  openDialogFacturasPPD() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.facturasAComplementar;
    const dialogRef = this.matDialog.open(FacturasPpdComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.selectionPagos = new SelectionModel<Pago>(true, []);
    //   }
    // });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.forEach(docRelacionado => {
          this.doctosRelacionados.push(this.agregarArray(docRelacionado));
        });
        // this.cfdi.conceptos = this.conceptos.value;
        // this.cfdi = cfdi;
        // const pos = this.cfdi.pagos.findIndex(a => a._id === result._id);
        // if (pos >= 0) {
        //   this.cfdi.pagos[pos] = result;
        // }
        // this.recargaValoresCFDI();
        // if (this.id === 'nuevo' || this.id === undefined) {
        //   this.cargaValoresIniciales(dialogConfig.data);
        // } else {
        //   // this.cargarCFDI(this.id);
        //   // this.cfdi = cfdi;
        //   const pos = this.cfdi.pagos.findIndex(a => a._id === result._id);
        //   if (pos >= 0) {
        //     this.cfdi.pagos[pos] = result;
        //   }
        //   this.recargaValoresCFDI();
        // }
      }
    });
  }

  validaCampos(valor) {
    if (valor.value === '03') {
      this.regForm.get('numeroCuentaOrd').setValidators(Validators.required);
      this.regForm.get('rfcEntidadEmisoraOrd').setValidators(Validators.required);
      this.regForm.get('bancoOrd').setValidators(Validators.required);
      this.regForm.get('numeroCuentaBen').setValidators(Validators.required);
      this.regForm.get('rfcEntidadEmisoraBen').setValidators(Validators.required);

      this.regForm.get('numeroCuentaOrd').updateValueAndValidity();
      this.regForm.get('rfcEntidadEmisoraOrd').updateValueAndValidity();
      this.regForm.get('bancoOrd').updateValueAndValidity();
      this.regForm.get('numeroCuentaBen').updateValueAndValidity();
      this.regForm.get('rfcEntidadEmisoraBen').updateValueAndValidity();

    } else {
      this.regForm.get('numeroCuentaOrd').clearValidators();
      this.regForm.get('rfcEntidadEmisoraOrd').clearValidators();
      this.regForm.get('bancoOrd').clearValidators();
      this.regForm.get('numeroCuentaBen').clearValidators();
      this.regForm.get('rfcEntidadEmisoraBen').clearValidators();

      this.regForm.get('numeroCuentaOrd').updateValueAndValidity();
      this.regForm.get('rfcEntidadEmisoraOrd').updateValueAndValidity();
      this.regForm.get('bancoOrd').updateValueAndValidity();
      this.regForm.get('numeroCuentaBen').updateValueAndValidity();
      this.regForm.get('rfcEntidadEmisoraBen').updateValueAndValidity();

      this.regForm.get('numeroCuentaOrd').setValue('');
      this.regForm.get('rfcEntidadEmisoraOrd').setValue('');
      this.regForm.get('bancoOrd').setValue('');
      this.regForm.get('numeroCuentaBen').setValue('');
      this.regForm.get('rfcEntidadEmisoraBen').setValue('');

      //Inicio control a vacio para que cambie la validación
      this.regForm.get('tipoCadenaPago').setValue('');
      // Invoco al metodo para que haga las validaciones
      this.validaCamposTipoCadenaPago('');
    }
  }

  validaCamposTipoCadenaPago(valor) {
    if (valor.value === '01') {
      this.regForm.get('certPago').setValidators(Validators.required);
      this.regForm.get('cadPago').setValidators(Validators.required);
      this.regForm.get('selloPago').setValidators(Validators.required);

      this.regForm.get('certPago').updateValueAndValidity();
      this.regForm.get('cadPago').updateValueAndValidity();
      this.regForm.get('selloPago').updateValueAndValidity();
    } else {
      this.regForm.get('certPago').clearValidators();
      this.regForm.get('cadPago').clearValidators();
      this.regForm.get('selloPago').clearValidators();

      this.regForm.get('certPago').updateValueAndValidity();
      this.regForm.get('cadPago').updateValueAndValidity();
      this.regForm.get('selloPago').updateValueAndValidity();

      this.regForm.get('certPago').setValue('');
      this.regForm.get('cadPago').setValue('');
      this.regForm.get('selloPago').setValue('');


    }
  }

  agregarPago() {

    const pago = new Pago();
    pago.fecha = this.fechaPago.value;
    pago.formaPago = this.formaPago.value;
    pago.moneda = this.moneda.value;
    pago.monto = this.calculaMonto(this.doctosRelacionados.value);
    pago.numeroOperacion = this.noOperacion.value;
    pago.numeroCuentaOrd = this.numeroCuentaOrd.value;
    pago.rfcEntidadEmisoraOrd = this.rfcEntidadEmisoraOrd.value;
    pago.bancoOrd = this.bancoOrd.value;
    pago.numeroCuentaBen = this.numeroCuentaBen.value;
    pago.rfcEntidadEmisoraBen = this.rfcEntidadEmisoraBen.value;
    // pago.tipoCadenaPago = this.tipoCadenaPago.value;
    // pago.certPago = this.certPago.value;
    // pago.cadPago = this.cadPago.value;
    // pago.selloPago = this.selloPago.value;
    pago.doctosRelacionados = this.doctosRelacionados.value;

    this.facturacionService.pagos.push(pago)
    this.close(pago);
  }

  calculaMonto(doctosRelacionados) {
    let monto = 0;

    doctosRelacionados.forEach(doc => {
      monto += doc.impPagado;
    });

    return monto;
  }

  close(result) {
    this.dialogRef.close(result);
  }

  /* #region  Properties */
  get fechaPago() {
    return this.regForm.get('fechaPago');
  }

  get formaPago() {
    return this.regForm.get('formaPago');
  }

  get moneda() {
    return this.regForm.get('moneda');
  }

  get noOperacion() {
    return this.regForm.get('noOperacion');
  }

  get doctosRelacionados() {
    return this.regForm.get('doctosRelacionados') as FormArray;
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

  get certPago() {
    return this.regForm.get('certPago');
  }

  get cadPago() {
    return this.regForm.get('cadPago');
  }

  get selloPago() {
    return this.regForm.get('selloPago');
  }

  /* #endregion */

}
