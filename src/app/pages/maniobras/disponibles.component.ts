import { Component, OnInit } from '@angular/core';
import { ManiobraService } from '../../services/service.index';


@Component({
  selector: 'app-disponibles',
  templateUrl: './disponibles.component.html',
  styles: [],
  providers: [],
})

export class DisponiblesComponent implements OnInit {
  maniobras: any[] = [];
  cargando = true;
  totalRegistros = 0;
  
  constructor(public _maniobraService: ManiobraService) { }

  ngOnInit() {
    this.cargarManiobras();
  }

  cargarManiobras() {
    this.cargando = true;
    this._maniobraService.getContenedoresDisponibles()
    .subscribe(maniobras => {
        if (maniobras.code !== 200) {
          this.totalRegistros = maniobras.total;
          this.maniobras = maniobras.maniobras;
          this.cargando = false;
        }
      },
      error => {
          console.log(<any>error);
      }
    );
  }


  // public exportpdf() {
  //   const data = document.getElementById('contentToConvert');
  //   html2canvas(data).then(canvas => {
  //     const imgWidth = 208;
  //     const pageHeight = 295;
  //     const imgHeight = canvas.height * imgWidth / canvas.width;
  //     const heightLeft = imgHeight;
  //     const contentDataURL = canvas.toDataURL('image/png');
  //     const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
  //     const position = 0;
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //     pdf.save('MYPdf.pdf'); // Generated PDF
  //   });
  // }

  // exportAsXLSX(): void {
  //   this._excelService.exportAsExcelFile(this.maniobras, 'maniobras');
  // }

  buscarManiobra(termino: string) {
    // if (termino.length <= 0) {
    //   this.cargarManiobras();
    //   return;
    // }
    // this.cargando = true;
    // this._maniobraService.getManiobrasTransito(termino)
    // .subscribe( maniobras =>  this.maniobras = maniobras.maniobras );
  }

}



