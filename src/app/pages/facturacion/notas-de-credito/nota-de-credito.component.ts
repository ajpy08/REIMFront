import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NOTAS } from '../models/notas.models';
import { UsuarioService } from '../../usuarios/usuario.service';
import { Usuario } from '../../usuarios/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturacionService } from '../facturacion.service';
import { Serie } from '../models/serie.models';
import * as _moment from 'moment';
import { NotasConcepto } from '../models/NotasConcepto.models';
// import { Concepto } from '../models/concepto.models';
declare var swal: any;
const moment = _moment;

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
  selector: 'app-nota-de-credito',
  templateUrl: './nota-de-credito.component.html',
  styleUrls: ['./nota-de-credito.component.css'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  { provide: MAT_DATE_LOCALE, useValue: 'es-mx' }]
})

export class NotaDeCreditoComponent implements OnInit {
  regForm: FormGroup;
  conceptoCargado;
  usuarioLogueado = new Usuario;
  series: Serie[] = [];
  formasPago = [];
  url: string;
  metodosPago = [];
  usosCFDI = [];
  SelectorConcepto;
  selectCon;
  ObjetoSelect = [];
  pusSubtotal = [];
  pusImpuestos = [];
  tipoRelacion = '';
  tipoR = '';
  tiposComprobante = [];
  getCFDIS = [];
  getLocalStorageCFDIS;
  getLocalStorageTipo;
  getProdLocalStorage;
  productos = [];
  okconcepto = false;
  Notas;
  id;

  constructor(private usuarioService: UsuarioService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public facturacionService: FacturacionService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.getLocalStorageCFDIS = JSON.parse(localStorage.getItem('cfdis'));
    this.getLocalStorageTipo = JSON.parse(localStorage.getItem('tipoRelacion'));
    this.getProdLocalStorage = JSON.parse(localStorage.getItem('prodSer'));
    this.createFormGroup();
    this.Notas = new NOTAS('', 0, '', '', '', '', 0, '', '', '', '', new Date(), '', '', '', '', '', '', '', '', '', [], 0, 0, '', '');
    this.url = '/cfdis';
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.facturacionService.getSeries().subscribe(series => {
      this.series = series.series;
      if (localStorage.getItem('IE') === 'E') {
        this.serie.setValue(this.series[1].serie);
        this.folio.setValue(this.series[1].folio);
      }
    });


    let T_R = JSON.parse(localStorage.getItem('tipoRelacion'));
    if (T_R !== null) {
      this.tipoR = T_R.clave;
    }

    this.facturacionService.getTiposComprobante().subscribe(tiposComprobante => {
      this.tiposComprobante = tiposComprobante.tiposComprobante;
      this.tipoComprobante.setValue(localStorage.getItem('IE'));
    });

    this.facturacionService.getFormasPago().subscribe(formasPago => {
      this.formasPago = formasPago.formasPago;
      this.formaPago.setValue(formasPago.formasPago[2].formaPago);
    });
    this.facturacionService.getMetodosPago().subscribe(metodosPago => {
      this.metodosPago = metodosPago.metodosPago;
      this.metodoPago.setValue(metodosPago.metodosPago[1].metodoPago);
    });

    this.facturacionService.getProductosServicios().subscribe(productos => {
      let pos = 0;
      this.productos = productos.productos_servicios;
      pos = this.productos.findIndex(p => p.codigo === 'TLR18');
      this.concept.setValue(productos.productos_servicios[pos]._id);
      this.selectCon = productos.productos_servicios[pos].codigo + ' - ' + productos.productos_servicios[pos].descripcion;
      localStorage.setItem('prodSer', JSON.stringify(productos.productos_servicios[pos]));
    });

    this.facturacionService.getUsosCFDI().subscribe(usosCFDI => {
      this.usosCFDI = usosCFDI.usosCFDI;
    });
    if (this.getLocalStorageCFDIS !== null && this.getLocalStorageCFDIS.length > 0) {
      this.tipoRelacion = this.getLocalStorageTipo.clave + ' - ' + this.getLocalStorageTipo.descripcion;
      this.getCFDIS = this.getLocalStorageCFDIS;
      this.usuarioLogueado = this.usuarioService.usuario;
      this.cargarValoresNuevo();

    }
    if (this.id !== 'nuevo') {
      this.cargarNota(this.id);
    }
  }


  cargarNota(id: string) {
    this.conceptos.removeAt(0);
    let concepts;
    this.facturacionService.getCFDI(id).subscribe(res => {
      this.Notas = res;
      // tslint:disable-next-line: forin
      for (const propiedad in this.Notas) {
        for (const control in this.regForm.controls) {
          if (propiedad === control.toString() && propiedad !== 'conceptos') {
            if (res[propiedad].$numberDecimal) {
              this.regForm.controls[propiedad].setValue(res[propiedad].$numberDecimal);
            } else {
              this.regForm.controls[propiedad].setValue(res[propiedad]);
            }
          } else {
            if (propiedad === control.toString() && propiedad === 'conceptos') {
              concepts = res[propiedad];
              if (concepts !== undefined) {
                concepts.forEach(co => {
                  for (const prop in co) {
                    if (co[prop].$numberDecimal) {
                      co[prop] = parseFloat(co[prop].$numberDecimal);
                    } else {
                      if (prop === 'impuestos') {
                        if (co[prop]) {
                          co[prop].forEach(imp => {
                            for (const i in imp) {
                              if (imp[i].$numberDecimal) {
                                imp[i] = parseFloat(imp[i].$numberDecimal);
                              }
                            }
                          });
                        }
                      }
                    }
                  }
                });
                this.Notas.conceptos = concepts;
              }
            }
          }
        }
      }
      if (this.Notas.conceptos.length > 0) {
        let subTotal = 0;
        // VALIDAR
        this.Notas.conceptos.forEach(concepto => {
          let impuestosRetenidos = 0;
          let impuestosTrasladados = 0;
          subTotal += concepto.importe;
          concepto.impuestos.forEach(impuesto => {
            if (impuesto.TR === 'RETENCION') {
              impuestosRetenidos += impuesto.importe;
            } else {
              if (impuesto.TR === 'TRASLADO') {
                impuestosTrasladados += impuesto.importe;
              }
            }
          });
          this.conceptos.push(this.agregarArray(new NotasConcepto(
            concepto.cantidad,
            concepto.claveProdServ,
            concepto.claveUnidad,
            concepto.descripcion,
            concepto.noIdentificacion,
            concepto.valorUnitario,
            concepto.importe,
            concepto.impuestos,
            concepto.unidad,
            concepto.descuento,
            concepto.cfdis,
            impuestosRetenidos,
            impuestosTrasladados,
            concepto._id)));
        });
      } else {
        this.regForm.controls['conceptos'].setValue(undefined);
      }
    });
  }



  getConceptos() {
    this.facturacionService.getProductosServicios().subscribe(productos => {
      this.productos = productos.productos_servicios;
    });
  }
  cargarValoresNuevo() {
    const subtotal = 0.00;
    let totalImpuestosRetenidos = 0;
    let totalImpuestosTrasladados = 0;

    this.conceptos.controls = [];
    this.conceptos.setValue([]);
    // const getProdLocalStorage = JSON.parse(localStorage.getItem('prodSer'));
    this.moneda.setValue('MXN');
    // ! ==== FECHA =====  //
    const timeZone = moment().format('Z');
    const fecha = moment().utcOffset(timeZone).format('YYYY-MM-DDTHH:mm:ss');
    this.fecha.setValue(fecha);
    // ! ==== FIN FECHA =====  //

    // ! TIPO RELACION //

    this.tipoRelacionNota.setValue(this.tipoR);

    // ! ==== RECEPTOR =====  //
    this.rfc.setValue(this.getLocalStorageCFDIS[0].rfc);
    this.nombre.setValue(this.getLocalStorageCFDIS[0].nombre);
    this.usoCFDI.setValue(this.getLocalStorageCFDIS[0].usoCFDI);
    this.direccion.setValue(this.getLocalStorageCFDIS[0].direccion);
    this.correo.setValue(this.getLocalStorageCFDIS[0].correo);
    // !==== FIN RECEPTOR=====//

    // !==== CONCEPTOS====//
    this.getLocalStorageCFDIS.forEach(c => {
      let impuestosRetenidos = 0.00;
      let importe = 0;
      let impuestosTrasladados = 0.00;
      const conceptosN = new NotasConcepto();
      conceptosN._id = this.getProdLocalStorage._id;
      conceptosN.unidad = '0';
      conceptosN.cantidad = this.cantidadV(this.getLocalStorageCFDIS.length, 'D');
      // conceptosN.cfdis = c._id;
      conceptosN.valorUnitario = this.getLocalStorageCFDIS !== undefined ? this.truncateDecimals(c.total.$numberDecimal, 4) : 0.00;
      conceptosN.descuento = 0.00;
      conceptosN.claveProdServ = this.getProdLocalStorage.claveSAT.claveProdServ;
      conceptosN.claveUnidad = this.getProdLocalStorage.unidadSAT.claveUnidad;
      conceptosN.descripcion = this.getProdLocalStorage.descripcion + `\n ${c.serie}-${c.folio}`;
      conceptosN.noIdentificacion = this.getProdLocalStorage.codigo;
      conceptosN.importe = this.truncateDecimals(conceptosN.valorUnitario * conceptosN.cantidad, 4);
      // conceptosN.importe = getLocalStorageCFDI !== undefined ? this.truncateDecimals(c.total.$numberDecimal, 4) : 0.00;
      this.pusSubtotal.push(c.total.$numberDecimal);


      this.getProdLocalStorage.impuestos.forEach(pro => {
        pro.importe = this.truncateDecimals(conceptosN.importe * (pro.tasaCuota / 100), 4);
        if (pro.TR === 'TRASLADO') {
          impuestosTrasladados += this.truncateDecimals(conceptosN.importe * (pro.tasaCuota / 100), 4);
          totalImpuestosTrasladados += impuestosTrasladados;
        } else {
          if (pro.TR === 'RETENCION') {
            impuestosRetenidos += this.truncateDecimals(conceptosN.importe * (pro.tasaCuota / 100), 4);
            totalImpuestosRetenidos += impuestosRetenidos;
          }
        }
        // this.impuestos.setValue(this.cantidadV(this.pusImpuestos, 'I'));
      });

      conceptosN.impuestos = this.getProdLocalStorage.impuestos;
      conceptosN.impuestosTrasladados = this.truncateDecimals(impuestosTrasladados, 4);
      conceptosN.impuestosRetenidos = this.truncateDecimals(impuestosRetenidos, 4);
      conceptosN.cfdis = [{ idCFDI: c._id, uuid: c.uuid }];

      this.conceptos.push(this.agregarArray(conceptosN));
      this.getProdLocalStorage = JSON.parse(localStorage.getItem('prodSer'));
      this.Notas.conceptos = this.conceptos.value;
      this.pusImpuestos.push(impuestosTrasladados, impuestosRetenidos);
    });
    this.subtotal.setValue(this.cantidadV(this.pusSubtotal, 'S'));
    this.totalImpuestosRetenidos.setValue(this.round(totalImpuestosRetenidos, 2));
    this.totalImpuestosTrasladados.setValue(this.round(totalImpuestosTrasladados, 2));
    this.total.setValue(this.round(this.subtotal.value - this.totalDescuentos.value +
      this.totalImpuestosTrasladados.value - this.totalImpuestosRetenidos.value, 2));
    // !==== FIN CONCEPTOS====//
  }

  recalcularValor(valor) {
    if (valor.valorUnitario > valor.importe) {
      swal('Error', 'El valor unitario debe de ser menor a ' + valor.importe, 'error');
      this.recargarConceptos();
    } else {
      const posicion = this.Notas.conceptos.findIndex(a => a.cfdis === valor.cfdis);
      if (posicion >= 0) {
        this.Notas = this.regForm.getRawValue();
        this.Notas.conceptos[posicion] = valor;
      }
      this.recargaValoresNotas();
    }
  }

  recargaValoresNotas() {
    let totalImpuestosRetenidos = 0;
    let totalImpuestosTrasladados = 0;
    // let totalDescuentos = 0;
    let subTotal = 0.0;
    let totalDescuentos = 0.0;
    this.createFormGroup();
    this.conceptos.removeAt(0);
    this.ObjetoSelect = [];
    // tslint:disable-next-line: forin

    // tslint:disable-next-line: forin
    for (const propiedad in this.Notas) {
      for (const control in this.regForm.controls) {
        if (propiedad === control.toString() && propiedad !== 'conceptos') {
          this.regForm.controls[propiedad].setValue(this.Notas[propiedad]);
        }
      }
    }

    if (this.Notas.conceptos.length > 0) {
      this.Notas.conceptos.forEach(concepto => {

        let impuestosRetenidos = 0.00;
        let impuestosTrasladados = 0.00;
        concepto.cantidad = concepto.cantidad;
        concepto.cfdis = concepto.cfdis;
        concepto.importe = this.round(concepto.valorUnitario * concepto.cantidad, 2);
        subTotal += concepto.importe;
        totalDescuentos += concepto.descuento;
        // totalDescuentos += concepto.descuento;
        concepto.impuestos.forEach(impuesto => {
          impuesto.importe = this.truncateDecimals(concepto.importe * (impuesto.tasaCuota / 100), 4);
          if (impuesto.TR === 'RETENCION') {
            impuestosRetenidos += this.truncateDecimals(concepto.importe * (impuesto.tasaCuota / 100), 4);
            totalImpuestosRetenidos += impuestosRetenidos;
            // impuestosRetenidos += impuesto.importe;
            // totalImpuestosRetenidos += concepto.importe * (impuesto.tasaCuota / 100);
          } else {
            if (impuesto.TR === 'TRASLADO') {
              impuestosTrasladados += this.truncateDecimals(concepto.importe * (impuesto.tasaCuota / 100), 4);
              totalImpuestosTrasladados += impuestosTrasladados;
              // impuestosTrasladados += impuesto.importe;
              // totalImpuestosTrasladados += concepto.importe * (impuesto.tasaCuota / 100);
            }
          }
        });

        this.subtotal.setValue(this.round(subTotal, 2));
        this.totalImpuestosRetenidos.setValue(this.round(totalImpuestosRetenidos, 2));
        this.totalImpuestosTrasladados.setValue(this.round(totalImpuestosTrasladados, 2));
        this.totalDescuentos.setValue(this.round(totalDescuentos, 2));
        this.total.setValue(this.round(this.subtotal.value - this.totalDescuentos.value +
          this.totalImpuestosTrasladados.value - this.totalImpuestosRetenidos.value, 2));
        this.tipoRelacionNota.setValue(this.tipoR);

        this.conceptos.push(this.agregarArray(new NotasConcepto(
          concepto.cantidad,
          concepto.claveProdServ,
          concepto.claveUnidad,
          concepto.descripcion,
          concepto.noIdentificacion,
          concepto.valorUnitario,
          concepto.importe,
          concepto.impuestos,
          concepto.unidad,
          concepto.descuento,
          concepto.cfdis,
          impuestosRetenidos,
          impuestosTrasladados,
          concepto._id)));

      });

    } else {
      this.subtotal.setValue(this.round(subTotal, 2));
      this.totalImpuestosRetenidos.setValue(this.round(totalImpuestosRetenidos, 2));
      this.totalImpuestosTrasladados.setValue(this.round(totalImpuestosTrasladados, 2));
      this.totalDescuentos.setValue(this.round(totalDescuentos, 2));
      this.total.setValue(this.round(this.subtotal.value - this.totalDescuentos.value +
        this.totalImpuestosTrasladados.value - this.totalImpuestosRetenidos.value, 2));
    }
  }

  cantidadV(valor, tipo) {
    let valorR = 0;
    if (tipo === 'D') {
      valorR = valor / valor;
    }
    if (tipo === 'S') {
      valor.forEach(s => {
        const n = parseFloat(s);
        valorR = valorR + n;
      });
    }
    if (tipo === 'I') {
      valor.reduce(function (a, b) {
        valorR = a - b;
      });

    }

    let val = valorR.toString();
    let val2  = val.split('.');
    if (val2.length >= 2) {
      const V = val2[1].substr(0, 3);
      const R = val2[0] + '.' + V;
      valorR = parseFloat(R);
    }
    return valorR;
  }



  guardarNotas() {
    if (this.regForm.valid) {
      this.facturacionService.guardarNotas(this.regForm.getRawValue()).subscribe(res => {
        if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
          this.regForm.get('_id').setValue(res._id);
          this.id = res._id;

          localStorage.removeItem('cfdis');
          localStorage.removeItem('prodSer');
          localStorage.removeItem('tipoRelacion');

          // this.socket.emit('newcfdi', res);
          this.router.navigate(['/cfdis']);
          this.router.navigate(['/nota_de_credito/', this.regForm.get('_id').value]);
        } else {
          // this.socket.emit('updatecfdi', res);
        }
        // VACIAR LOCAL STORAGE
        this.regForm.markAsPristine();
      });
    } else {
      swal('ERROR', 'Faltan datos obligatorios!', 'error');
    }
  }

  selectConcepto(event, concepto) {
    let pos = 0;
    this.SelectorConcepto = event.source.triggerValue;
    this.selectCon = this.SelectorConcepto;
    pos = concepto.find(p => p._id === event.value);
    localStorage.setItem('prodSer', JSON.stringify(pos));
    this.recargarConceptos();
  }

  recargarConceptos() { // ! ESTE METODO FUNCIONA CUANDO SE CAMBIA EL SELECT DE CONCEPTOS
    this.pusSubtotal = [];
    this.getProdLocalStorage = JSON.parse(localStorage.getItem('prodSer'));
    this.conceptos.controls = [];
    const subtotal = 0.00;
    let totalImpuestosRetenidos = 0;
    let totalImpuestosTrasladados = 0;

    this.getLocalStorageCFDIS.forEach(c => {
      let impuestosRetenidos = 0.00;
      let impuestosTrasladados = 0.00;
      const conceptosN = new NotasConcepto();
      conceptosN._id = c._id;
      conceptosN.unidad = '0';
      conceptosN.cantidad = this.cantidadV(this.getLocalStorageCFDIS.length, 'D');
      conceptosN.cfdis = this.getLocalStorageCFDIS;
      conceptosN.valorUnitario = this.getLocalStorageCFDIS !== undefined ? this.truncateDecimals(c.total.$numberDecimal, 4) : 0.00;
      conceptosN.descuento = 0.00;
      conceptosN.claveProdServ = this.getProdLocalStorage.claveSAT.claveProdServ;
      conceptosN.claveUnidad = this.getProdLocalStorage.unidadSAT.claveUnidad;
      conceptosN.descripcion = this.getProdLocalStorage.descripcion + ' : ' + c.serie + ' - ' + c.folio;
      conceptosN.noIdentificacion = this.getProdLocalStorage.codigo;
      conceptosN.importe = this.getLocalStorageCFDIS !== undefined ? this.truncateDecimals(c.total.$numberDecimal, 4) : 0.00;
      this.pusSubtotal.push(c.total.$numberDecimal);

      this.Notas.conceptos = this.conceptos.value;

      this.getProdLocalStorage.impuestos.forEach(pro => {
        pro.importe = this.truncateDecimals(conceptosN.importe * (pro.tasaCuota / 100), 4);
        if (pro.TR === 'TRASLADO') {
          impuestosTrasladados += this.truncateDecimals(conceptosN.importe * (pro.tasaCuota / 100), 4);
          totalImpuestosTrasladados += impuestosTrasladados;
        } else {
          if (pro.TR === 'RETENCION') {
            impuestosRetenidos += this.truncateDecimals(conceptosN.importe * (pro.tasaCuota / 100), 4);
            totalImpuestosRetenidos += impuestosRetenidos;
          }
        }
        // this.pusImpuestos.push(impuestosTrasladados, impuestosRetenidos);
      });
      conceptosN.impuestos = this.getProdLocalStorage.impuestos;
      conceptosN.impuestosTrasladados = this.truncateDecimals(impuestosTrasladados, 4);
      conceptosN.impuestosRetenidos = this.truncateDecimals(impuestosRetenidos, 4);
      this.subtotal.setValue(this.cantidadV(this.pusSubtotal, 'S'));
      this.totalImpuestosRetenidos.setValue(this.round(totalImpuestosRetenidos, 2));
      this.totalImpuestosTrasladados.setValue(this.round(totalImpuestosTrasladados, 2));
      this.total.setValue(this.round(this.subtotal.value - this.totalDescuentos.value +
        this.totalImpuestosTrasladados.value - this.totalImpuestosRetenidos.value, 2));
      this.conceptos.push(this.agregarArray(conceptosN));
      // this.impuestos.setValue(this.cantidadV(this.pusImpuestos, 'I'));
    });
  }

  conceptosSelect(event) {
    if (event.value) {
      this.okconcepto = true;
    }

  }

  round(number: number, digits) {
    const n = parseFloat((Math.round(number * 100) / 100).toFixed(digits));
    return n;
  }

  cambioSerie(serie) {
    this.facturacionService.getSerieXSerie(serie).subscribe(s => {
      this.serie.setValue(s.serie);
      this.folio.setValue(s.folio);
    });
  }
  truncateDecimals(num, digits) {
    const numS = num.toString(),
      decPos = numS.indexOf('.'),
      substrLength = decPos === -1 ? numS.length : 1 + decPos + digits,
      trimmedResult = numS.substr(0, substrLength),
      finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

    return parseFloat(finalResult);
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      // GENERALES
      fecha: [{ value: '', disable: true }, [Validators.required]],
      folio: [{ value: '', disabled: true }, [Validators.required]],
      formaPago: ['', [Validators.required]],
      metodoPago: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      serie: ['', [Validators.required]],
      subtotal: [{ value: '', disabled: true }, [Validators.required]],
      tipoComprobante: [{ value: '', disabled: true }, [Validators.required]],
      total: [{ value: '', disabled: true }, [Validators.required]],
      // RECEPTOR
      nombre: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      usoCFDI: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      // CONCEPTOS
      cantidad: [''],
      claveProdServ: [''],
      claveUnidad: [''],
      descripcion: [''],
      noIdentificacion: [''],
      tipoRelacionNota: [''],
      valorUnitario: [''],
      importe: [''],
      concept: [''],
      impuestos: [''],
      unidad: [''],
      totalDescuentos: [{ value: '', disabled: true }],
      // maniobras: [''],
      impuestosRetenidos: [''],
      impuestosTrasladados: [''],
      conceptos: this.fb.array([this.agregarArray(new NotasConcepto)], { validators: Validators.required }),
      // CFDIS RELACIONADOS
      // cfdiRelacionados: ['', [Validators.required]],
      // IMPUESTOS
      // conceptos: [],
      totalImpuestosRetenidos: [{ value: '', disabled: true }, [Validators.required]],
      totalImpuestosTrasladados: [{ value: '', disabled: true }, [Validators.required]],
      sucursal: [{ value: '', disabled: true }],
      _id: ['']
    });
  }

  agregarArray(conceptos: NotasConcepto): FormGroup {
    return this.fb.group({
      // consecutivo: [concepto.consecutivo],
      _id: [conceptos._id],
      cantidad: [conceptos.cantidad],
      claveProdServ: [conceptos.claveProdServ],
      claveUnidad: [conceptos.claveUnidad],
      descripcion: [conceptos.descripcion],
      noIdentificacion: [conceptos.noIdentificacion],
      importe: [conceptos.importe],
      valorUnitario: [conceptos.valorUnitario],
      impuestos: [conceptos.impuestos],
      unidad: [conceptos.unidad],
      descuento: [conceptos.descuento],
      cfdis: [conceptos.cfdis],
      impuestosRetenidos: [conceptos.impuestosRetenidos],
      impuestosTrasladados: [conceptos.impuestosTrasladados]
    });
  }
  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');

  }

  get fecha() {
    return this.regForm.get('fecha');
  }

  get folio() {
    return this.regForm.get('folio');
  }

  // get sucursal() {
  //   return this.regForm.get('sucursal');
  // }

  get formaPago() {
    return this.regForm.get('formaPago');
  }

  get metodoPago() {
    return this.regForm.get('metodoPago');
  }

  get moneda() {
    return this.regForm.get('moneda');
  }

  get serie() {
    return this.regForm.get('serie');
  }

  get subtotal() {
    return this.regForm.get('subtotal');
  }

  get tipoComprobante() {
    return this.regForm.get('tipoComprobante');
  }
  get tipoRelacionNota() {
    return this.regForm.get('tipoRelacionNota');
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

  get cantidad() {
    return this.regForm.get('cantidad');
  }

  get claveProdServ() {
    return this.regForm.get('claveProdServ');
  }

  get claveUnidad() {
    return this.regForm.get('claveUnidad');
  }

  get descripcion() {
    return this.regForm.get('descripcion');
  }

  get noIdentificacion() {
    return this.regForm.get('noIdentificacion');
  }

  get valorUnitario() {
    return this.regForm.get('valorUnitario');
  }

  get importe() {
    return this.regForm.get('importe');
  }

  get impuestos() {
    return this.regForm.get('impuestos');
  }

  get unidad() {
    return this.regForm.get('unidad');
  }

  // get maniobras() {
  //   return this.regForm.get('maniobras');
  // }

  get impuestosRetenidos() {
    return this.regForm.get('impuestosRetenidos');
  }

  get impuestosTrasladados() {
    return this.regForm.get('impuestosTrasladados');
  }

  get conceptos() {
    return this.regForm.get('conceptos') as FormArray;
  }

  get totalImpuestosRetenidos() {
    return this.regForm.get('totalImpuestosRetenidos');
  }

  get totalImpuestosTrasladados() {
    return this.regForm.get('totalImpuestosTrasladados');
  }

  get totalDescuentos() {
    return this.regForm.get('totalDescuentos');
  }

  get total() {
    return this.regForm.get('total');
  }
  get concept() {
    return this.regForm.get('concept');
  }
  get informacionAdicional() {
    return this.regForm.get('informacionAdicional');
  }
}
