import { DocumentoRelacionadoComponent } from './../../dialogs/documento-relacionado/documento-relacionado.component';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import * as _moment from 'moment';
import swal from 'sweetalert';
import {
  MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { UsuarioService, FacturacionService } from 'src/app/services/service.index';
import { Usuario } from 'src/app/pages/usuarios/usuario.model';
import { ROLES } from 'src/app/config/config';
import { Complemento } from '../../models/complemento.models';


// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY MMM DD',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMMM DD'
  }
};

@Component({
  selector: 'app-facturas-ppd',
  templateUrl: './facturas-ppd.component.html',
  styleUrls: ['./facturas-ppd.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class FacturasPpdComponent implements OnInit {

  cargando = true;
  totalRegistros = 0;
  usuarioLogueado = new Usuario();
  disabled = false;

  displayedColumns = ['select', 'folio', 'fecha', 'metodoPago', 'total'];

  dataSource: any;
  selectionFacturas = new SelectionModel<Complemento>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public matDialog: MatDialog,
    private router: Router,
    public facturacionService: FacturacionService,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FacturasPpdComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.cargaCFDIS();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectionFacturas.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selectionFacturas.clear()
      : this.dataSource.data.forEach(row =>
        this.selectionFacturas.select(row)
      );
  }

  cargaCFDIS() {
    this.cargando = true;
    this.facturacionService.getCFDIS('', 'PPD').subscribe(cfdis => {
      this.dataSource = new MatTableDataSource(cfdis.cfdis);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = cfdis.total;
    });
    this.cargando = false;
  }

  seleccionarFactura() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.selectionFacturas.selected[0];
    const dialogRef = this.matDialog.open(DocumentoRelacionadoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const pos = this.facturacionService.aComplementar.findIndex(a => a.idDocumento === result.idDocumento);

        if (pos >= 0) {
          swal('Ya esta agregada esta factura', '', 'error');
          this.selectionFacturas.clear();
        } else {
          this.facturacionService.aComplementar.push(result);
          this.selectionFacturas.clear();
          console.log(result);
        }
      }
    });
  }

  agregarAPago() {
    if (this.validaCliente(this.facturacionService.aComplementar)) {
      //////////////// DATOS GENERALES ////////////////
      // Serie (default)
      // Folio (default)
      // Sucursal (default)
      // Forma de Pago (default)
      // Moneda (default)
      this.facturacionService.IE = 'P';
      // Fecha (default)
      /////////////////////////////////////////////////

      /////////////////// RECEPTOR ////////////////////
      // this.facturacionService.peso = ESTADOS_CONTENEDOR.VACIO;
      this.facturacionService.uuid = this.facturacionService.aComplementar[0].idDocumento;
      // this.facturacionService.tipo = 'Descarga';
      /////////////////////////////////////////////////

      /////////////////// CONCEPTOS ///////////////////
      // Producto Servicio (por cada concepto en array aFacturarV)
      // this.facturacionService.aFacturarV.forEach(c => {
      //   c.maniobras.forEach(m => {
      //     this.facturacionService.maniobras.push(m._id);
      //   });
      // });
      // this.facturacionService.maniobras = this.selectionFacturas.selected;
      /////////////////////////////////////////////////

      this.dialogRef.close(this.facturacionService.aComplementar);
    } else {
      swal('Las maniobras seleccionadas son de diferente NAVIERA o distinto VIAJE', '', 'error');
    }
  }

  validaCliente(facturas) {
    let rfc;
    let ok = true;

    facturas.forEach(c => {
      if (rfc === undefined) {
        rfc = c.rfc;
      } else {
        if (rfc !== c.rfc) {
          ok = false;
        }
      }
    });
    return ok;
  }

  soyAdmin() {
    if (
      this.usuarioLogueado.role === ROLES.ADMIN_ROLE ||
      this.usuarioLogueado.role === ROLES.PATIOADMIN_ROLE
    ) {
      return true;
    } else {
      return false;
    }
  }

  openSnackBar(message: string, action: string) {
    const snackBarRef = this.snackBar.open(message, action, {
      duration: 3500,
    });

    snackBarRef.afterDismissed().subscribe(facturar => {
      if (facturar.dismissedByAction === true) {
        this.agregarAPago();
      }
    });

    // snackBarRef.onAction().subscribe(() => {
    //   console.log('action was explicitly clicked');
    // });
    // snackBarRef.afterDismissed().subscribe(() => {
    //   console.log('regardless of how the snackbar has been dismissed');
    // });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalRegistros = this.dataSource.filteredData.length;
    } else {
      console.error('Error al filtrar el dataSource de CFDIs PPD');
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
