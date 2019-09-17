import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ManiobraService } from '../maniobra.service';
import { ESTADOS_CONTENEDOR, ETAPAS_MANIOBRA } from '../../../config/config';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styles: ['']
})
export class InventarioComponent implements OnInit {

  cargando = true;
  totalRegistros: number = 0;
  desde: number = 0;
  maniobras: any[] = [];

  displayedColumns = ['EntradaPatio', 'Viaje', 'Buque', 'VigenciaTemporal', 'Temporal', 'Contenedor', 'Tipo', 'Estado', 'Grado'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public maniobraService: ManiobraService) { }

  ngOnInit() {
    this.cargarInventario();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.totalRegistros = this.dataSource.filteredData.length;
  }

  cargarInventario() {
    this.cargando = true;

    this.maniobraService.getManiobras('D',ETAPAS_MANIOBRA.DISPONIBLE)
      .subscribe(maniobras => {
        this.dataSource = new MatTableDataSource(maniobras.maniobras);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = maniobras.maniobras.length;
      });
    this.cargando = false;
  }
}
