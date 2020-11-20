import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ProductoServicio } from '../models/producto-servicio.models';
import { FacturacionService, ExcelService } from '../../../services/service.index';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { URL_SOCKET_IO, PARAM_SOCKET } from '../../../../environments/environment';
// import * as io from 'socket.io-client';

declare var swal: any;

@Component({
  selector: 'app-productos-servicios',
  templateUrl: './productos-servicios.component.html',
  styleUrls: ['./productos-servicios.component.css']
})
export class ProductosServiciosComponent implements OnInit {
  productosServiciosExcel = [];
  cargando = true;
  totalRegistros = 0;

  displayedColumns = ['actions', 'codigo', 'descripcion', 'valorUnitario', 'claveSAT', 'unidadSAT', 'impuestos', 'fAlta'];
  dataSource: any;
  // socket = io(URL_SOCKET_IO, PARAM_SOCKET );

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private facturacionService: FacturacionService,
    private _excelService: ExcelService) { }

  ngOnInit() {
    // localStorage.removeItem('historyArray');
    this.cargarProductosServicios();
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

  cargarProductosServicios() {
    this.cargando = true;
    this.facturacionService.getProductosServicios().subscribe(objs => {
      this.dataSource = new MatTableDataSource(objs.productos_servicios);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = objs.productos_servicios.length;
    });
    this.cargando = false;
  }

  borrarProductoServicio(productoServicio: ProductoServicio) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + productoServicio.codigo,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this.facturacionService.borrarProductoServicio(productoServicio._id).subscribe((res) => {
            // this.socket.emit('deletebuque', res);
            this.cargarProductosServicios();
          });
      }
    });
  }

  nombreImpuesto(impuesto: string) {
    if (impuesto === '001') {
      return 'ISR';
    } else {
      if (impuesto === '002') {
        return 'IVA';
      } else {
        if (impuesto === '003') {
          return 'IEPS';
        } else {}
      }
    }
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
      this.productosServiciosExcel.push(productoServicio);
    });
  }

  exportAsXLSX(): void {
    this.CreaDatosExcel(this.dataSource.filteredData);
    if (this.productosServiciosExcel) {
      this._excelService.exportAsExcelFile(this.productosServiciosExcel, 'Productos-Servicios');
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
}
