import { PagoComponent } from './pago/pago.component';
/* #region  Imports */
import { ManiobraService, UsuarioService } from 'src/app/services/service.index';
import { FacturacionService } from './../facturacion.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Serie } from '../models/serie.models';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Usuario } from '../../usuarios/usuario.model';
import { VariasService } from './../varias.service';
import { ClienteService } from './../../../services/cliente/cliente.service';
import { SolicitudService } from './../../solicitudes/solicitud.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Pago } from '../models/pago.models';
import { Complemento } from '../models/complemento.models';
import { Concepto } from '../models/concepto.models';
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
  selector: 'app-complemento-pago',
  templateUrl: './complemento-pago.component.html',
  styleUrls: ['./complemento-pago.component.css'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  { provide: MAT_DATE_LOCALE, useValue: 'es-mx' }]
})
export class ComplementoPagoComponent implements OnInit, OnDestroy {
  regForm: FormGroup;
  url: string;
  info = '';
  series: Serie[] = [];
  formasPago = [];
  maniobrasDeletePago = [];
  metodosPago = [];
  tiposComprobante = [];
  usosCFDI = [];
  complemento;
  idSelect;
  indiceSelect;
  ObjetoSelect = [];
  infoAd = '';
  usuarioLogueado = new Usuario;
  id;
  agrupado = true;
  // socket = io(URL_SOCKET_IO, PARAM_SOCKET);
  selectionPagos = new SelectionModel<Pago>(true, []);

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public facturacionService: FacturacionService,
    public matDialog: MatDialog,
    private usuarioService: UsuarioService,
    public maniobraService: ManiobraService,
    public solicitudService: SolicitudService,
    public clienteService: ClienteService) { }

  ngOnInit() {
    this.createFormGroup();

    this.complemento = new Complemento('3.3', '', 0, '', 0, '', 0, '', '', '', '', '', '', new Concepto(), '', '', '', '', '', 0,
      '', '', '', '', '', '', '', '', '', '', [], '', new Date(), '', new Date(), '', '');
    this.usuarioLogueado = this.usuarioService.usuario;

    /* #region  Socket.IO */
    // this.socket.on('update-cfdi', function (data: any) {
    //   if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
    //     if (data.data._id) {
    //       this.createFormGroup();
    //       this.cargarCFDI(data.data._id);
    //       if (data.data.usuarioMod !== this.usuarioLogueado._id) {
    //         swal({
    //           title: 'Actualizado',
    //           text: 'Otro usuario ha actualizado este cfdi',
    //           icon: 'info'
    //         });
    //       }
    //     }
    //   }
    // }.bind(this));

    // this.socket.on('delete-cfdi', function (data: any) {
    //   if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE) {
    //     this.router.navigate(['/complementos']);
    //     swal({
    //       title: 'Eliminado',
    //       text: 'Se elimino este CFDI por otro usuario',
    //       icon: 'warning'
    //     });
    //   }
    // }.bind(this));

    // this.socket.on('timbrado-cfdi', function (data: any) {
    //   if (data.data.ok === true) {
    //     this.router.navigate(['/complementos']);
    //     swal({
    //       title: 'TIMBRANDO',
    //       text: 'CFDI: ' + data.data.serieFolio,
    //       icon: 'warning'
    //     });
    //   }
    // }.bind(this));
    /* #endregion */

    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    // if (this.facturacionService.peso === ESTADOS_CONTENEDOR.VACIO) {
    //   this.facturacionService.documentosRelacionados = this.facturacionService.aFacturarV;
    // } else {
    //   this.facturacionService.documentosRelacionados = this.facturacionService.aFacturarM;
    // }

    this.facturacionService.getSeries().subscribe(series => {
      this.series = series.series;
      // if (this.facturacionService.IE === 'P') {
      this.serie.setValue(this.series[2].serie);
      this.folio.setValue(this.series[2].folio);
      // }
    });

    this.pagos.removeAt(0);

    if (this.id !== 'nuevo') {
      this.cargarComplemento(this.id);
    } else {
      // tslint:disable-next-line: forin
      for (const control in this.regForm.controls) {
        if (control.toString() !== 'pagos') {
          this.regForm.controls[control.toString()].setValue(undefined);
        }
      }
      this.cargaValoresIniciales(undefined);
    }
    // this.impuestos.removeAt(0);
    this.url = '/complementos';

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.openDialogPagos();
    });
  }

  ngOnDestroy(): void {
    this.facturacionService.IE = '';
    this.facturacionService.receptor = undefined;
    // this.socket.removeListener('update-cfdi');
    // this.socket.removeListener('delete-cfdi');
    // this.socket.removeListener('new-cfdi');
    // this.socket.removeListener('timbrado-cfdi');

    if (this.id !== 'nuevo') {
      this.facturacionService.documentosRelacionados = [];
    } else {
      this.facturacionService.documentosRelacionados = [];
    }
    this.ObjetoSelect = [];
  }

  cargaValoresIniciales(concept) {
    this.pagos.controls = [];
    this.pagos.setValue([]);
    if (concept !== undefined) {
    }

    ////////////////////////////////////////////////////////////////////////////////
    // this.serie.setValue(this.series[0]);
    // this.formaPago.setValue('03');
    // this.moneda.setValue('MXN');
    ////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////// FECHA /////////////////////////////////////
    const timeZone = moment().format('Z');
    const fecha = moment().utcOffset(timeZone).format('YYYY-MM-DDTHH:mm:ss');
    this.fecha.setValue(fecha);
    ///////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////// RECEPTOR /////////////////////////////////////
    if (this.facturacionService.uuid) {
      this.facturacionService.getCFDIxUUID(this.facturacionService.uuid).subscribe(cfdi => {
        this.clienteService.getClienteXRazonSocial(cfdi.nombre).subscribe(cliente => {
          this.rfc.setValue(cliente.cliente.rfc);
          this.nombre.setValue(cliente.cliente.razonSocial);
          // this.usoCFDI.setValue(cliente.cliente.usoCFDI.usoCFDI);
          let direccion = '';
          direccion += cliente.cliente.calle !== undefined && cliente.cliente.calle !== '' ? cliente.cliente.calle : '';
          direccion += cliente.cliente.noExterior !== undefined && cliente.cliente.noExterior !== '' ? ' ' + cliente.cliente.noExterior : '';
          direccion += cliente.cliente.colonia !== undefined && cliente.cliente.colonia !== '' ? ' ' + cliente.cliente.colonia : '';
          direccion += cliente.cliente.municipio !== undefined && cliente.cliente.municipio !== '' ? ' ' + cliente.cliente.municipio : '';
          direccion += cliente.cliente.ciudad !== undefined && cliente.cliente.ciudad !== '' ? ' ' + cliente.cliente.ciudad : '';
          direccion += cliente.cliente.estado !== undefined && cliente.cliente.estado !== '' ? ' ' + cliente.cliente.estado : '';
          direccion += cliente.cliente.cp !== undefined && cliente.cliente.cp !== '' ? ' ' + cliente.cliente.cp : '';
          this.direccion.setValue(direccion.trim());
          this.correo.setValue(cliente.cliente.correoFac);
        });
      });
    }
    /////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////// PAGO ///////////////////////////////////

    if (this.facturacionService.pagos.length > 0) {
      // if (this.facturacionService.tipo === 'Descarga') {
      this.facturacionService.pagos.forEach(pago => {
        this.pagos.push(this.agregarArray(pago));
      });
      // }
    } else {
      this.subtotal.setValue(0);
      this.total.setValue(0);
    }
    /////////////////////////////////////////////////////////////////////////////////////////
  }

  onChange(objeto, indice, event) {
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

  recargaValoresComplemento() {
    let totalImpuestosRetenidos = 0;
    let totalImpuestosTrasladados = 0;
    // let totalDescuentos = 0;
    let subTotal = 0.0;
    let totalDescuentos = 0.0;
    this.createFormGroup();
    this.pagos.removeAt(0);
    this.ObjetoSelect = [];
    this.idSelect = undefined;
    // tslint:disable-next-line: forin
    for (const propiedad in this.complemento) {
      for (const control in this.regForm.controls) {
        if (propiedad === control.toString() && propiedad !== 'pagos') {
          this.regForm.controls[propiedad].setValue(this.complemento[propiedad]);
        }
      }
    }

    if (this.complemento.pagos.length > 0) {
      this.complemento.pagos.forEach(pago => {
        if (pago.maniobras.length > 0) {
          let impuestosRetenidos = 0.00;
          let impuestosTrasladados = 0.00;
          pago.cantidad = pago.maniobras.length;
          pago.importe = VariasService.round(pago.valorUnitario * pago.cantidad, 2);
          subTotal += pago.importe;
          totalDescuentos += pago.descuento;
          // totalDescuentos += pago.descuento;
          pago.impuestos.forEach(impuesto => {
            impuesto.importe = VariasService.truncateDecimals(pago.importe * (impuesto.tasaCuota / 100), 4);
            if (impuesto.TR === 'RETENCION') {
              impuestosRetenidos += VariasService.truncateDecimals(pago.importe * (impuesto.tasaCuota / 100), 4);
              totalImpuestosRetenidos += impuestosRetenidos;
              // impuestosRetenidos += impuesto.importe;
              // totalImpuestosRetenidos += pago.importe * (impuesto.tasaCuota / 100);
            } else {
              if (impuesto.TR === 'TRASLADO') {
                impuestosTrasladados += VariasService.truncateDecimals(pago.importe * (impuesto.tasaCuota / 100), 4);
                totalImpuestosTrasladados += impuestosTrasladados;
                // impuestosTrasladados += impuesto.importe;
                // totalImpuestosTrasladados += pago.importe * (impuesto.tasaCuota / 100);
              }
            }
          });

          this.subtotal.setValue(0);
          this.total.setValue(0);

          this.pagos.push(this.agregarArray(new Pago(
            // pago.cantidad,
            // pago.claveProdServ,
            // pago.claveUnidad,
            // pago.descripcion,
            // pago.noIdentificacion,
            // pago.valorUnitario,
            // pago.importe,
            // pago.impuestos,
            // pago.unidad,
            // pago.descuento,
            // pago.maniobras,
            // impuestosRetenidos,
            // impuestosTrasladados,
            // pago._id
          )));
        } else {
          this.subtotal.setValue(VariasService.truncateDecimals(subTotal, 4));
          this.total.setValue(0);
        }
      });
    } else {
      this.subtotal.setValue(VariasService.round(subTotal, 2));
      this.total.setValue(0);
    }
  }

  createFormGroup() {
    this.regForm = this.fb.group({
      // GENERALES
      version: ['3.3', [Validators.required]], // *** //
      fecha: ['', [Validators.required]], // *** //
      folio: [{ value: '', disabled: true }, [Validators.required]], // *** //
      lugarExpedicion: [{ value: '97320' }, [Validators.required]], // *** //
      // formaPago: ['', [Validators.required]],
      // metodoPago: ['', [Validators.required]],
      moneda: ['XXX', [Validators.required]], // *** //
      serie: ['', [Validators.required]], // *** //
      subtotal: [{ value: 0 }, [Validators.required]], // *** //
      tipoComprobante: [{ value: 'P', disabled: true }, [Validators.required]], // *** //
      total: [{ value: 0, disabled: true }, [Validators.required]], // *** //
      // RECEPTOR
      nombre: ['', [Validators.required]], // *** //
      rfc: ['', [Validators.required]], // *** //
      direccion: ['', [Validators.required]], // *** //
      noRegistro: [''],
      usoCFDI: ['P01', [Validators.required]], // *** //
      correo: ['', [Validators.required]],
      // CONCEPTOS
      cantidad: [''], // *** //
      claveProdServ: [''], // *** //
      claveUnidad: [''], // *** //
      descripcion: [''], // *** //
      importe: [''], // *** //
      valorUnitario: [''], // *** //
      informacionAdicional: [{ value: '', disabled: true }],
      // PAGOS
      fechaPago: [''], // *** //
      formaPago: [''], // *** //
      monedaPago: [''], // *** //
      monto: [''], // *** //
      numeroOperacion: [''], // *** //
      numeroCuentaOrd: [''], // *** //
      rfcEntidadEmisoraOrd: [''], // *** //
      bancoOrd: [''], // *** //
      numeroCuentaBen: [''], // *** //
      rfcEntidadEmisoraBen: [''], // *** //
      tipoCadenaPago: [''], // *** //
      certPago: [''], // *** //
      cadPago: [''], // *** //
      selloPago: [''], // *** //
      doctosRelacionados: [''], // *** //
      pagos: this.fb.array([this.agregarArray(new Pago)], { validators: Validators.required }),
      sucursal: [{ value: '', disabled: true }],
      _id: ['']
    });
  }

  agregarArray(pago: Pago): FormGroup {
    return this.fb.group({
      fechaPago: [pago.fecha],
      formaPago: [pago.formaPago],
      monedaPago: [pago.moneda],
      monto: [pago.monto],
      numeroOperacion: [pago.numeroOperacion],
      numeroCuentaOrd: [pago.numeroCuentaOrd],
      rfcEntidadEmisoraOrd: [pago.rfcEntidadEmisoraOrd],
      bancoOrd: [pago.bancoOrd],
      numeroCuentaBen: [pago.numeroCuentaBen],
      rfcEntidadEmisoraBen: [pago.rfcEntidadEmisoraBen],
      tipoCadenaPago: [pago.tipoCadenaPago],
      certPago: [pago.certPago],
      cadPago: [pago.cadPago],
      selloPago: [pago.selloPago],
      doctosRelacionados: [pago.doctosRelacionados]
    });
  }
  async agrupinD(indice) {
    await this.quitar(indice);
    // await this.agruparDesagruparPago(this.agrupado);
  }

  quitar(objeto) {
    if (objeto !== undefined && objeto.length > 0) {
      objeto.forEach(i => {
        if (this.id !== 'nuevo') {
          if (this.agrupado === true) {
            const idProd = this.complemento.pagos.findIndex(p => p._id === i.maniobra._id);
            this.complemento.pagos.splice(idProd, 1);
          } else {
            const poss = this.complemento.pagos.findIndex(c => c.maniobras[0] === i.maniobra.maniobras[0] && c._id === i.maniobra._id);
            this.complemento.pagos[poss].maniobras.forEach(m => {
              this.maniobrasDeletePago.push({ complemento: this.regForm.value._id, maniobra: m, concepto: this.pagos.value[poss]._id });
            });
            this.complemento.pagos.splice(poss, 1);
          }
          this.recargaValoresComplemento();
        } else {
          if (this.agrupado === true) {
            const con = this.facturacionService.pagos.findIndex(cons => cons.fecha === i.fecha);
            this.facturacionService.pagos.splice(con, 1);
          } else {
            let n = 0;
            const pos = this.facturacionService.documentosRelacionados.findIndex(cons => cons.idProdServ === i.maniobra._id);
            this.facturacionService.documentosRelacionados[pos].maniobras.splice(n, 1);
            // const poss = this.facturacionService.documentosRelacionados.find(fuction c => c.maniobras[] === i.maniobra.maniobras[0]._id &&
            //  c.idProdServ === i.maniobra._id);
            // this.facturacionService.documentosRelacionados.splice(poss, 1);
          }
          this.cargaValoresIniciales(undefined);
          this.agrupado = true;
          // const id = this.pagos.value[ind]._id;
          // const pos = this.facturacionService.documentosRelacionados.findIndex(a => a.idProdServ === id);
        }
      });
    } else {
      swal('Error', 'Selecciona un Pago', 'error');
    }
    this.ObjetoSelect = [];
  }

  cargarComplemento(id: string) {
    this.pagos.removeAt(0);
    let concepts;
    this.facturacionService.getCFDI(id).subscribe(res => {
      if (res.informacionAdicional === '@') {
        res.informacionAdicional = '';
      }
      this.complemento = res;

      // tslint:disable-next-line: forin
      for (const propiedad in this.complemento) {
        for (const control in this.regForm.controls) {
          if (propiedad === control.toString() && propiedad !== 'pagos') {
            if (res[propiedad].$numberDecimal) {
              this.regForm.controls[propiedad].setValue(res[propiedad].$numberDecimal);
            } else {
              this.regForm.controls[propiedad].setValue(res[propiedad]);
            }
          } else {
            if (propiedad === control.toString() && propiedad === 'pagos') {
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
                this.complemento.pagos = concepts;
              }
            }
          }
        }
      }

      if (this.complemento.pagos.length > 0) {
        if (this.complemento.pagos[0].maniobras.length > 0) {
          this.maniobraService.getManiobra(this.complemento.pagos[0].maniobras[0]).subscribe(m => {
            this.facturacionService.receptor = m.maniobra.naviera._id;
          });
        }

        // VALIDAR
        // if (this.agrupadoDesagrupado(this.cfdi.pagos)) {
        //   this.agrupado = true;
        // } else {
        //   this.agrupado = false;
        // }

        this.complemento.pagos.forEach(pago => {
          pago.impuestos.forEach(impuesto => {
            if (impuesto.TR === 'RETENCION') {
            } else {
              if (impuesto.TR === 'TRASLADO') {
              }
            }
          });
          this.pagos.push(this.agregarArray(new Pago(
            // pago.cantidad,
            // pago.claveProdServ,
            // pago.claveUnidad,
            // pago.descripcion,
            // pago.noIdentificacion,
            // pago.valorUnitario,
            // pago.importe,
            // pago.impuestos,
            // pago.unidad,
            // pago.descuento,
            // pago.maniobras,
            // impuestosRetenidos,
            // impuestosTrasladados,
            // pago._id
          )));
        });
      } else {
        this.regForm.controls['pagos'].setValue(undefined);
      }
    });
  }

  guardar() {
    this.guardarComplemento();
    // if (this.id === 'nuevo') {
    //   this.consultarManiobraConceptos();
    // } else {
    //   this.guardarCFDI();
    // }
  }

  // consultarManiobraConceptos() {
  //   // let promesas;
  //   let ok = true;
  //   let promesas;
  //   this.regForm.value.pagos.forEach(c => {
  //     promesas = c.maniobras.map((m) => {
  //       return new Promise(resolve => {
  //         this.facturacionService.getManiobrasConceptos(m._id, c._id).subscribe(resM => {
  //           if (resM.maniobrasPagos.length > 0) {
  //             resolve(false);
  //           } else {
  //             resolve(true);
  //           }
  //         });
  //       });
  //     });
  //   });
  //   Promise.all(promesas).then(result => {
  //     result.forEach(r => {
  //       if (r === false) {
  //         ok = false;
  //       }
  //     });

  //     if (ok) {
  //       this.guardarCFDI();
  //     } else {
  //       swal('Error', 'Existe(n) Maniobra(s) con ese mismo concepto', 'error');
  //     }
  //   });
  // }

  // deleteManiobra(maniobras) {
  //   maniobras.forEach(m => {
  //     const cfdi = m.cfdi,
  //       maniobra = m.maniobra,
  //       productoSer = m.concepto;
  //     this.facturacionService.deletManiobrasConceptos(cfdi, maniobra, productoSer).subscribe((res) => {
  //       return res;
  //     });
  //   });
  // }

  async borrarManiobriaPagos() {
  }

  guardarComplemento() {
    if (this.regForm.valid) {
      // if (this.maniobrasDeletePago.length > 0) {
      //   this.borrarManiobriaPagos(this.maniobrasDeletePago);
      // }
      this.facturacionService.guardarComplemento(this.regForm.getRawValue()).subscribe(res => {
        if (this.regForm.get('_id').value === '' || this.regForm.get('_id').value === undefined) {
          this.regForm.get('_id').setValue(res._id);
          this.id = res._id;
          // this.socket.emit('newcfdi', res);
          this.router.navigate(['/complementos']);
          // this.router.navigate(['/cfdi/', this.regForm.get('_id').value]);
        } else {
          // this.socket.emit('updatecfdi', res);
        }
        this.facturacionService.documentosRelacionados = [];
        // this.maniobrasDeletePago = [];

        // if (this.facturacionService.peso === 'VACIOS') {
        //   this.facturacionService.aFacturarV = [];
        // } else {
        //   this.facturacionService.aFacturarM = [];
        // }
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
        const pos = this.complemento.pagos.findIndex(a => a._id === concepto._id);
        if (pos >= 0) {
          concepto[p] = this.complemento.pagos[pos][p];
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
      const posicion = this.complemento.pagos.findIndex(a => a._id === concepto._id);
      if (posicion >= 0) {
        this.complemento = this.regForm.getRawValue();
        this.complemento.pagos[posicion] = concepto;
      }
      this.recargaValoresComplemento();
    }

    // if (this.id === 'nuevo' || this.id === undefined) {
    //   // if (!this.cfdi) {
    //   // this.cfdi = this.regForm.getRawValue();
    //   // }
    //   // const pos = this.pagos.value.findIndex(a => a._id === concepto._id);
    //   const pos = this.cfdi.pagos.findIndex(a => a._id === concepto._id);
    //   if (pos >= 0) {
    //     this.cfdi.pagos[pos] = concepto;
    //   }
    //   this.recargaValoresCFDI();
    //   // this.cargaValoresIniciales(concepto);
    // } else {
    //   const pos = this.cfdi.pagos.findIndex(a => a._id === concepto._id);
    //   if (pos >= 0) {
    //     this.cfdi.pagos[pos] = concepto;
    //   }
    //   this.recargaValoresCFDI();
    // }
  }

  // agruparDesagruparPago(agrupar) {
  //   if (!this.cfdi) {
  //     this.cfdi = new CFDI('', 0, '', '', '', '', 0, '', 0, '', '', new Date(), '', '', '', '', '', '', '', '', '', []);
  //     this.cfdi.fecha = this.fecha.value;
  //     this.cfdi.folio = this.folio.value;
  //     // this.cfdi.formaPago = this.formaPago.value;
  //     // this.cfdi.metodoPago = this.metodoPago.value;
  //     // this.cfdi.moneda = this.moneda.value;
  //     this.cfdi.serie = this.serie.value;
  //     // subtotal
  //     this.cfdi.tipoComprobante = this.tipoComprobante.value;
  //     // total
  //     this.cfdi.nombre = this.nombre.value;
  //     this.cfdi.rfc = this.rfc.value;
  //     this.cfdi.direccion = this.direccion.value;
  //     this.cfdi.noRegistro = this.noRegistro.value;
  //     this.cfdi.correo = this.correo.value;
  //     this.cfdi.pagos = this.pagos.value;
  //     this.cfdi.informacionAdicional = this.informacionAdicional.value;
  //   }

  //   this.cfdi.pagos = [];

  //   if (agrupar) {
  //     const groups = VariasService.groupArray(this.pagos.value, '_id');
  //     // tslint:disable-next-line: forin
  //     for (const g in groups) {
  //       const con = new Pago(0, '', '', '', '', 0, 0, [], '', 0, []);
  //       // tslint:disable-next-line: forin
  //       groups[g].forEach(c => {
  //         c.maniobras.forEach(m => {
  //           con.maniobras.push(m);
  //         });
  //       });

  //       con._id = groups[g][0]._id;
  //       con.cantidad = con.maniobras.length;
  //       con.unidad = '0';
  //       con.valorUnitario = groups[g][0].valorUnitario;
  //       con.descuento = 0.0;
  //       con.claveProdServ = groups[g][0].claveProdServ;
  //       con.claveUnidad = groups[g][0].claveUnidad;
  //       con.descripcion = groups[g][0].descripcion.substring(0, groups[g][0].descripcion.lastIndexOf(' '));
  //       con.noIdentificacion = groups[g][0].noIdentificacion;
  //       con.impuestos = groups[g][0].impuestos;

  //       this.cfdi.pagos.unshift(con);
  //       this.ObjetoSelect = [];
  //       this.idSelect = undefined;

  //     }

  //     this.recargaValoresCFDI();
  //   } else {
  //     this.cfdi.fecha = this.fecha.value;
  //     this.cfdi.folio = this.folio.value;
  //     // this.cfdi.formaPago = this.formaPago.value;
  //     // this.cfdi.metodoPago = this.metodoPago.value;
  //     // this.cfdi.moneda = this.moneda.value;
  //     this.cfdi.serie = this.serie.value;
  //     // subtotal
  //     this.cfdi.tipoComprobante = this.tipoComprobante.value;
  //     // total
  //     this.cfdi.nombre = this.nombre.value;
  //     this.cfdi.rfc = this.rfc.value;
  //     this.cfdi.direccion = this.direccion.value;
  //     this.cfdi.noRegistro = this.noRegistro.value;
  //     this.cfdi.correo = this.correo.value;
  //     this.cfdi.pagos = [];
  //     this.cfdi.informacionAdicional = this.informacionAdicional.value;


  //     const start = async () => {
  //       await VariasService.asyncForEach(this.pagos.value, async (c) => {
  //         // await waitFor(200);
  //         await VariasService.asyncForEach(c.maniobras, async (m) => {
  //           // await waitFor(200);

  //           const con = new Pago(0, '', '', '', '', 0, 0, [], '', 0, []);
  //           con._id = c._id;
  //           con.cantidad = 1;
  //           con.unidad = '0';
  //           con.maniobras.push(m);
  //           con.valorUnitario = c.valorUnitario;
  //           con.descuento = 0.0;
  //           con.claveProdServ = c.claveProdServ;
  //           con.claveUnidad = c.claveUnidad;

  //           if (m.contenedor) {
  //             con.descripcion = `${c.descripcion} ${m.contenedor}`;
  //           } else {
  //             const maniobra: any = await this.maniobraService.getManiobraAsync(m);
  //             con.descripcion = `${c.descripcion} ${maniobra.maniobra.contenedor}`;
  //           }
  //           con.noIdentificacion = c.noIdentificacion;
  //           con.impuestos = c.impuestos;
  //           this.cfdi.pagos.unshift(con);
  //         });
  //       });
  //       this.recargaValoresCFDI();
  //     };
  //     start();
  //     this.ObjetoSelect = [];
  //     this.idSelect = undefined;

  //   }
  // }

  // agrupadoDesagrupado(pagos) {
  //   let agrupado = true;
  //   let concept;

  //   pagos.forEach(c => {
  //     if (concept === undefined) {
  //       concept = c._id;
  //     } else {
  //       if (concept === c._id) {
  //         agrupado = false;
  //       }
  //     }
  //   });

  //   return agrupado;
  // }

  // openDialogPagos(pago) {
  //   // if (pago !== undefined) {
  //     this.cfdi = this.regForm.getRawValue();
  //     const dialogConfig = new MatDialogConfig();
  //     dialogConfig.data = pago;
  //     const dialogRef = this.matDialog.open(PagoComponent, dialogConfig);

  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         // this.cfdi = cfdi;
  //         const pos = this.cfdi.pagos.findIndex(a => a._id === result._id);
  //         if (pos >= 0) {
  //           this.cfdi.pagos[pos] = result;
  //         }
  //         this.recargaValoresCFDI();
  //         // if (this.id === 'nuevo' || this.id === undefined) {
  //         //   this.cargaValoresIniciales(dialogConfig.data);
  //         // } else {
  //         //   // this.cargarCFDI(this.id);
  //         //   // this.cfdi = cfdi;
  //         //   const pos = this.cfdi.pagos.findIndex(a => a._id === result._id);
  //         //   if (pos >= 0) {
  //         //     this.cfdi.pagos[pos] = result;
  //         //   }
  //         //   this.recargaValoresCFDI();
  //         // }
  //       }
  //     });
  //   // } else {
  //   //   swal('Error', 'Selecciona un Pago', 'error');
  //   // }
  // }

  openDialogPagos() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.selectionPagos;
    const dialogRef = this.matDialog.open(PagoComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.selectionPagos = new SelectionModel<Pago>(true, []);
    //   }
    // });

    dialogRef.afterClosed().subscribe(pago => {
      this.pagos.setValue([]);
      if (pago) {
        this.pagos.push(this.agregarArray(pago));

        this.facturacionService.pagos = this.pagos.value;

        this.recargaValoresComplemento();
        // this.complemento = complemento;
        // const pos = this.complemento.pagos.findIndex(a => a._id === result._id);
        // if (pos >= 0) {
        //   this.complemento.pagos[pos] = result;
        // }
        // this.recargaValoresCFDI();
        // if (this.id === 'nuevo' || this.id === undefined) {
        //   this.cargaValoresIniciales(dialogConfig.data);
        // } else {
        //   // this.cargarCFDI(this.id);
        //   // this.complemento = complemento;
        //   const pos = this.complemento.pagos.findIndex(a => a._id === result._id);
        //   if (pos >= 0) {
        //     this.complemento.pagos[pos] = result;
        //   }
        //   this.recargaValoresCFDI();
        // }
      }
    });
  }

  /* #region Properties */

  get version() {
    return this.regForm.get('version');
  }

  get fecha() {
    return this.regForm.get('fecha');
  }

  get folio() {
    return this.regForm.get('folio');
  }

  get lugarExpedicion() {
    return this.regForm.get('lugarExpedicion');
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

  get direccion() {
    return this.regForm.get('direccion');
  }

  get noRegistro() {
    return this.regForm.get('noRegistro');
  }

  get usoCFDI() {
    return this.regForm.get('usoCFDI');
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

  get importe() {
    return this.regForm.get('importe');
  }

  get valorUnitario() {
    return this.regForm.get('valorUnitario');
  }

  get pagos() {
    return this.regForm.get('pagos') as FormArray;
  }

  get fechaPago() {
    return this.regForm.get('fechaPago');
  }

  get formaPago() {
    return this.regForm.get('formaPago');
  }

  get monedaPago() {
    return this.regForm.get('monedaPago');
  }

  get monto() {
    return this.regForm.get('monto');
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

  get certPago() {
    return this.regForm.get('certPago');
  }

  get cadPago() {
    return this.regForm.get('cadPago');
  }

  get selloPago() {
    return this.regForm.get('selloPago');
  }

  get doctosRelacionados() {
    return this.regForm.get('doctosRelacionados');
  }
  get total() {
    return this.regForm.get('total');
  }
  get informacionAdicional() {
    return this.regForm.get('informacionAdicional');
  }
  /* #endregion */

}
