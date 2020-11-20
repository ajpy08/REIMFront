import { ExcelService } from './../../../services/excel/excel.service';
import { FacturacionService } from './../facturacion.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ClaveProductosServicio } from './clave-producto.servicio.models';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
declare var swal: any;

@Component({
  selector: 'app-clave-productos-servicios',
  templateUrl: './clave-productos-servicios.component.html',
  styleUrls: ['./clave-productos-servicios.component.css']
})
export class ClaveProductosServiciosComponent implements OnInit {
  claveProductosServiciosExcele = [];
  cargando = true;
  totalRegistros = 0;

  displayedColumns = ['actions', 'claveProdServ', 'descripcion', 'incluir_IVA_trasladado', 'incluir_IEPS_trasladado', 'palabras_similares'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private facturacionService: FacturacionService, private _excelService: ExcelService) { }

  ngOnInit() {
    this.cargarClaveProductosServicios();

  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalRegistros = this.dataSource.filteredData.length;
    } else {
      console.error('No se puede filtrar en un datasource vacío');
    }
  }

  cargarClaveProductosServicios() {
    this.cargando = true;
    this.facturacionService.getClaveproductosServicio().subscribe(objs => {
      this.dataSource = new MatTableDataSource(objs.ClaveProServicio);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = objs.ClaveProServicio.length;
    });
    this.cargando = false;
  }


  CreaDatosExcel(datos) {
    datos.forEach(p => {
      let impuestos = '';
      p.impuestos.forEach(i => {
        impuestos += i.impuesto + ' ' + i.valor + ', ';
      });
      impuestos = impuestos.substring(0, impuestos.length - 2);

      const productoServicio = {
        // Id: p._id,
        Codigo: p.codigo,
        Unidad: p.unidad,
        Descripcion: p.descripcion,
        ValorUnitario: p.valorUnitario,
        ClaveSAT: p.claveSAT,
        UnidadSAT: p.unidadSAT,
        Impuestos: impuestos,
        FAlta: p.fAlta.substring(0, 10)
      };
      this.claveProductosServiciosExcele.push(productoServicio);
    });
  }

 borrarClaveProductosServicios(claveProductosServicio: ClaveProductosServicio ) {
  swal({
    title: '¿Esta seguro?',
    text: 'Esta apunto de borrar a ' + claveProductosServicio.descripcion,
    icon: 'warning',
    buttons: true,
    dangerMode: true
  }).then(borrar => {
    if (borrar) {
      this.facturacionService.borrarClaveProductoServicio(claveProductosServicio._id).subscribe((res) => {
          // this.socket.emit('deletebuque', res);
          this.cargarClaveProductosServicios();
        });
    }
  });
 }

  exportAsXLSX(): void {
    this.CreaDatosExcel(this.dataSource.filteredData);
    if (this.claveProductosServiciosExcele) {
      this._excelService.exportAsExcelFile(this.claveProductosServiciosExcele, 'Productos-Servicios');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

}
