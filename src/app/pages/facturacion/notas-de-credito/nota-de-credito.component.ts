import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CFDI } from '../models/cfdi.models';
import { UsuarioService } from '../../usuarios/usuario.service';
import { Usuario } from '../../usuarios/usuario.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturacionService } from '../facturacion.service';
import { Serie } from '../models/serie.models';
import * as _moment from 'moment';
import { Concepto } from '../models/concepto.models';
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
  usuarioLogueado = new Usuario;
  series: Serie[] = [];
  formasPago = [];
  url: string;
  metodosPago = [];
  usosCFDI = [];
  SelectorConcepto;
  selectCon;
  pusSubtotal = [];
  tipoRelacion = '';
  tiposComprobante = [];
  getCFDIS = [];
  productos = [];
  okconcepto = false;
  Notas = new CFDI('', 0, '', '', '', '', 0, '', 0, '', '', new Date(), '', '', '', '', '', '', '', '', '', []);
  id;

  constructor(private usuarioService: UsuarioService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public facturacionService: FacturacionService,
    private fb: FormBuilder) { }

  ngOnInit() {
    // this.getConceptos();
    const getLocalStorageCFDIS = JSON.parse(localStorage.getItem('cfdis'));
    const getLocalStorageTipo = JSON.parse(localStorage.getItem('tipoRelacion'));
    if (getLocalStorageCFDIS !== null) {
      this.tipoRelacion = getLocalStorageTipo.clave + ' - ' + getLocalStorageTipo.descripcion;
      this.getCFDIS = getLocalStorageCFDIS;

      this.usuarioLogueado = this.usuarioService.usuario;
      this.id = this.activatedRoute.snapshot.paramMap.get('id');

      this.facturacionService.getSeries().subscribe(series => {
        this.series = series.series;
        if (localStorage.getItem('IE') === 'E') {
          this.serie.setValue(this.series[1].serie);
          this.folio.setValue(this.series[1].folio);
        }
      });
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
        localStorage.setItem('prodSer', JSON.stringify(productos.productos_servicios[8]));
      });
      this.createFormGroup();
      this.cargarValoresNuevo();
      this.facturacionService.getUsosCFDI().subscribe(usosCFDI => {
        this.usosCFDI = usosCFDI.usosCFDI;
      });
    } else {
      this.createFormGroup();
      swal('Error', 'No se encuentra ningun CFDI asociado', 'error')
    }
    this.url = '/cfdis';
  }

  getConceptos() {
    this.facturacionService.getProductosServicios().subscribe(productos => {
      this.productos = productos.productos_servicios;
    });
  }
  cargarValoresNuevo() {
    let subtotal = 0.00;
    this.conceptosCFDI.controls = [];
    this.conceptosCFDI.setValue([]);
    const getProdLocalStorage = JSON.parse(localStorage.getItem('prodSer'));
    this.moneda.setValue('MXN');
    // ! ==== FECHA =====  //
    const timeZone = moment().format('Z');
    const fecha = moment().utcOffset(timeZone).format('YYYY-MM-DDTHH:mm:ss');
    this.fecha.setValue(fecha);
    // ! ==== FIN FECHA =====  //

    // ! ==== RECEPTOR =====  //
    const getLocalStorageCFDI = JSON.parse(localStorage.getItem('cfdis'));
    this.rfc.setValue(getLocalStorageCFDI[0].rfc);
    this.nombre.setValue(getLocalStorageCFDI[0].nombre);
    this.usoCFDI.setValue(getLocalStorageCFDI[0].usoCFDI);
    this.direccion.setValue(getLocalStorageCFDI[0].direccion);
    this.correo.setValue(getLocalStorageCFDI[0].correo);
    // !==== FIN RECEPTOR=====//

    // !==== CONCEPTOS====//
    getLocalStorageCFDI.forEach(c => {
      const conceptosN = new Concepto();
      conceptosN._id = c._id;
      conceptosN.unidad = '0';
      conceptosN.cantidad = this.cantidadV(getLocalStorageCFDI.length, 'D');
      conceptosN.cfdis = getLocalStorageCFDI;
      conceptosN.valorUnitario = getLocalStorageCFDI !== undefined ? this.truncateDecimals(c.total.$numberDecimal, 4) : 0.00;
      conceptosN.descuento = 0.00;
      conceptosN.claveProdServ = getProdLocalStorage.claveSAT.claveProdServ;
      conceptosN.claveUnidad = getProdLocalStorage.unidadSAT.claveUnidad;
      conceptosN.descripcion = getProdLocalStorage.descripcion;
      conceptosN.noIdentificacion = getProdLocalStorage.codigo;
      conceptosN.importe = getLocalStorageCFDI !== undefined ? this.truncateDecimals(c.total.$numberDecimal, 4) : 0.00;
      this.pusSubtotal.push(c.total.$numberDecimal);
      this.conceptosCFDI.push(this.agregarArray(conceptosN));
      console.log(this.Notas);
      this.Notas.conceptos = this.conceptosCFDI.value;
    });
    // !==== FIN CONCEPTOS====//
    this.subtotal.setValue(this.cantidadV(this.pusSubtotal, 'S'));
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
    return valorR;
  }
  guardar() {
    if (this.id === 'nuevo') {
      // this.consultarNotas();
    } else {
      // this.guardarNotas();
    }
  }
  selectConcepto(event, concepto) {
    let pos = 0;
    this.SelectorConcepto = event.source.triggerValue;
    this.selectCon = this.SelectorConcepto;
    pos = concepto.find(p => p._id === event.value);
    localStorage.setItem('prodSer', JSON.stringify(pos));
  }

  conceptosSelect(event) {
    if (event.value) {
      this.okconcepto = true;
    }

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
      valorUnitario: [''],
      importe: [''],
      concept: [''],
      informacionAdicional: [{ value: '', disabled: true }],
      impuestos: [''],
      unidad: [''],
      totalDescuentos: [{ value: '', disabled: true }],
      // maniobras: [''],
      impuestosRetenidos: [''],
      impuestosTrasladados: [''],
      conceptosCFDI: this.fb.array([this.agregarArray(new Concepto)], { validators: Validators.required }),
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

  agregarArray(conceptos: Concepto): FormGroup {
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
      maniobras: [conceptos.cfdis],
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

  get conceptosCFDI() {
    return this.regForm.get('conceptosCFDI') as FormArray;
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
