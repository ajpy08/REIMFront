import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTabGroup, MatSort } from '@angular/material';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PdfFacturacionService } from './pdf-facturacion.service';

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

  comprobante = '';
  usoCFDI = '';
  moneda = '';
  claveUnidad = '';
  tasa = [];

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  constructor(public dialigRef: MatDialogRef<PdfFacturacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private pdfFacturacionService: PdfFacturacionService) { }

  ngOnInit() {
    if (this.data.data.tipoComprobante === 'I') {
      this.comprobante = 'Ingreso';
    } else if (this.data.data.tipoComprobante === 'E') {
      this.comprobante = 'Egreso';
    }

    if (this.data.data.moneda === 'MXN') {
      this.moneda = 'Peso Mexicano';
    } else if (this.data.data.moneda === 'USD') {
      this.moneda = 'Dolar Americano';
    }
    this.uso();
    this.clave();

  }

  pdf() {
    const datapdf = document.getElementById(('contenido'));
    html2canvas(datapdf).then(canvas => {
      datapdf.style.margin = 'auto';
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 2, 20);
      pdf.save('MYPdf.pdf'); // Generated PDF
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
    this.pdfFacturacionService.getUSO(this.data.data.usoCFDI).subscribe((res) => {
      res.usoCFDI.forEach(u => {
        this.usoCFDI = u.descripcion;
      });
    });

  }

  clave() {
    this.data.data.conceptos.forEach(c => {
      this.claveUnidad = c.claveUnidad;
    });
    this.pdfFacturacionService.getCLAVE(this.claveUnidad).subscribe((res) => {
      res.claveUnidad.forEach(c_u => {
        this.claveUnidad = c_u.nombre;
        
      });
    });
  }


}
