import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ManiobraService } from '../maniobra.service';
import { ESTADOS_CONTENEDOR, ETAPAS_MANIOBRA } from '../../../config/config';
import { Maniobra } from 'src/app/models/maniobra.models';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
})
export class InventarioComponent implements OnInit {

  cargando = true;
  totalRegistros: number = 0;
  // totalRegistros20: number = 0;
  // totalRegistros40: number = 0;
  displayedColumns = ['fLlegada', 'viaje', 'nombre', 'fVigenciaTemporal', 'pdfTemporal', 'contenedor', 'tipo', 'peso', 'grado'];
  dataSource: any;
  // dataSource20: any;
  // dataSource40: any;
  c40: any;
  c20: any;
  groupedDisponibles20: any;
  groupedDisponibles40: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public maniobraService: ManiobraService) { }

  ngOnInit() {
    this.cargarInventario();
  }

  applyFilter(filterValue: string, dataSource: any, totalRegistros: number) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    dataSource.filter = filterValue;
    totalRegistros = dataSource.filteredData.length;
  }

  cargarInventario() {
    this.cargando = true;
    this.maniobraService.getManiobras('D', ETAPAS_MANIOBRA.DISPONIBLE)
      .subscribe(maniobras => {

        this.c20 = maniobras.maniobras.filter(m => m.tipo.includes('20'));
        // this.dataSource20 = new MatTableDataSource(c20);
        // this.dataSource20.sort = this.sort;
        // this.dataSource20.paginator = this.paginator;
        //this.totalRegistros20 = c20.length;

        const grouped20 = this.c20.reduce((curr, m) => {
          if (!curr[m.tipo]) {
            // Si no has tenido ninguna entrada de ese tipo la agregas pero usando un arreglo
            curr[m.tipo] = [m];
          } else {
            // Si ya tienes ese tipo lo agregas al final del arreglo
            curr[m.tipo].push(m);
          }
          return curr;
        }, {});

        // Luego conviertes ese objeto en un arreglo que *ngFor puede iterar
        this.groupedDisponibles20 = Object.keys(grouped20).map(tipo => {
          return {
            tipo: tipo,
            maniobras: grouped20[tipo]
          };
        });

        this.c40 = maniobras.maniobras.filter(m => m.tipo.includes('40'));
        // this.dataSource40 = new MatTableDataSource(c40);
        // this.dataSource40.sort = this.sort;
        // this.dataSource40.paginator = this.paginator;
        //this.totalRegistros40 = c40.length;

        const grouped40 = this.c40.reduce((curr, m) => {
          if (!curr[m.tipo]) {
            // Si no has tenido ninguna entrada de ese tipo la agregas pero usando un arreglo
            curr[m.tipo] = [m];
          } else {
            // Si ya tienes ese tipo lo agregas al final del arreglo
            curr[m.tipo].push(m);
          }
          return curr;
        }, {});

        // Luego conviertes ese objeto en un arreglo que *ngFor puede iterar
        this.groupedDisponibles40 = Object.keys(grouped40).map(tipo => {
          return {
            tipo: tipo,
            maniobras: grouped40[tipo]
          };
        });


        this.dataSource = new MatTableDataSource(maniobras.maniobras);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = maniobras.maniobras.length;
      });
    this.cargando = false;
  }
}
