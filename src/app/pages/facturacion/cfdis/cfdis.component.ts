import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FacturacionService } from '../facturacion.service';
import { ExcelService } from 'src/app/services/service.index';
import { CFDI } from '../models/cfdi.models';
import { DATOS_TIMBRADO } from 'src/app/config/config';
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
  count = 0;
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
      if (this.dataSource.filteredData.length === 0 ) {
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

  borrarCFDIS(cfdis: CFDI ) {
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
        swal('Correcto', ' Se ha borrado el CFDI ' + cfdis.serie + '-' + cfdis.folio , 'success');
      });
    }
  });
  }
  xmlCFDIS(cfdis: CFDI) {
     swal({
      title: '¿ Estas seguro?',
      text: 'Se mandara a timbrar CFDI ' + cfdis.serie + '-' + cfdis.folio,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(timbrar => {
      if (timbrar) {
        this.facturacionService.xmlCFDI(cfdis._id).subscribe((res) => { // generar XML
          if (res.ok === true) {
            this.facturacionService.timbrarXML(res.NombreArchivo, cfdis._id).subscribe((restim) => { // timvbrar XML
              if (restim.ok === true) {
                let uuid = '';
                let sello = '';
                let selloCortadp = '';

                Object.getOwnPropertyNames(restim.Timbre).forEach(function(val) {
                  uuid = restim.Timbre[val].UUID;
                });
                Object.getOwnPropertyNames(res.cfdiXMLsinTimbrar).forEach(function(val) {
                  sello = res.cfdiXMLsinTimbrar[val].Sello;
                  selloCortadp = sello.substr(-8);
                });


                this.facturacionService.codeQR(uuid, DATOS_TIMBRADO.Emisor_RFC , restim.cfdi.rfc, restim.cfdi.total,
                  selloCortadp).subscribe((QR) => { // GENERAR CODIGO QR
                  console.log(QR);
                });
              }
              // console.log(restim);
              // swal('Correcto', 'Se ha Timbrado el XML', 'success');
            }, (error) => {
              this.count++;
              if (this.count < 2 ) {
                if (error) {
                  swal({
                    title: 'Se produjo un error de timbrado ',
                    text: ' En el proceso de timbrado se produjo un error , ¿ Desea repetir la operación?',
                    icon: 'warning',
                    buttons: true,
                    dangerMode: true
                  }). then(reintento => {
                    if (reintento) {
                      this.xmlCFDIS(cfdis);
                    }
                  });
                }
              } else  {
                swal('Error', 'Se excedió el número de intentos', 'error');
                this.count = 0;
              }
            });
          }
        }, (err) => {
          this.count++;
          if (this.count < 2 ) {
            if (err) {
              swal({
                title: 'Error',
                text: 'Se produjo un error al crear el archivo XML, ¿ Desea repetir la operación ?',
                icon: 'warning',
                buttons: true,
                dangerMode: true
              }).then(reintento => {
                if (reintento) {
                  this.xmlCFDIS(cfdis);
                }
              });
            }
          } else {
            swal('Error', 'Se excedió el número de intentos', 'error');
            this.count = 0;
          }
        });
      }
    });
  }

  pdf(cfdi: CFDI): void {
    this.facturacionService.getCFDI(cfdi._id).subscribe((res) => {
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
