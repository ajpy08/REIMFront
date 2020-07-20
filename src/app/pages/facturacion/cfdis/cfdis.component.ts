import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FacturacionService } from '../facturacion.service';
import { ExcelService, UsuarioService } from 'src/app/services/service.index';
import { CFDI } from '../models/cfdi.models';
import { PdfFacturacionComponent } from 'src/app/pages/facturacion/pdf-facturacion/pdf-facturacion.component';
import * as io from 'socket.io-client';
import { URL_SOCKET_IO, PARAM_SOCKET } from 'src/environments/environment';
import { Usuario } from '../../usuarios/usuario.model';
import { NotasDeCreditoComponent } from '../notas-de-credito/notas-de-credito.component';
declare var swal: any;
@Component({
  selector: 'app-cfdis',
  templateUrl: './cfdis.component.html',
  styleUrls: ['./cfdis.component.css']
})
export class CFDISComponent implements OnInit {
  cfdisExcel = [];
  ok;
  credit = false;
  uuid = false;
  dis;
  serieFolio = '';
  usuarioLogueado: Usuario;
  totalRegistros = 0;
  cargando = true;
  creditosTimbre;
  tablaCargar = false;
  socket = io(URL_SOCKET_IO, PARAM_SOCKET);

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
  constructor(private facturacionService: FacturacionService, private usuarioService: UsuarioService,
    private _excelService: ExcelService, public dialog: MatDialog) { }

  ngOnInit() {
    this.agregarCreditos('B');
    this.usuarioLogueado = this.usuarioService.usuario;
    this.cargarCFDIS();
    this.socket.on('new-cfdi', function (data: any) {
      this.cargarCFDIS();
    }.bind(this));
    this.socket.on('update-cfdi', function (data: any) {
      this.cargarCFDIS();
    }.bind(this));
    this.socket.on('delete-cfdi', function (data: any) {
      this.cargarCFDIS();
    }.bind(this));

    this.socket.on('timbrado-cfdi', function (data: any) {
      this.ok = data.data.ok;
      this.serieFolio = data.data.serieFolio;
      this.dis = data.data.id;
      if (this.ok === undefined || this.ok === false) {
        this.cargarCFDIS();
        this.agregarCreditos('B');
      }
    }.bind(this));
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
      cfdis.cfdis.forEach(uuid => {
        if (uuid.uuid !== undefined) {
          this.uuid = true;
        }

      });
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
          this.socket.emit('deletecfdi', cfdis);
          swal('Correcto', ' Se ha borrado el CFDI ' + cfdis.serie + '-' + cfdis.folio, 'success');
        });
      }
    });
  }

  agregarCreditos(val) {
    if (val === 'A') {
      swal({
        title: 'CREDITOS TIMBRE',
        icon: 'info',
        content: 'input',
        loseOnConfirm: false,
        closeOnCancel: false,
        allowOutsideClick: false
      }).then((credito) => {
        if (credito !== null) {
          this.facturacionService.creditos(credito).subscribe((res) => {
            this.creditosTimbre = res.contador;
            this.agregarCreditos('B');
          });
        }
      });
    } else if (val === 'B') {
      this.facturacionService.getCreditos('CreditosTimbre').subscribe((res) => {
        this.creditosTimbre = res.creditos.seq;
        res.creditos.seq <= 10 ? this.credit = true : this.credit = false;
      });
    }
  }

  pdf(cfdi: CFDI): void {
    this.facturacionService.getCFDIPDF(cfdi._id).subscribe(res => {
      const cfdiPdf = res;
      const dialogPDF = this.dialog.open(PdfFacturacionComponent, {
        width: '800px',
        height: '1000px',
        data: { data: cfdiPdf },
        backdropClass: 'cdk-overlay-transparent-backdrop',
        hasBackdrop: true,
        panelClass: 'filter.popup'
      });

      dialogPDF.afterClosed().subscribe(result => {

      });
    });
  }

  notas(): void {
    this.facturacionService.getCFDIS().subscribe(res => {
      const cfdis = res;
      const dialogNotas = this.dialog.open(NotasDeCreditoComponent, {
        width: '950px',
        height: '800px',
        data: { data: cfdis },
        backdropClass: 'cdk-overlay-transparent-backdrop',
        hasBackdrop: true,
        panelClass: 'filter.popup'
      });
      dialogNotas.afterClosed().subscribe(result => {

      });
    });
  }

  cancelarCFDI(cfdi: CFDI): void {
    swal({
      title: '¿ Estas seguro ?',
      text: 'Estas a punto de cancelar la factura ' + cfdi.serie + '-' + cfdi.folio,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(cancelacion => {
      if (cancelacion) {
        this.facturacionService.cancelacionCFDI(cfdi.rfc, cfdi.uuid, cfdi.total.$numberDecimal).subscribe((res) => {
          console.log(res);
        });
      }
    });
  }



  // CreaDatosExcel(datos) {
  //   datos.forEach(b => {
  //     const buque = {
  //       // Id: b._id,
  //       Buque: b.nombre,
  //       Naviera: b.naviera.nombreComercial,
  //       UsuarioAlta: b.usuarioAlta.nombre,
  //       FAlta: b.fAlta.substring(0, 10)
  //     };
  //     this.cfdisExcel.push(buque);
  //   });
  // }

  // exportarXLSX(): void {
  //   this.CreaDatosExcel(this.dataSource.filteredData);
  //   if (this.cfdisExcel) {
  //     this._excelService.exportAsExcelFile(this.cfdisExcel, 'Buques');
  //   } else {
  //     swal('No se puede exportar un excel vacio', '', 'error');
  //   }
  // }
}
