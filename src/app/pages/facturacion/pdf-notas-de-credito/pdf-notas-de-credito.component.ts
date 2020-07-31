import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { PdfFacturacionService } from '../pdf-facturacion/pdf-facturacion.service';
import { UsuarioService } from '../../usuarios/usuario.service';
import { FacturacionService } from '../facturacion.service';
import * as io from 'socket.io-client';
import { URL_SOCKET_IO, PARAM_SOCKET } from 'src/environments/environment';
import { Usuario } from '../../usuarios/usuario.model';
import { RFCEMISOR } from 'src/app/config/config';
export interface DialogData {
  // contenedor: string;
  data: any;
}

declare var swal: any;

@Component({
  selector: 'app-pdf-notas-de-credito',
  templateUrl: './pdf-notas-de-credito.component.html',
  styleUrls: ['./pdf-notas-de-credito.component.css']
})
export class PdfNotasDeCreditoComponent implements OnInit {
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);
  moneda = '';
  metodoPago = '';
  usoCFDI = '';
  mensaje = 'TIMBRADO';
  comprobante = '';
  value = '';
  cfdiRelacionados = '';
  letrasTotal = '';
  claveUnidad = '';
  codigoQR = '';
  tipo = '';
  cargandoTimbre = false;
  total = 0;
  count = 0;
  totalTrasladados = 0;
  totalRetenidos = 0;
  subtotal = 0;
  usuarioLogueado: Usuario;
  url = `${this.data.data.cfdi.serie}-${this.data.data.cfdi.folio}-${this.data.data.cfdi._id}.xml`;
  urlpDF = `${this.data.data.cfdi.serie}-${this.data.data.cfdi.folio}-${this.data.data.cfdi._id}.pdf`;
  ObjetoQR = {
    uuid: this.data.data.cfdi.uuid, rfcEmisor: this.data.data.NoCertificadoEmisor, rfcReceptor: this.data.data.cfdi.rfc,
    selloEmisor: this.data.data.cfdi.selloEmisor, total: this.data.data.cfdi.total
  };

  constructor(public dialogRef: MatDialogRef<PdfNotasDeCreditoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private pdfFacturacionService: PdfFacturacionService, private facturacionService: FacturacionService,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.socket.on('alert-timbre', function (data: any) {
      if (data.data.usuarioLogeado._id !== this.usuarioLogueado._id) {
        if (data.data.ok === true) {
          this.dialigRef.close();
          swal({
            title: 'TIMBRANDO',
            text: 'Nota: ' + data.data.serieFolio,
            icon: 'warning'
          });
        }
      }
    }.bind(this));
    this.usuarioLogueado = this.usuarioService.usuario;
    if (this.data.data.cfdi.moneda === 'MXN') {
      this.moneda = 'Peso Mexicano';
    } else if (this.data.data.cfdi.cfdi.moneda === 'USD') {
      this.moneda = 'Dolar Americano';
    }
    if (this.data.data.cfdi.tipoComprobante === 'I') {
      this.comprobante = 'Ingreso';
    } else if (this.data.data.cfdi.tipoComprobante === 'E') {
      this.comprobante = 'Egreso';
    }

    this.uso();
    this.clave();
    this.NumerosAletras();
    this.totales();
    this.getmetodoPago();
    this.getTipo();
    this.cfdiRelacionado();
    this.generarQRs(this.ObjetoQR);
  }

  getTipo() {
    this.pdfFacturacionService.getTipo(this.data.data.cfdi.tipoRelacion).subscribe((res) => {
      res.tipo.forEach(t => {
        this.tipo = t.clave + ' - ' + t.descripcion;
      });
    });
  }

  cfdiRelacionado() {
    let cfdi = '';
    this.data.data.cfdi.conceptos.forEach(cf => {
      cf.cfdis.forEach(c => {
        cfdi += c.uuid + ', ';
      });
    });
    cfdi = cfdi.slice(0, -2);
    this.cfdiRelacionados = cfdi;
  }
  uso() {
    this.pdfFacturacionService.getUSO(this.data.data.cfdi.usoCFDI).subscribe((res) => {
      res.usoCFDI.forEach(u => {
        this.usoCFDI = u.descripcion;
      });
    });
  }
  getmetodoPago() {
    this.pdfFacturacionService.getMetodoPago(this.data.data.cfdi.metodoPago).subscribe((res) => {
      res.MetodoPago.forEach(metodo => {
        this.metodoPago = metodo.descripcion;
      });
    });
  }
  obtenerFechaCert(fecha) {
    if (fecha !== undefined) {
      let fechaMod = fecha.slice(0, -5);
      fechaMod = fechaMod.replace('T', ' ');
      return fechaMod;
    } else {
      return ' ';
    }
  }
  clave() {
    this.data.data.cfdi.conceptos.forEach(c => {
      this.claveUnidad = c.claveUnidad;
    });
    this.pdfFacturacionService.getCLAVE(this.claveUnidad).subscribe((res) => {
      res.claveUnidad.forEach(c_u => {
        this.claveUnidad = c_u.nombre;
      });
    });
  }
  traslado(tr) {
    let TR = '';
    if (tr.TR === 'TRASLADO') {
      TR = 'T';
    } else {
      TR = 'R';
    }
    return TR;
  }

  tasaCuota(tasa) {
    let tasaCuota = '';
    if (tasa.tasaCuota.$numberDecimal >= 10) {
      tasaCuota = '0.' + tasa.tasaCuota.$numberDecimal;
    } else {
      tasaCuota = '0.0' + tasa.tasaCuota.$numberDecimal;
    }
    return tasaCuota;
  }
  importe(importes) {
    let result = '';
    const sep = importes.importe.$numberDecimal.toString().indexOf('.');
    if (sep !== -1) {
      result = importes.importe.$numberDecimal.toString().split('.');
      if (result[1].length >= 2) {

        return result = result[0] + '.' + result[1].slice(0, 2);
      } else {
        return importes.importe.$numberDecimal + '0';
      }
    } else {
      return importes.importe.$numberDecimal + '.00';
    }
  }

  NumerosAletras() {
    this.pdfFacturacionService.getNumeroAletras(this.data.data.cfdi.total.$numberDecimal).subscribe((resLetra) => {
      this.letrasTotal = resLetra.numeroLetras;
    });
  }

  timbrarNota(id: string) {
    const usuarioLogeado = this.usuarioLogueado;
    // tslint:disable-next-line: no-shadowed-variable
    const ok = true;
    swal({
      title: '¿ Estas seguro?',
      text: 'Se mandara a timbrar Nota ' + this.data.data.cfdi.serie + '-' + this.data.data.cfdi.folio,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(timbrar => {
      if (timbrar) {
        const serieFolio = this.data.data.cfdi.serie + '-' + this.data.data.cfdi.folio;
        this.socket.emit('alerttimbreNota', { usuarioLogeado, ok, serieFolio });
        this.socket.emit('timbradoNota', { ok, serieFolio, id, usuarioLogeado });
        this.cargandoTimbre = true;
        this.mensaje = 'Validando Datos';

        this.facturacionService.GenerarxmlNota(id).subscribe((res) => { // generar XML
          setTimeout(() => {
            this.mensaje = 'Generando XML';
          }, 3000);
          if (res.ok === true) {
            this.facturacionService.timbrarXMLNota(res.NombreArchivo, id)
              .subscribe((restim) => { // timbrar XML
                if (restim.ok === true) {
                  setTimeout(() => {
                    this.mensaje = 'XML Timbrado correctamente';
                    let uuid = '',
                      selloEmisor = '',
                      NoCertificadoSat = '',
                      fechaCert = '',
                      selloSAT = '',
                      rfcProvCer = '',
                      cadenaComplemento = '';
                    const rfcEmisor = RFCEMISOR;

                    uuid = restim.Timbre.$.UUID;
                    selloSAT = restim.Timbre.$.SelloSAT;
                    rfcProvCer = restim.Timbre.$.RfcProvCertif;
                    NoCertificadoSat = restim.Timbre.$.NoCertificadoSAT;
                    fechaCert = restim.Timbre.$.FechaTimbrado;
                    cadenaComplemento = restim.CadenaComplemento;

                    for (const i in res.cfdiXMLsinTimbrar) {
                      if (res.cfdiXMLsinTimbrar.hasOwnProperty(i)) {
                        const element = res.cfdiXMLsinTimbrar[i];
                        selloEmisor = element.$.Sello;
                      }
                    }
                    const ObjetoTimbre = {
                      _id: id,
                      uuid: uuid, NoCerieSat: NoCertificadoSat, fechaCer: fechaCert, selloEmisor: selloEmisor,
                      cadenaOriginal: restim.CadenaComplemento, selloSat: selloSAT, rfcProvSat: rfcProvCer, rfcEmisor: rfcEmisor, rfcReceptor: res.rfc,
                      total: res.total
                    };
                    this.datosTimbre(ObjetoTimbre, res.cfdiData.correo, res.cfdiData.serie, res.cfdiData.folio, res.cfdiData.nombre);
                  }, 3000);
                  setTimeout(() => {
                    this.ResCredito();
                  }, 1000);

                }
              }, (error) => {
                this.cargandoTimbre = false;
                // tslint:disable-next-line: no-shadowed-variable
                const ok = false;
                this.socket.emit('timbradoNota', ok);
                swal('Error', `${error.error.mensaje}`, 'error');
              });
          }
        }, (err) => {
          this.cargandoTimbre = false;
          // tslint:disable-next-line: no-shadowed-variable
          const ok = false;
          this.socket.emit('timbradoNota', ok);
          swal('Error', `${err.error.mensaje}`, 'error');
          this.count = 0;
        });
      }
    });
  }

  ResCredito() {
    this.pdfFacturacionService.QuitarCredito().subscribe((res) => {
    });
  }

  datosTimbre(ObjetoTimbrado, correo, serie, folio, nombreEmisor) {
    // tslint:disable-next-line: no-shadowed-variable
    const ok = false;
    const usuarioLogeado = this.usuarioLogueado;
    this.mensaje = 'Generando PDF un momento ...';
    setTimeout(() => {
      this.facturacionService.actualizarDatosTimbreNota(ObjetoTimbrado).subscribe(() => {
        setTimeout(() => {
          this.pdfFacturacionService.pdfGenerateNota(ObjetoTimbrado._id).subscribe((res) => {
            if (res.ok === true) {
              const archivo = `${this.data.data.cfdi.serie}-${this.data.data.cfdi.folio}-${this.data.data.cfdi._id}`;
              this.pdfFacturacionService.envioCorreoCFDI(correo, archivo, nombreEmisor).subscribe((resCorreo) => {
                if (resCorreo.ok === true) {
                  setTimeout(() => {
                    this.pdfFacturacionService.subirBooket(resCorreo.archivos, true).subscribe(() => {
                      this.cargandoTimbre = false;
                      this.socket.emit('alerttimbreNota', usuarioLogeado);
                      this.socket.emit('timbradoNota', { ok, usuarioLogeado });
                      this.socket.emit('notaTimbre', {ok});
                      this.dialogRef.close();
                      swal('Correcto', 'Se ha timbrado la Factura ' + serie + '-' + folio + 'y enviado correo correctamente a ' +
                        correo, 'success');
                    }, (err) => {
                      // tslint:disable-next-line: no-shadowed-variable
                      const ok = false;
                      this.socket.emit('timbradoNota', { ok, usuarioLogeado });
                      swal('Error', `${err.error.mensaje}`, 'error');
                    });
                  }, 5000);
                }
              }, (err) => {
                // tslint:disable-next-line: no-shadowed-variable
                const ok = false;
                this.socket.emit('timbradoNota', { ok, usuarioLogeado });
                swal('Error', `${err.error.mensaje}`, 'error');
              });
            }
          }, (err) => {
            // tslint:disable-next-line: no-shadowed-variable
            const ok = false;
            this.socket.emit('timbradoNota', { ok, usuarioLogeado });
            swal('Error', `${err.error.mensaje}`, 'error');
          });
        }, 3000);
      }, (err) => {
        // tslint:disable-next-line: no-shadowed-variable
        const ok = false;
        this.socket.emit('timbradoNota', { ok, usuarioLogeado });
        swal('Error', `${err.error.mensaje}`, 'error');
      });
    }, 5000);
  }


  cadenaOriginal() {
    if (this.data.data.cfdi.cadenaOriginalSat) {
      const cadenaCortada = this.data.data.cfdi.cadenaOriginalSat.substr(0, 155);
      const cadenaCortada_p2 = this.data.data.cfdi.cadenaOriginalSat.substr(155, 310);
      const cadenaCortada_p3 = this.data.data.cfdi.cadenaOriginalSat.substr(310);
      const cadenaOriginalSatCortada = `${cadenaCortada}\n${cadenaCortada_p2}${cadenaCortada_p3}`;
      return cadenaOriginalSatCortada;
    }
  }

  totales() {
    this.subtotal = this.data.data.cfdi.subtotal.$numberDecimal;
    this.totalRetenidos = this.data.data.cfdi.totalImpuestosRetenidos.$numberDecimal;
    this.totalTrasladados = this.data.data.cfdi.totalImpuestosTrasladados.$numberDecimal;
    this.total = this.data.data.cfdi.total.$numberDecimal;
  }

  envioCFDI() {
    swal({
      title: '¿ Estas seguro?',
      text: 'Se enviara correo a ' + this.data.data.cfdi.correo,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(correo => {
      if (correo) {
        this.CorreoXBoton();
      }
    });
  }
  generarPDF() {
    this.pdfFacturacionService.pdfGenerate(this.data.data.cfdi._id).subscribe((res) => {
    }, (err) => {
      // tslint:disable-next-line: no-shadowed-variable
      const ok = false;
      this.socket.emit('timbradoNota', ok);
      swal('Error', `${err.error.mensaje}`, 'error');
    });
  }

  envioCorreo() {
    const oks = true;
    const archivo = `${this.data.data.cfdi.serie}-${this.data.data.cfdi.folio}-${this.data.data.cfdi._id}`;
    this.pdfFacturacionService.envioCorreoCFDIB(this.data.data.cfdi.correo, archivo, this.data.data.cfdi.nombre).subscribe((resEnvio) => {
      if (resEnvio.ok === true) {
        swal('Correcto', 'Correo Enviando a ' + this.data.data.cfdi.correo, 'success');
      }
    }, (err) => {
      // tslint:disable-next-line: no-shadowed-variable
      const ok = false;
      this.socket.emit('timbradoNota', ok);
      swal('Error', `${err.error.mensaje}`, 'error');
    });
  }

  async CorreoXBoton() {
    const pdf = await this.generarPDF();
    const envioCOrreo = await this.envioCorreo();
    const BorrarTemp = await this.BorrarTemp();
  }

  BorrarTemp() {
    setTimeout(() => {
      const archivos = [];
      archivos.push(this.url, this.urlpDF);
      this.pdfFacturacionService.subirBooket(archivos, false).subscribe(() => {
      }, (err) => {
        // tslint:disable-next-line: no-shadowed-variable
        const ok = false;
        this.socket.emit('timbradoNota', ok);
        swal('Error', `${err.error.mensaje}`, 'error');
      });
    }, 3000);
  }
  closepdf() {
    this.dialogRef.close();
  }

  generarQRs(ObjetoQR) {
    if (this.data.data.cfdi.uuid) {
      let selloEmisorCortado = '';
      if (ObjetoQR.selloEmisor) {
        selloEmisorCortado = ObjetoQR.selloEmisor.substr(-8);
      } else {
        // tslint:disable-next-line: no-unused-expression
        selloEmisorCortado;
      }
      let total = ObjetoQR.total.toString();
      const decimal = ObjetoQR.total.toString().indexOf('.');
      if (decimal !== -1) {
        total = total.split('.');
        total = total[0].padStart(10, '0') + '.' + total[1].padStart(6, '0');
      } else {
        total = ObjetoQR.total.toString().padStart(10, '0') + '.' + '000000';
      }
      const url = 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx';
      this.codigoQR = `${url}?id=${ObjetoQR.uuid}&re=${ObjetoQR.rfcEmisor}&rr=${ObjetoQR.rfcReceptor}
       &tt=${total}&fe=${selloEmisorCortado}`;

      this.value = this.codigoQR;
    } else {
      return;
    }
  }


}
