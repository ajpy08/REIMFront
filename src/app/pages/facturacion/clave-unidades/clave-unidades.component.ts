import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FacturacionService } from '../facturacion.service';
import { ExcelService } from './../../../services/excel/excel.service';
import { ClaveProductosServicio } from '../clave-productos-servicios/clave-producto.servicio.models';
declare var swal: any;

@Component({
  selector: 'app-clave-unidades',
  templateUrl: './clave-unidades.component.html',
  styleUrls: ['./clave-unidades.component.css']
})
export class ClaveUnidadesComponent implements OnInit {
  claveUnidadExcele = [];
  cargando = true;
  totalRegistros = 0;
  displayedColumns = ['actions', 'claveUnidad', 'nombre', 'descripcion', 'nota'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private facturacionService: FacturacionService, private _excelService: ExcelService) { }

  ngOnInit() {
    this.cargarClaveUnidad();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.filter = filterValue;
      this.totalRegistros = this.dataSource.filteredData.length;
    } else {
      console.error('Error al filtrar el dataSource de Clave Unidad');
    }
  }


  cargarClaveUnidad() {
    this.cargando = true;
    this.facturacionService.getClaveUnidades().subscribe(objs => {
      this.dataSource = new MatTableDataSource(objs.clave_unidad);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.totalRegistros = objs.clave_unidad.length;
    });
    this.cargando = false;
  }

  exportAsXLSX() {

  }

  borrarClaveUnidad(ClaveUnidadService: ClaveProductosServicio) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + ClaveUnidadService.claveProdServ,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(borrar => {
      if (borrar) {
        this.facturacionService.borrarClaveUnidad(ClaveUnidadService._id).subscribe((res) => {
            // this.socket.emit('deletebuque', res);
            this.cargarClaveUnidad();
          });
      }
    });
  }
}
