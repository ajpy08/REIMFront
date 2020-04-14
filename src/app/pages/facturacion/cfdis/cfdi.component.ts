import { FacturacionService } from './../facturacion.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Serie } from '../models/serie.models';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
const moment = _moment;

// export const MY_FORMATS = {
//   parse: {
//       datetime: ['DD.MM.YYYY HH:mm:ss', 'DD.MM.YYYY HH:mm'],
//       date: 'DD.MM.YYYY',
//       time: ['HH:mm:ss', 'HH:mm']
//   },
//   display: {
//       datetime: 'DD.MM.YYYY HH:mm',
//       date: 'DD.MM.YYYY',
//       time: 'HH:mm',
//       monthDayLabel: 'MMMM D',
//       monthDayA11yLabel: 'MMMM D',
//       monthYearLabel: 'MMMM YYYY',
//       monthYearA11yLabel: 'MMMM YYYY',
//       dateA11yLabel: 'LLLL',
//       timeLabel: 'HH:mm'
//   },
// };

export const MY_FORMATS = {
  parse: {
    dateInput: ['l', 'L'],
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-cfdi',
  templateUrl: './cfdi.component.html',
  styleUrls: ['./cfdi.component.css'],
  providers: [{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  {provide: MAT_DATE_LOCALE, useValue: 'es-mx' }]
})
export class CFDIComponent implements OnInit {
  regForm: FormGroup;
  url: string;
  series: Serie[] = [];
  formasPago = [];
  tiposComprobante = [];

  @Input() IE = '';

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private facturacionService: FacturacionService) { }

  ngOnInit() {
    this.createFormGroup();
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.facturacionService.getSeries().subscribe(series => {
      this.series = series.series;
      this.serie.setValue(this.series[0]);
    });

    this.facturacionService.getFormasPago().subscribe(formasPago => {
      this.formasPago = formasPago.formasPago;
      this.formaPago.setValue(formasPago.formasPago[2]);
    });

    this.facturacionService.getTiposComprobante().subscribe(tiposComprobante => {
      this.tiposComprobante = tiposComprobante.tiposComprobante;
      this.tipoComprobante.setValue(this.facturacionService.IE);
    });

    if (id !== 'nuevo') {
      this.cargarCFDI(id);
    } else {
      this.cargaValoresIniciales();
      // tslint:disable-next-line: forin
      // for (const control in this.regForm.controls) {
      //   this.regForm.controls[control.toString()].setValue(undefined);
      // }
    }

    // this.impuestos.removeAt(0);
    this.url = '/cfdis';
  }

  cargaValoresIniciales() {
    // this.serie.setValue(this.series[0]);
    // this.formaPago.setValue('03');
    this.moneda.setValue('MXN');
    // this.tipoComprobante.setValue('Ingreso');

    const timeZone = moment().format('Z');
    const fecha = moment().utcOffset(timeZone).format('YYYY-MM-DDTHH:mm:ss');

    this.fecha.setValue(fecha);
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      // Generales
      serie: [''],
      folio: [{ value: '', disabled: true }, [Validators.required]],
      sucursal: [''],
      formaPago: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      tipoComprobante: ['', [Validators.required]],
      // tipoComprobante: [{ value: '', disabled: true }, [Validators.required]],
      fecha: ['', [Validators.required]],
      // fecha: [moment().local().startOf('day')],
      // Receptor
      receptor: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      usoCFDI: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      // Conceptos
      // conceptos: ['', [Validators.required]],
      // maniobras: ['', [Validators.required]],
      // CFDIs Relacionados
      // cfdiRelacionados: ['', [Validators.required]],
      // Totales
      subtotal: ['', [Validators.required]],
      totalImpuestos: ['', [Validators.required]],
      total: ['', [Validators.required]],
      // TR: [''],
      // impuesto: [''],
      // valor: [16.0000],
      // impuestos: this.fb.array([this.agregarArray(new Impuesto)]),
      _id: ['']
    });
  }

  cargarCFDI(id: string) {

  }

  guardarCFDI() {
    if (this.regForm.valid) {
      // this._buqueService.guardarBuque(this.regForm.value).subscribe(res => {
      //   if ( this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined ) {
      //     this.regForm.get('_id').setValue(res._id);
      //     this.socket.emit('newbuque', res);
      //     this.router.navigate(['/buques/buque', this.regForm.get('_id').value]);
      //   } else {
      //     this.socket.emit('updatebuque', res);
      //   }
      //   this.regForm.markAsPristine();
      // });
    }
  }

  cambioSerie(serie) {
    this.folio.setValue(serie.folio);
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');
  }

  /* #region  Properties */
  get serie() {
    return this.regForm.get('serie');
  }

  get folio() {
    return this.regForm.get('folio');
  }

  get sucursal() {
    return this.regForm.get('sucursal');
  }

  get formaPago() {
    return this.regForm.get('formaPago');
  }

  get moneda() {
    return this.regForm.get('moneda');
  }

  get tipoComprobante() {
    return this.regForm.get('tipoComprobante');
  }

  get fecha() {
    return this.regForm.get('fecha');
  }

  get receptor() {
    return this.regForm.get('receptor');
  }

  get rfc() {
    return this.regForm.get('rfc');
  }

  get nombre() {
    return this.regForm.get('nombre');
  }

  get usoCFDI() {
    return this.regForm.get('usoCFDI');
  }

  get direccion() {
    return this.regForm.get('direccion');
  }

  get correo() {
    return this.regForm.get('correo');
  }

  get subtotal() {
    return this.regForm.get('subtotal');
  }

  get totalImpuestos() {
    return this.regForm.get('totalImpuestos');
  }

  get total() {
    return this.regForm.get('total');
  }
  /* #endregion */
}
