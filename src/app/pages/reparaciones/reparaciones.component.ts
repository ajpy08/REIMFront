import { Component, OnInit, ViewChild } from '@angular/core';
import { Reparacion } from 'src/app/pages/reparaciones/reparacion.models';
import { ReparacionService } from 'src/app/pages/reparaciones/reparacion.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ExcelService } from 'src/app/services/service.index';
declare var swal: any;

@Component({
  selector: 'app-reparaciones',
  templateUrl: './reparaciones.component.html',
  styleUrls: []
})

export class ReparacionesComponent implements OnInit {

  reparaciones: Reparacion[] = [];
  cargando: boolean = true;
  totalRegistros: number = 0;
  reparacionesExcel = [];


  displayedColumns = ['actions', 'descripcion', 'costo'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public reparacionService: ReparacionService, private excelService: ExcelService) { }

  ngOnInit() {
    localStorage.removeItem('historyArray')
    this.cargarReparaciones();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.totalRegistros = this.dataSource.filteredData.length;
  }

  cargarReparaciones() {
    this.cargando = true;
    this.reparacionService.getReparaciones().subscribe((reparaciones) => {
      this.dataSource = new MatTableDataSource(reparaciones.reparaciones);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = reparaciones.reparaciones.length;
      });
      this.cargando = false;
  }

  borrarReparacion(reparacion: Reparacion) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + reparacion.descripcion,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((borrar) => {
      if (borrar) {
        this.reparacionService.borrarReparacion(reparacion._id).subscribe(() => {
          this.cargarReparaciones();
        });
      }
    });
  }


  crearDatosExcel(datos) {
    datos.forEach(d => {
      var reparaciones = {
        Descripcion: d.descripción,
        Costo: d.costo
      }
    this.reparacionesExcel.push(reparaciones);
    });
  }

  exportarXLSX(): void {
    this.crearDatosExcel(this.dataSource.filteredData);
    if(this.reparacionesExcel){
      this.excelService.exportAsExcelFile(this.reparacionesExcel, 'Reparaciones');
    }else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }
}
