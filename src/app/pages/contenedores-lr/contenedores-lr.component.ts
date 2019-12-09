import { Component, OnInit, ViewChild } from '@angular/core';
import { ManiobraService } from '../maniobras/maniobra.service';
import { MatPaginator, MatSort, MatTableDataSource, MatTabChangeEvent, MatTabGroup } from '@angular/material';
import { Usuario } from '../usuarios/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import { ROLES } from 'src/app/config/config';
import { Maniobra } from 'src/app/models/maniobra.models';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-contenedores-lr',
  templateUrl: './contenedores-lr.component.html',
  styles: ['']
})
export class ContenedoresLRComponent implements OnInit {
  //date = new FormControl(moment());
  maniobras: any[] = [];
  data: any = { fechaCreado: '' };
  cargando = true;
  totalRegistrosLavados = 0;
  totalRegistrosReparaciones = 0;
  usuarioLogueado: Usuario;
  buque: string;
  viaje: string;
  fechaLlegadaInicio: string;
  fechaLlegadaFin: string

  displayedColumnsLavado = ['naviera', 'contenedor', 'tipo', 'estado', 'cliente', 'aa', 'lavado', 'fotoslavado', 'reparaciones', 'fotosreparacion', 'grado'];
  displayedColumnsReparacion = ['naviera', 'contenedor', 'tipo', 'estado', 'cliente', 'aa', 'lavado', 'fotoslavado', 'reparaciones', 'fotosreparacion', 'grado'];
  dataSourceLavados: any;
  dataSourceReparaciones: any;

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('MatPaginatorReparacion', { read: MatPaginator }) MatPaginatorReparacion: MatPaginator;
  @ViewChild('MatSortReparacion') MatSortReparacion: MatSort;


  constructor(public maniobraService: ManiobraService, private usuarioService: UsuarioService, public router: Router) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;


    if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.PATIOADMIN_ROLE) {
      this.displayedColumnsLavado = ['actions', 'naviera', 'contenedor', 'tipo', 'estado', 'cliente', 'aa', 'lavado', 'fotoslavado', 'reparaciones', 'fotosreparacion', 'grado'];
      this.displayedColumnsReparacion = ['actions', 'naviera', 'contenedor', 'tipo', 'estado', 'cliente', 'aa', 'lavado', 'fotoslavado', 'reparaciones', 'fotosreparacion', 'grado'];
    } else {
      this.displayedColumnsLavado = ['naviera', 'contenedor', 'tipo', 'estado', 'cliente', 'aa', 'lavado', 'fotoslavado', 'reparaciones', 'fotosreparacion', 'grado'];
      this.displayedColumnsReparacion = ['naviera', 'contenedor', 'tipo', 'estado', 'cliente', 'aa', 'lavado', 'fotoslavado', 'reparaciones', 'fotosreparacion', 'grado'];
    }
    let indexTAB = localStorage.getItem("L/R");
    if (indexTAB) {
      this.tabGroup.selectedIndex = Number.parseInt(indexTAB);
    }
    this.cargarManiobrasLavadoOReparacion('L');
    this.cargarManiobrasLavadoOReparacion('R');
  }

  cargarManiobrasLavadoOReparacion(LR: string) {
    if (this.usuarioLogueado.role == ROLES.NAVIERA_ROLE && this.usuarioLogueado.empresas.length > 0) {
      this.cargando = true;
      this.maniobraService.getManiobrasLavadoOReparacion(this.usuarioLogueado.empresas[0]._id,
        this.buque, this.viaje, this.fechaLlegadaInicio, this.fechaLlegadaFin, LR)
        .subscribe(maniobras => {
          // console.log(maniobras.maniobras)
          if (LR === 'L') {
            this.dataSourceLavados = new MatTableDataSource(maniobras.maniobras);
            this.dataSourceLavados.sort = this.sort;
            this.dataSourceLavados.paginator = this.paginator;
            this.totalRegistrosLavados = maniobras.maniobras.length;

          } else if (LR === 'R') {
            this.dataSourceReparaciones = new MatTableDataSource(maniobras.maniobras);
            this.dataSourceReparaciones.sort = this.MatSortReparacion;
            this.dataSourceReparaciones.paginator = this.MatPaginatorReparacion;
            this.totalRegistrosReparaciones = maniobras.maniobras.length;
          }
        });
      this.cargando = false;
    } else {
      if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.PATIOADMIN_ROLE || this.usuarioLogueado.role == ROLES.PATIO_ROLE) {
        this.cargando = true;
        this.maniobraService.getManiobrasLavadoOReparacion(null,
          this.buque, this.viaje, this.fechaLlegadaInicio, this.fechaLlegadaFin, LR)
          .subscribe(maniobras => {
            if (LR === 'L') {
              this.dataSourceLavados = new MatTableDataSource(maniobras.maniobras);
              this.dataSourceLavados.sort = this.sort;
              this.dataSourceLavados.paginator = this.paginator;
              this.totalRegistrosLavados = maniobras.maniobras.length;
            } else if (LR === 'R') {
              this.dataSourceReparaciones = new MatTableDataSource(maniobras.maniobras);
              this.dataSourceReparaciones.sort = this.MatSortReparacion;
              this.dataSourceReparaciones.paginator = this.MatPaginatorReparacion;
              this.totalRegistrosReparaciones = maniobras.maniobras.length;
            }
          });
        this.cargando = false;
      }
    }
  }

  applyFilter(filterValue: string, LR: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    if (LR === 'L') {
      this.dataSourceLavados.filter = filterValue;
      this.totalRegistrosLavados = this.dataSourceLavados.filteredData.length;
    } else if (LR === 'R') {
      this.dataSourceReparaciones.filter = filterValue;
      this.totalRegistrosReparaciones = this.dataSourceReparaciones.filteredData.length;
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

  fotos(id: string, tipo: string) {
    // localStorage.setItem('history', '/contenedoresLR');

    let navigationExtras: NavigationExtras = {
      queryParams: { 'opcion': tipo }
    };

    this.router.navigate(['/fotos', id], navigationExtras);
  }

  onLinkClick(event: MatTabChangeEvent) {
    localStorage.setItem("L/R", event.index.toString());
  }

  open(id: string) {
    var history;
    var array = [];
    //Si tengo algo en localStorage en la variable history lo obtengo
    if (localStorage.getItem('historyArray')) {
      //asigno a mi variable history lo que obtengo de localStorage (historyArray)
      history = JSON.parse(localStorage.getItem('historyArray'));

      //realizo este ciclo para asignar los valores del JSON al Array
      for (var i in history) {
        array.push(history[i]);
      }
    }
    //Agrego mi nueva ruta al array
    array.push("/contenedoresLR");


    ////sobreescribo la variable historyArray de localStorage con el nuevo JSON que incluye ya, la nueva ruta.
    localStorage.setItem('historyArray', JSON.stringify(array));

    //Voy a pagina.
    this.router.navigate(['/maniobras/maniobra/' + id + '/detalle']);
  }
}
