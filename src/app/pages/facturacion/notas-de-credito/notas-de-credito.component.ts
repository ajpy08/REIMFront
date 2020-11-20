
import { CFDI } from './../models/cfdi.models';
import { Component, OnInit, Inject, ViewChild, ElementRef, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTabGroup, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { FacturacionService } from '../facturacion.service';
declare var swal: any;

export interface DialogData {
  // contenedor: string;
  data: any;
}

@Component({
  selector: 'app-notas-de-credito',
  templateUrl: './notas-de-credito.component.html',
  styleUrls: ['./notas-de-credito.component.css']
})
export class NotasDeCreditoComponent implements OnInit {
  folioAgregar;
  mostrarCFDI = false;
  totalAfacturar = 0;
  dataSourcesCfdis: any;
  cfdisNotas = new SelectionModel<CFDI>(true, []);
  agrupadoCFDIS = [];
  cfdisFacturar;
  tipoRelacion = [];
  DS = [];
  tipo = '';
  tipoSelect = '';
  okTipoRelacion = false;
  getTipoRelacion = '';
  rfcCliente = '';
  productos = [];
  displayedColumns = [
    'select',
    'serie',
    'folio',
    'uuid',
    'nombre',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialigRef: MatDialogRef<NotasDeCreditoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private router: Router, public facturacionService: FacturacionService) { }

  ngOnInit() {

    let getLocalStorageTipo = localStorage.getItem('tipoRelacion');
    this.SelectTipoRelacion();

    if (getLocalStorageTipo === null || getLocalStorageTipo === undefined) {
      this.ObtenerTabla(this.tipo);
    } else {
      this.getTabla(getLocalStorageTipo);
    }

    this.facturacionService.getProductosServicios().subscribe(productos => {
      let pos = 0;
      this.productos = productos.productos_servicios;
      pos = this.productos.findIndex(p => p.codigo === 'TLR18');
      localStorage.setItem('prodSer', JSON.stringify(productos.productos_servicios[pos]));
    });

    if (localStorage.getItem('cfdis') === null) {
      // tslint:disable-next-line: no-unused-expression
      this.totalAfacturar;
    } else {
      this.cfdisFacturar = JSON.parse(localStorage.getItem('cfdis'));
      this.totalAfacturar = this.cfdisFacturar.length;
    }
  }
  ObtenerTabla(tipo) {
    let okTipo = false;
    if (this.tipoSelect === '' || this.tipoSelect === undefined && tipo !== undefined) {
      this.tipoSelect = tipo.clave;
    }
    if (this.tipoSelect !== tipo.clave && tipo.clave !== undefined) {
      okTipo = true;
      this.cfdisFacturar = JSON.parse(localStorage.getItem('cfdis'));
      this.cfdisFacturar = [];
      this.totalAfacturar = this.cfdisFacturar.length;
      this.tipoSelect = tipo.clave;
      localStorage.removeItem('cfdis');
      let tipos = JSON.stringify(tipo);
      localStorage.setItem('tipoRelacion', tipos);
      this.okTipoRelacion = true;
      this.getTipoRelacion = tipo.clave + ' - ' + tipo.descripcion;
    } else if (okTipo === false && tipo.clave) {
      let tipos = JSON.stringify(tipo);
      this.okTipoRelacion = true;
      this.getTipoRelacion = tipo.clave + ' - ' + tipo.descripcion;
      localStorage.setItem('tipoRelacion', tipos);
      if (this.dataSourcesCfdis === undefined) {
        this.data.data.cfdis.forEach((c, i) => {
          if (c.uuid !== undefined && c.notaDeCreditoRelacionada === undefined) {
            this.DS.push(this.data.data.cfdis[i]);
          }
        });
        this.dataSourcesCfdis = new MatTableDataSource(this.DS);
        this.dataSourcesCfdis.sort = this.sort;
        this.dataSourcesCfdis.paginator = this.paginator;

      }
    }
  }

  getTabla(tipo) {
    const parseTipo = JSON.parse(tipo);
    this.getTipoRelacion = parseTipo.clave + ' - ' + parseTipo.descripcion;
    this.okTipoRelacion = true;
    if (this.dataSourcesCfdis === undefined) {
      this.data.data.cfdis.forEach((c, i) => {
        if (c.uuid !== undefined && c.serie === 'A' && c.notaDeCreditoRelacionada === undefined) {
          this.DS.push(this.data.data.cfdis[i]);
        }
      });
      this.dataSourcesCfdis = new MatTableDataSource(this.DS);
      this.dataSourcesCfdis.sort = this.sort;
      this.dataSourcesCfdis.paginator = this.paginator;
    }
  }
  loaderSelectTipoRelacion() {
    this.okTipoRelacion = false;
    localStorage.removeItem('tipoRelacion');
    this.cfdisFacturar = JSON.parse(localStorage.getItem('cfdis'));
    this.cfdisFacturar = [];
    this.totalAfacturar = this.cfdisFacturar.length;
    localStorage.removeItem('cfdis');
  }

  SelectTipoRelacion() {
    this.facturacionService.getTipoRelacion().subscribe((res) => {
      this.tipoRelacion = res.tipoRelacion;
    });
  }

  masterToggleCfdis() {
    this.isAllSelectedCfdis() ? this.cfdisNotas.clear() : this.dataSourcesCfdis.data.forEach(row =>
      this.cfdisNotas.select(row)
    );
  }

  isAllSelectedCfdis() {
    const numSelected = this.cfdisNotas.selected.length;
    const numRows = this.dataSourcesCfdis.data.length;
    return numSelected === numRows;
  }

  validarCfdi(cfdi) {
    let validarLocalStorage = JSON.parse(localStorage.getItem('cfdis'));
    let rfc;
    if (validarLocalStorage === null || validarLocalStorage.length === 0) {
      cfdi.forEach((c, i) => {
        if (rfc === undefined) {
          rfc = c.rfc;
        }
        if (rfc !== c.rfc) {
          swal('Error', 'El CFDI con folio ' + c.folio + ' es de distinto Cliente', 'error');
          return;
        }
        this.agrupadoCFDIS.push(cfdi[i]);
      });
      this.agrupadoCFDIS = Array.from(new Set(this.agrupadoCFDIS));
      localStorage.setItem('cfdis', JSON.stringify(this.agrupadoCFDIS));
      const t = JSON.parse(localStorage.getItem('cfdis'));
      this.totalAfacturar = t.length;
      this.agrupadoCFDIS = [];
    } else {
      let result;
      let i;
      let okCliente = false;
      const duplicados = [];

      cfdi.forEach((c, index) => {
        i = index;
        if (validarLocalStorage[0].rfc !== c.rfc) {
          swal('Error', 'El CFDI con folio ' + c.folio + ' es de distinto Cliente', 'error');
          okCliente = true;
        }
        if (okCliente === false) {
          result = validarLocalStorage.find(uuid => uuid.uuid === c.uuid);
          if (result !== undefined) {
            duplicados.push(result);
          }
        }
      });
      if (duplicados.length > 0) {
        swal('Error', 'CFDI(S) agregado(s) ya se encuentra(n) en la lista', 'error');
      } else if (okCliente === false) {
        validarLocalStorage.push(cfdi[i]);
        validarLocalStorage = Array.from(new Set(validarLocalStorage));
        localStorage.setItem('cfdis', JSON.stringify(validarLocalStorage));
      }
      const t = JSON.parse(localStorage.getItem('cfdis'));
      this.totalAfacturar = t.length;
    }
    this.cfdisNotas.clear();
  }

  facturar() {
    this.dialigRef.close();
    this.router.navigate(['/nota_de_credito/nuevo']);
    localStorage.setItem('IE', 'E');
  }


  removeContenedor(index: number) {
    swal({
      title: '¿ Estas Seguro ?',
      text: 'El CFDI seleccionado se eliminara de la lista',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this.cfdisFacturar = JSON.parse(localStorage.getItem('cfdis'));
        this.cfdisFacturar.splice(index, 1);
        localStorage.setItem('cfdis', JSON.stringify(this.cfdisFacturar));
        const t = JSON.parse(localStorage.getItem('cfdis'));
        this.totalAfacturar = t.length;
        if (this.totalAfacturar === 0) {
          this.mostrarCFDI = false;
        }
      }
    });
  }

  cfdiAgregados(A_C) {
    if (A_C === 'A') {
      this.mostrarCFDI = true;
      this.cfdisFacturar = JSON.parse(localStorage.getItem('cfdis'));
    } else {
      this.mostrarCFDI = false;
    }
  }

  filterCFDIS(folio: string) {
    folio = folio.trim(); // Remove whitespace
    folio = folio.toLowerCase(); // Datasource defaults to lowercase matches

    if (this.dataSourcesCfdis && this.dataSourcesCfdis.data.length > 0) {
      this.dataSourcesCfdis.filter = folio;
    } else {
      console.error('No se puede filtrar en un datasource vacío');
    }

    // this.dataSourceReparacionVacios.filter = filterValue;
    // this.totalRegistrosReparacionVacios = this.dataSourceReparacionVacios.filteredData.length;
  }


  cerrar() {
    this.dialigRef.close();
  }
}
