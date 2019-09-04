import { Component, OnInit, ViewChild } from '@angular/core';
import { ManiobraService } from '../maniobras/maniobra.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from 'src/app/models/usuarios.model';
import { UsuarioService } from 'src/app/services/service.index';

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

  displayedColumns = ['Naviera', 'Contenedor', 'Tipo', 'Estado', 'Cliente', 'A.A.', 'Lavado', 'FotosLavado', 'Reparaciones', 'FotosReparacion', 'Grado'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public maniobraService: ManiobraService, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.cargarManiobras();
  }

  cargarManiobras() {
    this.cargando = true;
    this.maniobraService.getManiobrasLavadoReparacion(this.usuarioLogueado.empresas[0]._id)
      .subscribe(maniobras => {
        console.log(maniobras.maniobras)
        this.dataSource = new MatTableDataSource(maniobras.maniobras);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalRegistros = maniobras.maniobras.length;
      });
    this.cargando = false;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.totalRegistros = this.dataSource.filteredData.length;
  }


}
