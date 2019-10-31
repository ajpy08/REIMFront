import { Component, OnInit, ViewChild } from '@angular/core';
import { ManiobraService } from '../maniobras/maniobra.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from '../usuarios/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import { ROLES } from 'src/app/config/config';
import { Maniobra } from 'src/app/models/maniobra.models';

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
  totalRegistros = 0;
  usuarioLogueado: Usuario;
  buque: string;
  viaje: string;
  fechaLlegadaInicio: string;
  fechaLlegadaFin: string

  displayedColumns = ['naviera', 'contenedor', 'tipo', 'estado', 'cliente', 'aa', 'lavado', 'fotoslavado', 'reparaciones', 'fotosreparacion', 'grado'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public maniobraService: ManiobraService, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.cargarManiobras();

    if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.PATIOADMIN_ROLE) {
      this.displayedColumns = ['actions', 'naviera', 'contenedor', 'tipo', 'estado', 'cliente', 'aa', 'lavado', 'fotoslavado', 'reparaciones', 'fotosreparacion', 'grado'];
    } else {
      this.displayedColumns = ['naviera', 'contenedor', 'tipo', 'estado', 'cliente', 'aa', 'lavado', 'fotoslavado', 'reparaciones', 'fotosreparacion', 'grado'];
    }
  }

  cargarManiobras() {
    if (this.usuarioLogueado.empresas.length > 0) {
      this.cargando = true;
      this.maniobraService.getManiobrasConLavadoReparacion(this.usuarioLogueado.empresas[0]._id,
        this.buque, this.viaje, this.fechaLlegadaInicio, this.fechaLlegadaFin)
        .subscribe(maniobras => {
          // console.log(maniobras.maniobras)
          this.dataSource = new MatTableDataSource(maniobras.maniobras);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalRegistros = maniobras.maniobras.length;
        });
      this.cargando = false;
    } else {
      if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.PATIOADMIN_ROLE) {
        this.cargando = true;
        this.maniobraService.getManiobrasConLavadoReparacion(null,
          this.buque, this.viaje, this.fechaLlegadaInicio, this.fechaLlegadaFin)
          .subscribe(maniobras => {
            // console.log(maniobras.maniobras)
            this.dataSource = new MatTableDataSource(maniobras.maniobras);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalRegistros = maniobras.maniobras.length;
          });
        this.cargando = false;
      }
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.totalRegistros = this.dataSource.filteredData.length;
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
}
