import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FacturacionService } from '../facturacion.service';
import { ExcelService } from 'src/app/services/service.index';
import { CFDI } from '../models/cfdi.models';
import { PdfFacturacionComponent } from 'src/app/pages/facturacion/pdf-facturacion/pdf-facturacion.component';
declare var swal: any;
@Component({
  selector: 'app-cfdis',
  templateUrl: './cfdis.component.html',
  styleUrls: ['./cfdis.component.css']
})
export class CFDISComponent implements OnInit {
  cfdisExcel = [];
  totalRegistros = 0;
  cargando = true;
  tablaCargar = false;

  displayedColumns = [
    'actions',
    // 'timbrado',
    'fecha',
    'serie',
    'folio',
    'nombre',
    'formaPago',
    'metodoPago',
    'tipoComprobante',
    'moneda',
    'subTotal',
    'total'
  ];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private facturacionService: FacturacionService, private _excelService: ExcelService, public dialog: MatDialog) { }

  ngOnInit() {
    this.cargarCFDIS();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalRegistros = this.dataSource.filteredData.length;
      if (this.dataSource.filteredData.length === 0) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
    } else {
      console.error('Error al filtrar el dataSource de Camiones');
    }
  }

  cargarCFDIS() {
    this.cargando = true;
    this.facturacionService.getCFDIS().subscribe(cfdis => {
      this.dataSource = new MatTableDataSource(cfdis.cfdis);
      if (cfdis.cfdis.length === 0) {
        this.tablaCargar = true;
      } else {
        this.tablaCargar = false;
      }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = cfdis.cfdis.length;
    });
    this.cargando = false;
  }

  borrarCFDIS(cfdis: CFDI) {
    swal({
      title: '¿Esta seguro',
      text: 'Estas a punto de borrar CFDI ' + cfdis.serie + '-' + cfdis.folio,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrado => {
      if (borrado) {
        this.facturacionService.borrarCFDI(cfdis._id).subscribe((res) => {
          this.cargarCFDIS();
          swal('Correcto', ' Se ha borrado el CFDI ' + cfdis.serie + '-' + cfdis.folio, 'success');
        });
      }
    });
  }


  pdf(cfdi: CFDI): void {
    this.facturacionService.getCFDIPDF(cfdi._id).subscribe(res => {
      const cfdiPdf = res;
      const dialogPDF = this.dialog.open(PdfFacturacionComponent, {
        width: '800px',
        height: '1000px',
        data: { data: cfdiPdf },
        hasBackdrop: false,
        panelClass: 'filter.popup'
      });

      dialogPDF.afterClosed().subscribe(result => {

      });
    });
  }


  CreaDatosExcel(datos) {
    datos.forEach(b => {
      const buque = {
        // Id: b._id,
        Buque: b.nombre,
        Naviera: b.naviera.nombreComercial,
        UsuarioAlta: b.usuarioAlta.nombre,
        FAlta: b.fAlta.substring(0, 10)
      };
      this.cfdisExcel.push(buque);
    });
  }

  exportarXLSX(): void {
    this.CreaDatosExcel(this.dataSource.filteredData);
    if (this.cfdisExcel) {
      this._excelService.exportAsExcelFile(this.cfdisExcel, 'Buques');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
}
