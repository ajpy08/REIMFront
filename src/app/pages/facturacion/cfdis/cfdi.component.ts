import { ClienteService } from './../../../services/cliente/cliente.service';
import { SolicitudService } from './../../solicitudes/solicitud.service';
/* #region  Imports */
import { ManiobrasCFDIComponent } from './../../../dialogs/maniobras-cfdi/maniobras-cfdi.component';
import { ManiobraService, UsuarioService } from 'src/app/services/service.index';
import { ImpuestosCFDIComponent } from './../../../dialogs/impuestos-cfdi/impuestos-cfdi.component';
import { FacturacionService } from './../facturacion.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Serie } from '../models/serie.models';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { Concepto } from '../models/concepto.models';
import { NavieraService } from '../../navieras/naviera.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CFDI } from '../models/cfdi.models';
import * as io from 'socket.io-client';
import { URL_SOCKET_IO, PARAM_SOCKET } from 'src/environments/environment';
import { ROLES, ESTADOS_CONTENEDOR } from 'src/app/config/config';
import { Usuario } from '../../usuarios/usuario.model';
declare var swal: any;
const moment = _moment;
/* #endregion */

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
export class CFDIComponent implements OnInit, OnDestroy {
  regForm: FormGroup;
  url: string;
  info = '';
  series: Serie[] = [];
  formasPago = [];
  maniobrasDeleteConcepto = [];
  metodosPago = [];
  tiposComprobante = [];
  usosCFDI = [];
  cfdi;
  idSelect;
  indiceSelect;
  ObjetoSelect = [];
  infoAd = '';
  usuarioLogueado = new Usuario;
  id;
  agrupado = true;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public facturacionService: FacturacionService,
    private navieraService: NavieraService,
    public matDialog: MatDialog,
    private usuarioService: UsuarioService,
    public maniobraService: ManiobraService,
    public solicitudService: SolicitudService,
    public clienteService: ClienteService) { }

  ngOnInit() {
    this.createFormGroup();

    this.cfdi = new CFDI('', 0, '', '', '', '', 0, '', 0, '', '', new Date(), '', '', '', '', '', '', '', '', '', []);
    this.usuarioLogueado = this.usuarioService.usuario;

    /* #region  Socket.IO */
    this.socket.on('update-cfdi', function (data: any) {
      if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
        if (data.data._id) {
          this.createFormGroup();
          this.cargarCFDI(data.data._id);
          if (data.data.usuarioMod !== this.usuarioLogueado._id) {
            swal({
              title: 'Actualizado',
              text: 'Otro usuario ha actualizado este cfdi',
              icon: 'info'
            });
          }
        }
      }
    }.bind(this));

    this.socket.on('delete-cfdi', function (data: any) {
      if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
        this.router.navigate(['/cfdis']);
        swal({
          title: 'Eliminado',
          text: 'Se elimino este CFDI por otro usuario',
          icon: 'warning'
        });
      }
    }.bind(this));

    this.socket.on('timbrado-cfdi', function (data: any) {
      if (data.data.ok === true) {
        this.router.navigate(['/cfdis']);
        swal({
          title: 'TIMBRANDO',
          text: 'CFDI: ' + data.data.serieFolio,
          icon: 'warning'
        });
      }
    }.bind(this));
    /* #endregion */

    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.facturacionService.peso === ESTADOS_CONTENEDOR.VACIO) {
      this.facturacionService.carritoAFacturar = this.facturacionService.aFacturarV;
    } else {
      this.facturacionService.carritoAFacturar = this.facturacionService.aFacturarM;
    }

    this.facturacionService.getSeries().subscribe(series => {
      this.series = series.series;
      if (this.facturacionService.IE === 'I') {
        this.serie.setValue(this.series[0].serie);
        this.folio.setValue(this.series[0].folio);
      }
    });

    this.facturacionService.getFormasPago().subscribe(formasPago => {
      this.formasPago = formasPago.formasPago;
      this.formaPago.setValue(formasPago.formasPago[2].formaPago);
    });

    this.facturacionService.getMetodosPago().subscribe(metodosPago => {
      this.metodosPago = metodosPago.metodosPago;
      this.metodoPago.setValue(metodosPago.metodosPago[1].metodoPago);
    });

    this.facturacionService.getTiposComprobante().subscribe(tiposComprobante => {
      this.tiposComprobante = tiposComprobante.tiposComprobante;
      this.tipoComprobante.setValue(this.facturacionService.IE);
    });

    this.facturacionService.getUsosCFDI().subscribe(usosCFDI => {
      this.usosCFDI = usosCFDI.usosCFDI;
    });

    this.conceptos.removeAt(0);

    if (this.id !== 'nuevo') {
      this.cargarCFDI(this.id);
    } else {
      // tslint:disable-next-line: forin
      for (const control in this.regForm.controls) {
        if (control.toString() !== 'conceptos') {
          this.regForm.controls[control.toString()].setValue(undefined);
        }
      }
      this.cargaValoresIniciales(undefined);
    }
    // this.impuestos.removeAt(0);
    this.url = '/cfdis';
  }

  ngOnDestroy(): void {
    this.facturacionService.IE = '';
    this.facturacionService.receptor = undefined;
    // this.facturacionService.tipo = '';
    this.socket.removeListener('update-cfdi');
    this.socket.removeListener('delete-cfdi');
    this.socket.removeListener('new-cfdi');
    this.socket.removeListener('timbrado-cfdi');

    if (this.facturacionService.peso === ESTADOS_CONTENEDOR.VACIO && this.id !== 'nuevo') {
      this.facturacionService.aFacturarV = [];
      this.facturacionService.carritoAFacturar = [];
    } else {
      this.facturacionService.aFacturarM = [];
      this.facturacionService.carritoAFacturar = [];
    }
    this.ObjetoSelect = [];
  }

  cargaValoresIniciales(concept) {
    this.conceptos.controls = [];
    this.conceptos.setValue([]);
    let conceptoCalcular;
    if (concept !== undefined) {
      conceptoCalcular = concept;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // this.serie.setValue(this.series[0]);
    // this.formaPago.setValue('03');
    this.moneda.setValue('MXN');
    ////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////// FECHA /////////////////////////////////////
    const timeZone = moment().format('Z');
    const fecha = moment().utcOffset(timeZone).format('YYYY-MM-DDTHH:mm:ss');
    this.fecha.setValue(fecha);
    ///////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////// RECEPTOR /////////////////////////////////////
    if (this.facturacionService.peso === ESTADOS_CONTENEDOR.VACIO) {
      if (this.facturacionService.receptor) {
        // if (this.facturacionService.tipo === 'Descarga') {
        this.navieraService.getNaviera(this.facturacionService.receptor).subscribe((naviera) => {
          this.rfc.setValue(naviera.rfc);
          this.nombre.setValue(naviera.razonSocial);
          this.usoCFDI.setValue(naviera.usoCFDI.usoCFDI);
          let direccion = '';
          direccion += naviera.calle !== undefined && naviera.calle !== '' ? naviera.calle : '';
          direccion += naviera.noExterior !== undefined && naviera.noExterior !== '' ? ' ' + naviera.noExterior : '';
          direccion += naviera.colonia !== undefined && naviera.colonia !== '' ? ' ' + naviera.colonia : '';
          direccion += naviera.municipio !== undefined && naviera.municipio !== '' ? ' ' + naviera.municipio : '';
          direccion += naviera.ciudad !== undefined && naviera.ciudad !== '' ? ' ' + naviera.ciudad : '';
          direccion += naviera.estado !== undefined && naviera.estado !== '' ? ' ' + naviera.estado : '';
          direccion += naviera.cp !== undefined && naviera.cp !== '' ? ' ' + naviera.cp : '';
          this.direccion.setValue(direccion.trim());
          this.correo.setValue(naviera.correoFac);
        });
        // }
      }
    } else {
      let solicitud;
      let cliente;
      if (this.facturacionService.carritoAFacturar.length > 0 && this.facturacionService.carritoAFacturar[0].maniobras[0].solicitud) {
        solicitud = this.facturacionService.carritoAFacturar[0].maniobras[0].solicitud._id;
        if (solicitud) {
          this.solicitudService.cargarSolicitud(solicitud).subscribe(s => {
            this.rfc.setValue(s.rfc);
            this.nombre.setValue(s.razonSocial);

            switch (s.facturarA) {
              case 'Naviera':
                cliente = s.naviera;
                break;
              case 'Agencia Aduanal':
                cliente = s.agencia;
                break;
              case 'Cliente':
                cliente = s.cliente;
                break;
              default:
              // this.usoCFDI.setValue('5e8244516730a23d0c0a12bf');
            }

            if (cliente) {
              this.clienteService.getCliente(cliente).subscribe((c) => {
                this.usoCFDI.setValue(c.usoCFDI);
              });
            }

            let direccion = '';
            direccion += s.calle !== undefined && s.calle !== '' ? s.calle : '';
            direccion += s.noExterior !== undefined && s.noExterior !== '' ? ' ' + s.noExterior : '';
            direccion += s.colonia !== undefined && s.colonia !== '' ? ' ' + s.colonia : '';
            direccion += s.municipio !== undefined && s.municipio !== '' ? ' ' + s.municipio : '';
            direccion += s.ciudad !== undefined && s.ciudad !== '' ? ' ' + s.ciudad : '';
            direccion += s.estado !== undefined && s.estado !== '' ? ' ' + s.estado : '';
            direccion += s.cp !== undefined && s.cp !== '' ? ' ' + s.cp : '';
            this.direccion.setValue(direccion.trim());
            this.correo.setValue(s.correoFac);
          });
        }
      } else {
        swal('Error', 'Faltan datos de Receptor', 'error');
        // Si es diferente a VACIOS puede que la maniobra[0] no tenga solicitud y no pueda obtener los datos de receptor.
      }
    }
    /////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////// CONCEPTO /////////////////////////////////////////////
    let totalImpuestosRetenidos = 0;
    let totalImpuestosTrasladados = 0;
    // let totalDescuentos = 0;
    let subTotal = 0.0;
    let totalDescuentos = 0.0;

    if (this.facturacionService.carritoAFacturar.length > 0) {
      // if (this.facturacionService.tipo === 'Descarga') {
      this.facturacionService.carritoAFacturar.forEach(c => {
        let impuestosRetenidos = 0.00;
        let impuestosTrasladados = 0.00;
        const concepto = new Concepto();
        this.facturacionService.getProductoServicio(c.idProdServ).subscribe((prodServ) => {
          concepto._id = prodServ._id;
          if (conceptoCalcular && prodServ._id === conceptoCalcular._id) {
            concepto.cantidad = conceptoCalcular.maniobras.length;
            concepto.maniobras = conceptoCalcular.maniobras;
            concepto.valorUnitario = this.truncateDecimals(conceptoCalcular.valorUnitario, 4);
            concepto.descuento = this.truncateDecimals(conceptoCalcular.descuento, 4);
          } else {
            concepto.cantidad = c.maniobras.length;
            concepto.maniobras = c.maniobras;
            concepto.valorUnitario = prodServ !== undefined ? this.truncateDecimals(prodServ.valorUnitario, 4) : 0.00;
            concepto.descuento = 0.00;
          }
          if (prodServ && concepto.maniobras.length > 0) {
            concepto.claveProdServ = prodServ.claveSAT.claveProdServ;
            concepto.claveUnidad = prodServ.unidadSAT.claveUnidad;
            concepto.descripcion = prodServ.descripcion;
            concepto.noIdentificacion = prodServ.codigo;
            concepto.importe = this.round(concepto.valorUnitario * concepto.cantidad - concepto.descuento, 2);
            subTotal += concepto.importe;
            totalDescuentos += concepto.descuento;
            // totalDescuentos += concepto.descuento;
            if (conceptoCalcular && prodServ._id === conceptoCalcular._id) {
              conceptoCalcular.impuestos.forEach(impuesto => {
                if (impuesto.TR === 'RETENCION') {
                  impuestosRetenidos += this.truncateDecimals(concepto.importe * (impuesto.tasaCuota / 100), 4);
                  totalImpuestosRetenidos += impuestosRetenidos;
                } else {
                  if (impuesto.TR === 'TRASLADO') {
                    impuestosTrasladados += this.truncateDecimals(concepto.importe * (impuesto.tasaCuota / 100), 4);
                    totalImpuestosTrasladados += impuestosTrasladados;
                  }
                }
              });
              concepto.impuestos = conceptoCalcular.impuestos;
            } else {
              prodServ.impuestos.forEach(impuesto => {
                impuesto.importe = this.truncateDecimals(concepto.importe * (impuesto.tasaCuota / 100), 4);
                if (impuesto.TR === 'RETENCION') {
                  impuestosRetenidos += this.truncateDecimals(concepto.importe * (impuesto.tasaCuota / 100), 4);
                  totalImpuestosRetenidos += impuestosRetenidos;
                } else {
                  if (impuesto.TR === 'TRASLADO') {
                    impuestosTrasladados += this.truncateDecimals(concepto.importe * (impuesto.tasaCuota / 100), 4);
                    totalImpuestosTrasladados += impuestosTrasladados;
                  }
                }
              });
              concepto.impuestos = prodServ.impuestos;
            }
            concepto.impuestosRetenidos = this.truncateDecimals(impuestosRetenidos, 4);
            concepto.impuestosTrasladados = this.truncateDecimals(impuestosTrasladados, 4);
            // concepto.impuestos = prodServ.impuestos;

            concepto.unidad = '0';
            this.conceptos.push(this.agregarArray(concepto));
            this.cfdi.conceptos = this.conceptos.value;
          }
          this.subtotal.setValue(this.round(subTotal, 2));
          this.totalImpuestosRetenidos.setValue(this.round(totalImpuestosRetenidos, 2));
          this.totalImpuestosTrasladados.setValue(this.round(totalImpuestosTrasladados, 2));
          this.totalDescuentos.setValue(this.round(totalDescuentos, 2));
          this.total.setValue(this.round(this.subtotal.value - this.totalDescuentos.value +
            this.totalImpuestosTrasladados.value - this.totalImpuestosRetenidos.value, 2));
        });
      });
      // }
    } else {
      this.subtotal.setValue(0);
      this.totalImpuestosRetenidos.setValue(0);
      this.totalImpuestosTrasladados.setValue(0);
      this.totalDescuentos.setValue(0);
      this.total.setValue(0);
    }
    /////////////////////////////////////////////////////////////////////////////////////////
  }


  onchange(objeto, indice, event) {
    let pos = 0;
    if (event.checked === true) {
      this.idSelect = objeto;
      this.ObjetoSelect.push({ maniobra: objeto, indice: indice });
    } else if (this.ObjetoSelect.length > 0) {
      if (!this.agrupado) {
        pos = this.ObjetoSelect.findIndex(a => a.maniobra.maniobras[0] === objeto.maniobras[0] && a.maniobra._id === objeto._id);
      } else {
        pos = this.ObjetoSelect.findIndex(a => a.maniobra._id === objeto._id);
      }
      this.ObjetoSelect.splice(pos, 1);
      this.ObjetoSelect.length === 0 ? this.idSelect = undefined : this.idSelect = this.ObjetoSelect[0].maniobra;
    }
  }

  recargaValoresCFDI() {
    let totalImpuestosRetenidos = 0;
    let totalImpuestosTrasladados = 0;
    // let totalDescuentos = 0;
    let subTotal = 0.0;
    let totalDescuentos = 0.0;
    this.createFormGroup();
    this.conceptos.removeAt(0);
    this.ObjetoSelect = [];
    this.idSelect = undefined;
    // tslint:disable-next-line: forin
    for (const propiedad in this.cfdi) {
      for (const control in this.regForm.controls) {
        if (propiedad === control.toString() && propiedad !== 'conceptos') {
          this.regForm.controls[propiedad].setValue(this.cfdi[propiedad]);
        }
      }
    }

    if (this.cfdi.conceptos.length > 0) {
      this.cfdi.conceptos.forEach(concepto => {
        if (concepto.maniobras.length > 0) {
          let impuestosRetenidos = 0.00;
          let impuestosTrasladados = 0.00;
          concepto.cantidad = concepto.maniobras.length;
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

          this.conceptos.push(this.agregarArray(new Concepto(
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
            concepto.maniobras,
            impuestosRetenidos,
            impuestosTrasladados,
            concepto._id)));
        } else {
          this.subtotal.setValue(this.truncateDecimals(subTotal, 4));
          this.totalImpuestosRetenidos.setValue(this.truncateDecimals(totalImpuestosRetenidos, 4));
          this.totalImpuestosTrasladados.setValue(this.truncateDecimals(totalImpuestosTrasladados, 4));
          this.totalDescuentos.setValue(this.round(totalDescuentos, 2));
          this.total.setValue(this.truncateDecimals(this.subtotal.value - this.totalDescuentos.value +
            this.totalImpuestosTrasladados.value - this.totalImpuestosRetenidos.value, 4));
        }
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

  createFormGroup() {
    this.regForm = this.fb.group({
      // GENERALES
      fecha: ['', [Validators.required]],
      // fecha: [moment().local().startOf('day')],
      // folio: ['', [Validators.required]],
      folio: [{ value: '', disabled: true }, [Validators.required]],
      formaPago: ['', [Validators.required]],
      metodoPago: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      serie: ['', [Validators.required]],
      subtotal: [{ value: '', disabled: true }, [Validators.required]],
      tipoComprobante: [{ value: '', disabled: true }, [Validators.required]],
      // tipoComprobante: [{ value: '', disabled: true }, [Validators.required]],
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
      informacionAdicional: [{ value: '', disabled: true }],
      impuestos: [''],
      unidad: [''],
      totalDescuentos: [{ value: '', disabled: true }],
      // maniobras: [''],
      impuestosRetenidos: [''],
      impuestosTrasladados: [''],
      conceptos: this.fb.array([this.agregarArray(new Concepto)], { validators: Validators.required }),
      // CFDIS RELACIONADOS
      // cfdiRelacionados: ['', [Validators.required]],
      // IMPUESTOS
      totalImpuestosRetenidos: [{ value: '', disabled: true }, [Validators.required]],
      totalImpuestosTrasladados: [{ value: '', disabled: true }, [Validators.required]],
      sucursal: [{ value: '', disabled: true }],
      _id: ['']
    });
  }

  agregarArray(concepto: Concepto): FormGroup {
    return this.fb.group({
      // consecutivo: [concepto.consecutivo],
      _id: [concepto._id],
      cantidad: [concepto.cantidad],
      claveProdServ: [concepto.claveProdServ],
      claveUnidad: [concepto.claveUnidad],
      descripcion: [concepto.descripcion],
      noIdentificacion: [concepto.noIdentificacion],
      importe: [concepto.importe],
      valorUnitario: [concepto.valorUnitario],
      impuestos: [concepto.impuestos],
      unidad: [concepto.unidad],
      descuento: [concepto.descuento],
      maniobras: [concepto.maniobras],
      impuestosRetenidos: [concepto.impuestosRetenidos],
      impuestosTrasladados: [concepto.impuestosTrasladados]
    });
  }
  async agrupinD(indice) {
    await this.quitar(indice);
    // await this.agruparDesagruparConcepto(this.agrupado);
  }


  quitar(objeto) {
    if (objeto !== undefined && objeto.length > 0) {
      objeto.forEach(i => {
        const ind = i.indice;
        if (this.id !== 'nuevo') {
          if (this.agrupado === true) {
            const idProd = this.cfdi.conceptos.findIndex(p => p._id === i.maniobra._id);
            this.cfdi.conceptos.splice(idProd, 1);
          } else {
            const poss = this.cfdi.conceptos.findIndex(c => c.maniobras[0] === i.maniobra.maniobras[0] && c._id === i.maniobra._id);
            this.cfdi.conceptos[poss].maniobras.forEach(m => {
              this.maniobrasDeleteConcepto.push({ cfdi: this.regForm.value._id, maniobra: m, concepto: this.conceptos.value[poss]._id });
            });
            this.cfdi.conceptos.splice(poss, 1);
          }
          this.recargaValoresCFDI();
        } else {
          if (this.agrupado === true) {
            const con = this.facturacionService.carritoAFacturar.findIndex(cons => cons.idProdServ === i.maniobra._id);
            this.facturacionService.carritoAFacturar.splice(con, 1);
          } else {
            let n = 0;
            const pos = this.facturacionService.carritoAFacturar.findIndex(cons => cons.idProdServ === i.maniobra._id);
            const mDelete = this.facturacionService.carritoAFacturar[pos].maniobras.filter(function (dato, ind) {
              if (dato._id === i.maniobra.maniobras[0]._id) {
                n = ind;
              }
            });
            this.facturacionService.carritoAFacturar[pos].maniobras.splice(n, 1);
            // const poss = this.facturacionService.carritoAFacturar.find(fuction c => c.maniobras[] === i.maniobra.maniobras[0]._id &&
            //  c.idProdServ === i.maniobra._id);
            // this.facturacionService.carritoAFacturar.splice(poss, 1);
          }
          this.cargaValoresIniciales(undefined);
          this.agrupado = true;
          // const id = this.conceptos.value[ind]._id;
          // const pos = this.facturacionService.carritoAFacturar.findIndex(a => a.idProdServ === id);
        }
      });
    } else {
      swal('Error', 'Selecciona un Concepto', 'error');
    }
    this.ObjetoSelect = [];
  }

  // quitar(indice: number) {
  //   if (indice !== undefined) {
  //     const id = this.conceptos.value[indice]._id;
  //     const pos = this.facturacionService.carritoAFacturar.findIndex(a => a.idProdServ === id);
  //     if (this.id !== 'nuevo') {
  //       this.conceptos.value[indice].maniobras.forEach(m => {
  //         this.maniobrasDeleteConcepto.push({ cfdi: this.regForm.value._id, maniobra: m, concepto: this.conceptos.value[indice]._id });
  //       });
  //       this.conceptos.removeAt(indice);
  //     } else {
  //       if (!this.agrupado) {
  //         let ind = 0;
  //         let maniobra = '';
  //         this.idSelect.maniobras.forEach(m => {
  //           maniobra = m._id;
  //         });
  //         // this.cfdi.conceptos.splice(indice, 1);
  //         let mDelete = this.facturacionService.carritoAFacturar[pos].maniobras.filter(function (dato, i) {
  //           if (dato._id === maniobra) {
  //             ind = i;
  //           }
  //         });
  //         this.facturacionService.carritoAFacturar[pos].maniobras.splice(ind, 1);
  //         this.recargaValoresCFDI();
  //       }       
  //       this.facturacionService.carritoAFacturar.splice(pos, 1);
  //       if (this.id === 'nuevo' || this.id === undefined) {
  //         this.cargaValoresIniciales(undefined);
  //       } else {
  //         // programar edicion
  //       }
  //       this.conceptos.removeAt(indice);
  //     }
  //   } else {
  //     swal('Error', 'Selecciona un Concepto', 'error');
  //   }
  //   this.indiceSelect = undefined;
  // }

  cargarCFDI(id: string) {
    this.conceptos.removeAt(0);
    let concepts;
    this.facturacionService.getCFDI(id).subscribe(res => {
      if (res.informacionAdicional === '@') {
        res.informacionAdicional = '';
      }
      this.cfdi = res;

      // tslint:disable-next-line: forin
      for (const propiedad in this.cfdi) {
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
                this.cfdi.conceptos = concepts;
              }
            }
          }
        }
      }

      if (this.cfdi.conceptos.length > 0) {
        let subTotal = 0;
        if (this.cfdi.conceptos[0].maniobras.length > 0) {
          this.maniobraService.getManiobra(this.cfdi.conceptos[0].maniobras[0]).subscribe(m => {
            this.facturacionService.receptor = m.maniobra.naviera._id;
          });
        }

        // VALIDAR
        if (this.agrupadoDesagrupado(this.cfdi.conceptos)) {
          this.agrupado = true;
        } else {
          this.agrupado = false;
        }

        this.cfdi.conceptos.forEach(concepto => {
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
          this.conceptos.push(this.agregarArray(new Concepto(
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
            concepto.maniobras,
            impuestosRetenidos,
            impuestosTrasladados,
            concepto._id)));
        });
      } else {
        this.regForm.controls['conceptos'].setValue(undefined);
      }
    });
  }

  guardar() {
    if (this.id === 'nuevo') {
      this.consultarManiobraConcepto();
    } else {
      this.guardarCFDI();
    }
  }


  consultarManiobraConcepto() {
    // let promesas;
    let ok = true;
    let promesas;
    this.regForm.value.conceptos.forEach(c => {
      promesas = c.maniobras.map((m) => {
        return new Promise(resolve => {
          this.facturacionService.getManiobrasConceptos(m._id, c._id).subscribe(resM => {
            if (resM.maniobrasConceptos.length > 0) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
      });
    });
    Promise.all(promesas).then(result => {
      result.forEach(r => {
        if (r === false) {
          ok = false;
        }
      });

      if (ok) {
        this.guardarCFDI();
      } else {
        swal('Error', 'Existe(n) Maniobra(s) con ese mismo concepto', 'error');
      }
    });

  }

  deleteManiobra(maniobras) {
    maniobras.forEach(m => {
      const cfdi = m.cfdi,
        maniobra = m.maniobra,
        productoSer = m.concepto;
      this.facturacionService.deletManiobrasConceptos(cfdi, maniobra, productoSer).subscribe((res) => {
        return res;
      });
    });
  }

  async borrarManiobriaConceptos(maniobras) {
    const maniobrasD = await this.deleteManiobra(maniobras);
  }

  guardarCFDI() {
    if (this.regForm.valid) {
      if (this.maniobrasDeleteConcepto.length > 0) {
        this.borrarManiobriaConceptos(this.maniobrasDeleteConcepto);
      }
      this.facturacionService.guardarCFDI(this.regForm.getRawValue()).subscribe(res => {
        if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
          this.regForm.get('_id').setValue(res._id);
          this.id = res._id;
          this.socket.emit('newcfdi', res);
          this.router.navigate(['/cfdis']);
          // this.router.navigate(['/cfdi/', this.regForm.get('_id').value]);
        } else {
          this.socket.emit('updatecfdi', res);
        }
        this.facturacionService.carritoAFacturar = [];
        this.maniobrasDeleteConcepto = [];

        if (this.facturacionService.peso === 'VACIOS') {
          this.facturacionService.aFacturarV = [];
        } else {
          this.facturacionService.aFacturarM = [];
        }
        this.regForm.markAsPristine();
      });
    } else {
      swal('ERROR', 'Faltan datos obligatorios!', 'error');
    }
  }

  BotoninformacionAdicional() {

    swal({
      title: 'Informacion Adicional',
      icon: 'info',
      content: 'input',
    }).then((info) => {
      this.regForm.controls['informacionAdicional'].setValue(info);
    });
  }

  BorrarInformacion() {
    this.regForm.controls['informacionAdicional'].setValue('');
  }

  cambioSerie(serie) {
    this.facturacionService.getSerieXSerie(serie).subscribe(s => {
      this.serie.setValue(s.serie);
      this.folio.setValue(s.folio);
    });
  }

  openDialogImpuestos(concepto) {

    if (concepto !== undefined) {
      // let cfdi;
      // cfdi = this.regForm.value;
      this.cfdi = this.regForm.getRawValue();
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = concepto;
      const dialogRef = this.matDialog.open(ImpuestosCFDIComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.cfdi = cfdi;
          const pos = this.cfdi.conceptos.findIndex(a => a._id === result._id);
          if (pos >= 0) {
            this.cfdi.conceptos[pos] = result;
          }
          this.recargaValoresCFDI();
          // if (this.id === 'nuevo' || this.id === undefined) {
          //   this.cargaValoresIniciales(dialogConfig.data);
          // } else {
          //   // this.cargarCFDI(this.id);
          //   // this.cfdi = cfdi;
          //   const pos = this.cfdi.conceptos.findIndex(a => a._id === result._id);
          //   if (pos >= 0) {
          //     this.cfdi.conceptos[pos] = result;
          //   }
          //   this.recargaValoresCFDI();
          // }
        }
      });
    } else {
      swal('Error', 'Selecciona un Concepto', 'error');
    }
  }

  openDialogManiobras(concepto) {

    if (concepto !== undefined) {
      // let cfdi;
      // cfdi = this.cfdi;
      this.cfdi = this.regForm.getRawValue();
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = concepto;
      const dialogRef = this.matDialog.open(ManiobrasCFDIComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const pos = this.cfdi.conceptos.findIndex(a => a._id === result._id);
          if (pos >= 0) {
            this.cfdi.conceptos[pos] = result;
          }
          this.recargaValoresCFDI();
          // if (this.id === 'nuevo' || this.id === undefined) {
          //   this.cargaValoresIniciales(result);
          // } else {
          //   const pos = cfdi.conceptos.findIndex(a => a._id === result._id);
          //   if (pos >= 0) {
          //     this.cfdi.conceptos[pos] = result;
          //   }
          //   this.recargaValoresCFDI();
          // }
        }
      });
    } else {
      swal('Error', 'Selecciona un Concepto', 'error');
    }
  }

  back() {
    if (localStorage.getItem('history')) {
      this.url = localStorage.getItem('history');
    }
    this.router.navigate([this.url]);
    localStorage.removeItem('history');
  }

  asignaValores(concepto) {
    // tslint:disable-next-line: forin
    for (const p in concepto) {
      if (p === 'valorUnitario' && (concepto[p] <= 0 || concepto[p] === null || concepto[p] === undefined)) {
        swal('Error', `El ${p} debe ser mayor que 0`, 'error');
        const pos = this.cfdi.conceptos.findIndex(a => a._id === concepto._id);
        if (pos >= 0) {
          concepto[p] = this.cfdi.conceptos[pos][p];
        }
      } else {
        if (typeof (concepto[p]) === 'object') {
          const num = parseFloat(concepto[p]);
          if (isNaN(num) && !concepto[p]) {
            concepto[p] = 0;
          }
        }
      }
    }

    if (concepto.descuento >= concepto.importe) {
      swal('Error', `El descuento (${concepto.descuento}) debe ser menor o igual que el importe (${concepto.importe})`, 'error');
    } else {
      const posicion = this.cfdi.conceptos.findIndex(a => a._id === concepto._id);
      if (posicion >= 0) {
        this.cfdi = this.regForm.getRawValue();
        this.cfdi.conceptos[posicion] = concepto;
      }
      this.recargaValoresCFDI();
    }

    // if (this.id === 'nuevo' || this.id === undefined) {
    //   // if (!this.cfdi) {
    //   // this.cfdi = this.regForm.getRawValue();
    //   // }
    //   // const pos = this.conceptos.value.findIndex(a => a._id === concepto._id);
    //   const pos = this.cfdi.conceptos.findIndex(a => a._id === concepto._id);
    //   if (pos >= 0) {
    //     this.cfdi.conceptos[pos] = concepto;
    //   }
    //   this.recargaValoresCFDI();
    //   // this.cargaValoresIniciales(concepto);
    // } else {
    //   const pos = this.cfdi.conceptos.findIndex(a => a._id === concepto._id);
    //   if (pos >= 0) {
    //     this.cfdi.conceptos[pos] = concepto;
    //   }
    //   this.recargaValoresCFDI();
    // }
  }

  agruparDesagruparConcepto(agrupar) {
    if (!this.cfdi) {
      this.cfdi = new CFDI('', 0, '', '', '', '', 0, '', 0, '', '', new Date(), '', '', '', '', '', '', '', '', '', []);
      this.cfdi.fecha = this.fecha.value;
      this.cfdi.folio = this.folio.value;
      this.cfdi.formaPago = this.formaPago.value;
      this.cfdi.metodoPago = this.metodoPago.value;
      this.cfdi.moneda = this.moneda.value;
      this.cfdi.serie = this.serie.value;
      // subtotal
      this.cfdi.tipoComprobante = this.tipoComprobante.value;
      // total
      this.cfdi.nombre = this.nombre.value;
      this.cfdi.rfc = this.rfc.value;
      this.cfdi.usoCFDI = this.usoCFDI.value;
      this.cfdi.direccion = this.direccion.value;
      this.cfdi.correo = this.correo.value;
      this.cfdi.conceptos = this.conceptos.value;
      this.cfdi.informacionAdicional = this.informacionAdicional.value;
    }

    this.cfdi.conceptos = [];

    if (agrupar) {
      const groups = this.groupArray(this.conceptos.value, '_id');
      // tslint:disable-next-line: forin
      for (const g in groups) {
        const con = new Concepto(0, '', '', '', '', 0, 0, [], '', 0, []);
        // tslint:disable-next-line: forin
        groups[g].forEach(c => {
          c.maniobras.forEach(m => {
            con.maniobras.push(m);
          });
        });

        con._id = groups[g][0]._id;
        con.cantidad = con.maniobras.length;
        con.unidad = '0';
        con.valorUnitario = groups[g][0].valorUnitario;
        con.descuento = 0.0;
        con.claveProdServ = groups[g][0].claveProdServ;
        con.claveUnidad = groups[g][0].claveUnidad;
        con.descripcion = groups[g][0].descripcion.substring(0, groups[g][0].descripcion.lastIndexOf(' '));
        con.noIdentificacion = groups[g][0].noIdentificacion;
        con.impuestos = groups[g][0].impuestos;

        this.cfdi.conceptos.unshift(con);
        this.ObjetoSelect = [];
        this.idSelect = undefined;

      }

      this.recargaValoresCFDI();
    } else {
      this.cfdi.fecha = this.fecha.value;
      this.cfdi.folio = this.folio.value;
      this.cfdi.formaPago = this.formaPago.value;
      this.cfdi.metodoPago = this.metodoPago.value;
      this.cfdi.moneda = this.moneda.value;
      this.cfdi.serie = this.serie.value;
      // subtotal
      this.cfdi.tipoComprobante = this.tipoComprobante.value;
      // total
      this.cfdi.nombre = this.nombre.value;
      this.cfdi.rfc = this.rfc.value;
      this.cfdi.usoCFDI = this.usoCFDI.value;
      this.cfdi.direccion = this.direccion.value;
      this.cfdi.correo = this.correo.value;
      this.cfdi.conceptos = [];
      this.cfdi.informacionAdicional = this.informacionAdicional.value;


      const start = async () => {
        await this.asyncForEach(this.conceptos.value, async (c) => {
          // await waitFor(200);
          await this.asyncForEach(c.maniobras, async (m) => {
            // await waitFor(200);

            const con = new Concepto(0, '', '', '', '', 0, 0, [], '', 0, []);
            con._id = c._id;
            con.cantidad = 1;
            con.unidad = '0';
            con.maniobras.push(m);
            con.valorUnitario = c.valorUnitario;
            con.descuento = 0.0;
            con.claveProdServ = c.claveProdServ;
            con.claveUnidad = c.claveUnidad;

            if (m.contenedor) {
              con.descripcion = `${c.descripcion} ${m.contenedor}`;
            } else {
              const maniobra: any = await this.maniobraService.getManiobraAsync(m);
              con.descripcion = `${c.descripcion} ${maniobra.maniobra.contenedor}`;
            }
            con.noIdentificacion = c.noIdentificacion;
            con.impuestos = c.impuestos;
            this.cfdi.conceptos.unshift(con);
          });
        });
        this.recargaValoresCFDI();
      };
      start();
      this.ObjetoSelect = [];
      this.idSelect = undefined;

    }
  }

  agrupadoDesagrupado(conceptos) {
    let agrupado = true;
    let concept;

    conceptos.forEach(c => {
      if (concept === undefined) {
        concept = c._id;
      } else {
        if (concept === c._id) {
          agrupado = false;
        }
      }
    });

    return agrupado;
  }

  groupArray(dataSource, field) {
    return dataSource.reduce(function (groups, x) {
      (groups[x[field]] = groups[x[field]] || []).push(x);
      return groups;
    }, {});
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index]);
      // await callback(array[index], index, array);
    }
  }

  truncateDecimals(num, digits) {
    const numS = num.toString(),
      decPos = numS.indexOf('.'),
      substrLength = decPos === -1 ? numS.length : 1 + decPos + digits,
      trimmedResult = numS.substr(0, substrLength),
      finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

    return parseFloat(finalResult);
  }

  round(number: number, digits) {
    const n = parseFloat((Math.round(number * 100) / 100).toFixed(digits));
    return n;
  }

  /* #region Properties */

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
  get informacionAdicional() {
    return this.regForm.get('informacionAdicional');
  }
  /* #endregion */
}
