import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ManiobraService } from '../maniobra.service';
import { ESTADOS_CONTENEDOR, ETAPAS_MANIOBRA } from '../../../config/config';
import { Maniobra } from 'src/app/models/maniobra.models';
import { UsuarioService, ExcelService } from 'src/app/services/service.index';
import { ROLES } from 'src/app/config/config';
import { Usuario } from '../../usuarios/usuario.model';
declare var swal: any;

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
})
export class InventarioComponent implements OnInit {

  usuarioLogueado: Usuario;
  cargando = true;
  totalRegistros: number = 0;
  totalRegistrosLR: number = 0;
  displayedColumns = ['fLlegada', 'viaje', 'nombre', 'fVigenciaTemporal', 'pdfTemporal', 'contenedor', 'tipo', 'peso', 'grado'];
  displayedColumnsLR = ['fLlegada', 'viaje', 'nombre', 'contenedor', 'tipo', 'peso', 'grado', 'lavado', 'reparaciones'];
  dataSource: any;
  dataSourceLR: any;
  c40: any;
  c20: any;
  groupedDisponibles20: any;
  groupedDisponibles40: any;
  datosExcel = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('MatPaginatorLR', { read: MatPaginator }) MatPaginatorLR: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("MatSort2") MatSort2: MatSort;
  constructor(public maniobraService: ManiobraService, private usuarioService: UsuarioService,
    private _excelService: ExcelService) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.cargarInventario();

    if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.REIMADMIN_ROLE) {
      this.displayedColumnsLR = ['actions', 'fLlegada', 'viaje', 'nombre', 'contenedor', 'tipo', 'peso', 'grado', 'lavado', 'reparaciones'];
    } else {
      this.displayedColumnsLR = ['fLlegada', 'viaje', 'nombre', 'contenedor', 'tipo', 'peso', 'grado', 'lavado', 'reparaciones'];
    }
  }

  applyFilter(filterValue: string, dataSource: any, totalRegistros: number) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    dataSource.filter = filterValue;
    totalRegistros = dataSource.filteredData.length;
  }

  cargarInventario() {
    this.cargando = true;
    if (this.usuarioLogueado.empresas.length > 0) {
      this.maniobraService.getManiobras('D', ETAPAS_MANIOBRA.DISPONIBLE, null, null, null, null, null, null, this.usuarioLogueado.empresas[0]._id)
        .subscribe(maniobras => {

          this.c20 = maniobras.maniobras.filter(m => m.tipo.includes('20'));

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
    } else {

      this.maniobraService.getManiobras('D', ETAPAS_MANIOBRA.DISPONIBLE)
        .subscribe(maniobras => {
          this.c20 = maniobras.maniobras.filter(m => m.tipo.includes('20'));

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
    this.cargarLR();
  }

  cargarLR() {
    if (this.usuarioLogueado.empresas.length > 0) {
      this.cargando = true;
      this.maniobraService.getManiobrasNaviera(ETAPAS_MANIOBRA.LAVADO_REPARACION, this.usuarioLogueado.empresas[0]._id)
        .subscribe(maniobras => {
          this.dataSourceLR = new MatTableDataSource(maniobras.maniobras);
          this.dataSourceLR.sort = this.MatSort2;
          this.dataSourceLR.paginator = this.MatPaginatorLR;
          this.totalRegistrosLR = maniobras.total;
        });
      this.cargando = false;
    } else {
      if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.REIMADMIN_ROLE) {
        this.cargando = true;
        this.maniobraService.getManiobrasNaviera(ETAPAS_MANIOBRA.LAVADO_REPARACION)
          .subscribe(maniobras => {
            this.dataSourceLR = new MatTableDataSource(maniobras.maniobras);
            this.dataSourceLR.sort = this.MatSort2;
            this.dataSourceLR.paginator = this.MatPaginatorLR;
            this.totalRegistrosLR = maniobras.total;
          });
        this.cargando = false;
      }
    }
  }

  mostrarFotosReparaciones(maniobra: Maniobra) {
    if (this.usuarioLogueado.role === ROLES.ADMIN_ROLE || (this.usuarioLogueado.role === ROLES.NAVIERA_ROLE && maniobra.mostrarFotosRNaviera)) {
      return true;
    } else if (this.usuarioLogueado.role === ROLES.AA_ROLE && maniobra.mostrarFotosRAA) {
      return true;
    } else {
      return false;
    }
  }

  CreaDatosExcel(datos) {
    //console.log(datos)
    datos.forEach(d => {
      // console.log(d)
      var dato = {
        EntradaPatio: d.fLlegada,
        Viaje: d.viaje.viaje,
        Buque: d.viaje.buque.nombre,
        VigenciaTemporal: d.viaje.fVigenciaTemporal,
        Contenedor: d.contenedor,
        Tipo: d.tipo,
        Estado: d.peso,
        Grado: d.grado,
        // operador: d.operador != undefined ? d.operador.nombre : '',
        FAlta: d.fAlta.substring(0, 10)
      };
      this.datosExcel.push(dato);
    });
  }

  exportAsXLSX(dataSource, nombre: string): void {
    this.CreaDatosExcel(dataSource.filteredData);
    if (this.datosExcel) {
      this._excelService.exportAsExcelFile(this.datosExcel, nombre);
    } else {
      swal('No se puede exportar un excel vacio', '', 'error');
    }
  }

  cuentaInventario(grado: string, estatus: string, source: any): number {
    let count = 0;
    source.forEach(d => {
      if (d.grado == grado && d.estatus == estatus) {
        count++;
      }
    });
    return count;
  }

  cuentaReparaciones(grado: string, tipo: string, source: any): number {
    let count = 0;
    source.forEach(d => {
      if (d.grado == grado && d.tipo == tipo && d.reparaciones.length > 0) {
        count++;
      }
      // } else if (grado == '' && d.tipo == tipo && d.reparaciones.length > 0) {
      //   count++;
      // }
    });
    return count;
  }
}