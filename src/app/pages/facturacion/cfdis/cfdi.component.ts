import { FacturacionService } from './../facturacion.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Serie } from '../models/serie.models';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { Concepto } from '../models/concepto.models';
import { NavieraService } from '../../navieras/naviera.service';
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
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  { provide: MAT_DATE_LOCALE, useValue: 'es-mx' }]
})
export class CFDIComponent implements OnInit {
  regForm: FormGroup;
  url: string;
  series: Serie[] = [];
  formasPago = [];
  metodosPago = [];
  tiposComprobante = [];
  usosCFDI = [];

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private facturacionService: FacturacionService,
    private navieraService: NavieraService) { }

  ngOnInit() {
    this.createFormGroup();

    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.facturacionService.getSeries().subscribe(series => {
      this.series = series.series;
      if (this.facturacionService.IE === 'I') {
        this.serie.setValue(this.series[0]);
        this.folio.setValue(this.series[0].folio);
      }
    });

    this.facturacionService.getFormasPago().subscribe(formasPago => {
      this.formasPago = formasPago.formasPago;
      this.formaPago.setValue(formasPago.formasPago[2]);
    });

    this.facturacionService.getMetodosPago().subscribe(metodosPago => {
      this.metodosPago = metodosPago.metodosPago;
      this.metodoPago.setValue(metodosPago.metodosPago[1]);
    });

    this.facturacionService.getTiposComprobante().subscribe(tiposComprobante => {
      this.tiposComprobante = tiposComprobante.tiposComprobante;
      this.tipoComprobante.setValue(this.facturacionService.IE);
    });

    this.facturacionService.getUsosCFDI().subscribe(usosCFDI => {
      this.usosCFDI = usosCFDI.usosCFDI;
    });

    this.conceptos.removeAt(0);

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

    /////////////////////////////////// FECHA /////////////////////////////////////
    const timeZone = moment().format('Z');
    const fecha = moment().utcOffset(timeZone).format('YYYY-MM-DDTHH:mm:ss');
    this.fecha.setValue(fecha);
    /////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////// RECEPTOR /////////////////////////////////////
    if (this.facturacionService.receptor) {
      if (this.facturacionService.tipo === 'Descarga') {
        this.navieraService.getNaviera(this.facturacionService.receptor).subscribe((naviera) => {
          this.rfc.setValue(naviera.rfc);
          this.nombre.setValue(naviera.razonSocial);
          this.usoCFDI.setValue(naviera.usoCFDI);
          let direccion = '';
          direccion += naviera.calle !== undefined && naviera.calle !== '' ? naviera.calle : '';
          direccion += naviera.noExterior !== undefined && naviera.noExterior !== '' ? ' ' + naviera.noExterior : '';
          direccion += naviera.colonia !== undefined && naviera.colonia !== '' ? ' ' +  naviera.colonia : '';
          direccion += naviera.municipio !== undefined && naviera.municipio !== '' ? ' ' +  naviera.municipio : '';
          direccion += naviera.ciudad !== undefined && naviera.ciudad !== '' ? ' ' +  naviera.ciudad : '';
          direccion += naviera.estado !== undefined && naviera.estado !== '' ? ' ' +  naviera.estado : '';
          direccion += naviera.cp !== undefined && naviera.cp !== '' ? ' ' +  naviera.cp : '';
          this.direccion.setValue(direccion.trim());
          this.correo.setValue(naviera.correoFac);
        });
      }
    }
    /////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////// CONCEPTO /////////////////////////////////////////////
    if (this.facturacionService.maniobras.length > 0) {
      const concepto = new Concepto();
      let impuestosRetenidos = 0;
      let impuestosTrasladados = 0;

      if (this.facturacionService.tipo === 'Descarga') {
        this.facturacionService.getProductoServicio(this.facturacionService.productoServ).subscribe((prodServ) => {
          concepto.productoServicio = prodServ;

          concepto.unidad = '';
          concepto.cantidad = this.facturacionService.maniobras.length;
          concepto.valorUnitario = concepto.productoServicio !== undefined ? concepto.productoServicio.valorUnitario : 0;
          if (concepto.productoServicio) {
            concepto.importe = concepto.valorUnitario * this.facturacionService.maniobras.length;
            concepto.productoServicio.impuestos.forEach(impuesto => {
              if (impuesto.impuesto === 'IVA') {
                if (impuesto.TR === 'RETENCION') {
                  impuestosRetenidos += concepto.importe * (impuesto.valor / 100);
                } else {
                  if (impuesto.TR === 'TRASLADO') {
                    impuestosTrasladados += concepto.importe * (impuesto.valor / 100);
                  }
                }
              }
            });
          }
          concepto.maniobras = this.facturacionService.maniobras;

          this.subtotal.setValue(concepto.importe);
          this.totalImpuestosRetenidos.setValue(impuestosRetenidos);
          this.totalImpuestosTrasladados.setValue(impuestosTrasladados);
          this.total.setValue(concepto.importe + impuestosTrasladados - impuestosRetenidos);

          this.conceptos.push(this.agregarArray(concepto));
        });
      }

      this.maniobras.setValue(this.facturacionService.maniobras);
    }
    /////////////////////////////////////////////////////////////////////////////////////////
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      // GENERALES
      serie: ['', [Validators.required]],
      folio: [{ value: '', disabled: true }, [Validators.required]],
      sucursal: [''],
      formaPago: ['', [Validators.required]],
      metodoPago: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      // tipoComprobante: ['', [Validators.required]],
      tipoComprobante: [{ value: '', disabled: true }, [Validators.required]],
      fecha: ['', [Validators.required]],
      // fecha: [moment().local().startOf('day')],
      // RECEPTOR
      // receptor: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      usoCFDI: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      // CONCEPTOS
      conceptos: this.fb.array([this.agregarArray(new Concepto)]),
      maniobras: ['', [Validators.required]],
      // CFDIS RELACIONADOS
      // cfdiRelacionados: ['', [Validators.required]],
      // TOTALES
      subtotal: ['', [Validators.required]],
      totalImpuestosRetenidos: [''],
      totalImpuestosTrasladados: [''],
      total: ['', [Validators.required]],
      _id: ['']
    });
  }

  agregarArray(concepto: Concepto): FormGroup {
    return this.fb.group({
      // consecutivo: [concepto.consecutivo],
      productoServicio: [concepto.productoServicio],
      unidad: [concepto.unidad],
      cantidad: [concepto.cantidad],
      valorUnitario: [concepto.valorUnitario],
      impuestosRetenidos: [concepto.impuestosRetenidos],
      impuestosTrasladados: [concepto.impuestosTrasladados],
      importe: [concepto.importe],
      descuento: [concepto.descuento],
      maniobras: [concepto.maniobras]
    });
  }

  quitar(indice: number) {
    this.conceptos.removeAt(indice);
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

  get metodoPago() {
    return this.regForm.get('metodoPago');
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

  get conceptos() {
    return this.regForm.get('conceptos') as FormArray;
  }

  get maniobras() {
    return this.regForm.get('maniobras');
  }

  get subtotal() {
    return this.regForm.get('subtotal');
  }

  get totalImpuestosRetenidos() {
    return this.regForm.get('totalImpuestosRetenidos');
  }

  get totalImpuestosTrasladados() {
    return this.regForm.get('totalImpuestosTrasladados');
  }

  get total() {
    return this.regForm.get('total');
  }
  /* #endregion */
}
