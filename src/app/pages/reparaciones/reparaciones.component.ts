import { Component, OnInit, ViewChild } from '@angular/core';
import { Reparacion } from 'src/app/models/reparacion.models';
import { ReparacionService } from 'src/app/services/reparacion/reparacion.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
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
  desde: number = 0;

  displayedColumns = ['actions', 'descripcion', 'costo'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public reparacionService: ReparacionService) { }

  ngOnInit() {
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
    this.reparacionService.getReparaciones(this.desde).subscribe((reparaciones) => {
      this.dataSource = new MatTableDataSource(reparaciones.reparaciones);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = reparaciones.reparaciones.length;
      });
      this.cargando = false;
  }

  // cambiarDesde(valor: number) {
  //   let desde = this.desde + valor;
  //   if (desde >= this.totalRegistros) {
  //     return;
  //   }
  //   if (desde < 0) {
  //     return;
  //   }
  //   this.desde += valor;
  //   this.cargarReparaciones();
  // }

  buscarReparacion(termino: string) {
    if (termino.length <= 0) {
      this.cargarReparaciones();
      return;
    }
    this.cargando = true;
    this.reparacionService.buscarReparacion(termino).subscribe((reparaciones: Reparacion[]) => {
      this.reparaciones = reparaciones;
      this.cargando = false;
    });
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
}
