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
    this.formaPago.setValue('01');
    this.docRelacionados.removeAt(0);
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
      docRelacionados: this.fb.array([this.agregarArray(new DoctoRelacionado)], { validators: Validators.required }),
      numeroCuentaOrd: ['', [Validators.required]],
      rfcEntidadEmisoraOrd: ['', [Validators.required]],
      bancoOrd: ['', [Validators.required]],
      numeroCuentaBen: ['', [Validators.required]],
      rfcEntidadEmisoraBen: ['', [Validators.required]],
      tipoCadenaPago: ['', [Validators.required]],
      certPago: ['', [Validators.required]],
      cadPago: ['', [Validators.required]],
      selloPago: ['', [Validators.required]]
    });
  }

  agregarArray(doc: DoctoRelacionado): FormGroup {
    return this.fb.group({
      idDocumento: [doc.idDocumento],
      fEmision: [doc.fEmision],
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

  guardarPago() {
    if (this.regForm.valid) {
      // this._pagoService.guardarPago(this.regForm.value).subscribe(res => {
      //   if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
      //     this.regForm.get('_id').setValue(res._id);
      //     this.socket.emit('newpago', res);
      //     this.router.navigate(['/pagos/pago', this.regForm.get('_id').value]);
      //   } else {
      //     this.socket.emit('updatepago', res);
      //   }
      //   this.regForm.markAsPristine();
      // });
    }
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
          this.docRelacionados.push(this.agregarArray(docRelacionado));          
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

  close(): void {
    this.dialogRef.close();
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

  get docRelacionados() {
    return this.regForm.get('docRelacionados') as FormArray;
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
