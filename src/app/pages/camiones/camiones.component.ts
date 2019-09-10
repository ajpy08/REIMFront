import { Component, OnInit, ViewChild } from '@angular/core';
import { Camion } from './camion.models';
import { CamionService, UsuarioService } from '../../services/service.index';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Usuario } from '../usuarios/usuario.model';
import { ROLES } from 'src/app/config/config';
declare var swal: any;
@Component({
  selector: 'app-camiones',
  templateUrl: './camiones.component.html',
  styles: []
})
export class CamionesComponent implements OnInit {
  usuarioLogueado: Usuario;
  camiones: Camion[] = [];
  cargando: boolean = true;
  totalRegistros: number = 0;

  displayedColumns = ['actions', 'transportista.razonSocial', 'noEconomico', 'placa', 'vigenciaSeguro', 'pdfSeguro'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public _camionService: CamionService,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuarioLogueado = this.usuarioService.usuario;
    this.cargarCamiones();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.totalRegistros = this.dataSource.filteredData.length;
  }

  cargarCamiones() {
    this.cargando = true;
    if (this.usuarioLogueado.role == ROLES.ADMIN_ROLE || this.usuarioLogueado.role == ROLES.REIMADMIN_ROLE) {
      this._camionService.getCamiones()
        .subscribe(camiones => {
          this.dataSource = new MatTableDataSource(camiones.camiones);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalRegistros = camiones.camiones.length;

          this.cargando = false;
        });
    } else {
      if (this.usuarioLogueado.role == ROLES.TRANSPORTISTA_ROLE) {
        this._camionService.getCamiones(this.usuarioLogueado.empresas[0]._id)
          .subscribe(camiones => {
            this.dataSource = new MatTableDataSource(camiones.camiones);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalRegistros = camiones.camiones.length;
            
            this.cargando = false;
          });
      }
    }
  }

  borrarCamion(camion: Camion) {
    swal({
      title: '¿Esta seguro?',
      text: 'Esta apunto de borrar a ' + camion.noEconomico,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this._camionService.borrarCamion(camion._id)
            .subscribe(borrado => {
              this.cargarCamiones();
            });
        }
      });
  }
}
