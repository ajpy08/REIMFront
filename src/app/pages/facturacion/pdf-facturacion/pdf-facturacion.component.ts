import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTabGroup, MatSort } from '@angular/material';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PdfFacturacionService } from './pdf-facturacion.service';
import { FacturacionService } from '../facturacion.service';
import { DATOS_TIMBRADO, RFCEMISOR } from 'src/app/config/config';

declare var swal: any;

import { CFDI } from '../models/cfdi.models';
export interface DialogData {
  // contenedor: string;
  data: any;
}

@Component({
  selector: 'app-pdf-facturacion',
  templateUrl: './pdf-facturacion.component.html',
  styleUrls: ['./pdf-facturacion.component.css']
})
export class PdfFacturacionComponent implements OnInit {
  cargandoTimbre = false;
  mensaje = 'TIMBRADO';
  elementType = 'img';
  qr = '';
  value = '';
  total = 0;
  totalTrasladados = 0;
  totalRetenidos = 0;
  subtotal = 0;
  comprobante = '';
  usoCFDI = '';
  moneda = '';
  claveUnidad = '';
  tasa = [];
  count = 0;
  letrasTotal = '';
  uuid = '';
  metodoPago = '';
  NserieSAT = '';
  fechaCertificado = '';
  codigoQR = '';
  ObjetoQR = {
    uuid: this.data.data.cfdi.uuid, rfcEmisor: this.data.data.NoCertificadoEmisor, rfcReceptor: this.data.data.cfdi.rfc,
    selloEmisor: this.data.data.cfdi.selloEmisor, total: this.data.data.cfdi.total
  };


  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  constructor(public dialigRef: MatDialogRef<PdfFacturacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private pdfFacturacionService: PdfFacturacionService, private facturacionService: FacturacionService) { }

  ngOnInit() {
    if (this.data.data.cfdi.tipoComprobante === 'I') {
      this.comprobante = 'Ingreso';
    } else if (this.data.data.cfdi.tipoComprobante === 'E') {
      this.comprobante = 'Egreso';
    }

    if (this.data.data.cfdi.moneda === 'MXN') {
      this.moneda = 'Peso Mexicano';
    } else if (this.data.data.cfdi.cfdi.moneda === 'USD') {
      this.moneda = 'Dolar Americano';
    }
    this.uso();
    this.clave();
    this.NumerosAletras();
    this.totales();
    this.getmetodoPago();
    this.generarQR(this.ObjetoQR);
    // this.obtenerFechaCert(this.data.data.cfdi.fechaCertificacion);


  }

  pdf() {
    const datapdf = document.getElementById(('contenido'));
    html2canvas(datapdf).then(canvas => {
      datapdf.style.margin = 'auto';
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 7, 3);
      pdf.save(`${this.data.data.cfdi.serie}-${this.data.data.cfdi.folio}.pdf`);
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
    if (tasa.tasaCuota >= 10) {
      tasaCuota = '0.' + tasa.tasaCuota;
    } else {
      tasaCuota = '0.0' + tasa.tasaCuota;
    }
    return tasaCuota;
  }
  importe(importes) {
    let result = '';
    const sep = importes.importe.toString().indexOf('.');
    if (sep !== -1) {
      result = importes.importe.toString().split('.');
      if (result[1].length > 2) {

        return result = result[0] + '.' + result[1] + '0';
      } else {
        return importes.importe + '0';
      }
    } else {
      return importes.importe + '.00';
    }
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

  totales() {
    this.subtotal = this.data.data.cfdi.subtotal;
    this.totalRetenidos = this.data.data.cfdi.totalImpuestosRetenidos;
    this.totalTrasladados = this.data.data.cfdi.totalImpuestosTrasladados;
    this.total = this.data.data.cfdi.total;
  }

  NumerosAletras() {
    this.pdfFacturacionService.getNumeroAletras(this.data.data.cfdi.total).subscribe((resLetra) => {
      this.letrasTotal = resLetra.numeroLetras;
    });
  }


  xmlCFDIS(id: string) {
    swal({
      title: '¿ Estas seguro?',
      text: 'Se mandara a timbrar CFDI ' + this.data.data.cfdi.serie + '-' + this.data.data.cfdi.folio,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(timbrar => {
      if (timbrar) {

        this.cargandoTimbre = true;
        this.mensaje = 'Validando Datos';

        this.facturacionService.xmlCFDI(id).subscribe((res) => { // generar XML
          setTimeout(() => {
            this.mensaje = 'Generando XML';
          }, 3000);
          if (res.ok === true) {
            this.facturacionService.timbrarXML(res.NombreArchivo, id).subscribe((restim) => { // timbrar XML
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
                  this.datosTimbre(ObjetoTimbre);
                }, 3000);
              }
            }, (error) => {
              this.cargandoTimbre = false;
              this.count++;
              if (this.count < 2) {
                if (error) {
                  swal({
                    title: 'Se produjo un error de timbrado ',
                    text: ' En el proceso de timbrado se produjo un error , ¿ Desea repetir la operación?',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true
                  }).then(reintento => {
                    if (reintento) {
                      this.xmlCFDIS(this.data.data._id);
                    }
                  });
                }
              } else {
                this.cargandoTimbre = false;
                swal('Error', 'Se excedió el número de intentos', 'error');
                this.count = 0;
              }
            });
          }
        }, (err) => {
          this.cargandoTimbre = false;
          this.count++;
          if (this.count < 2) {
            if (err) {
              swal({
                title: 'Error',
                text: 'Se produjo un error al crear el archivo XML, ¿ Desea repetir la operación ?',
                icon: 'warning',
                buttons: true,
                dangerMode: true
              }).then(reintento => {
                if (reintento) {
                  this.xmlCFDIS(this.data.data.cfdi._id);
                }
              });
            }
          } else {
            this.cargandoTimbre = false;
            swal('Error', 'Se excedió el número de intentos', 'error');
            this.count = 0;
          }
        });
      }
    });
  }

  datosTimbre(ObjetoTimbrado) {
    this.mensaje = 'Generando PDF un momento ...';
    setTimeout(() => {
      this.facturacionService.actualizarDatosTimbre(ObjetoTimbrado).subscribe(() => {
        this.cargandoTimbre = false;
        this.dialigRef.close();
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

  generarQR(ObjetoQR) {
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

  closepdf() {
    this.dialigRef.close();
  }
}
