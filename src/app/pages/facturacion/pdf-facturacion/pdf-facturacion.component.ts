import { Component, OnInit,  Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTabGroup, MatSort } from '@angular/material';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  constructor(public dialigRef: MatDialogRef<PdfFacturacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  generatePdf() {
    const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    pdfMake.createPdf(documentDefinition).open();
   }

}
